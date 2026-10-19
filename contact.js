/*
 * CONTACT.JS — DIRECT CUSTOMER INQUIRIES
 * Reads the #inquiry form in index.html and sends its fields to FormSubmit.
 * The visitor stays on this page; their email application is not opened.
 * The receiving inbox must be activated with FormSubmit before delivery works.
 */

// This immediately invoked function keeps contact variables separate from app.js.
(() => {
  // 01. EDIT: Receiving email. Also update the matching addresses in
  // index.html and contact-setup.html; see BEGINNER-GUIDE.md for the checklist.
  const endpoint = 'https://formsubmit.co/ajax/shivachaurasiya2026@gmail.com';

  // Find the form controls by their HTML id attributes.
  const form = document.getElementById('inquiry');
  const status = document.getElementById('form-status');
  const button = document.getElementById('send-inquiry');
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const serviceField = document.getElementById('service');
  const messageField = document.getElementById('message');
  const fields = [nameField, emailField, serviceField, messageField];
  let sending = false;

  // 02. FEEDBACK: data-state selects the pending/success/error styles in CSS.
  function showStatus(message, state) {
    status.textContent = message;
    status.dataset.state = state;
    if (state !== 'pending') status.focus({ preventScroll: true });
  }

  // Prevent duplicate clicks and keep the submitted fields stable during a request.
  function setSending(value) {
    sending = value;
    form.setAttribute('aria-busy', String(value));
    button.disabled = value;
    button.textContent = value ? 'Sending…' : 'Send message ↗';
    fields.forEach((field) => {
      field.disabled = value;
    });
  }

  // Clear old validation messages when the visitor begins editing again.
  form.addEventListener('input', () => {
    nameField.setCustomValidity('');
    messageField.setCustomValidity('');
    if (!sending) {
      status.textContent = '';
      delete status.dataset.state;
    }
  });

  // 03. SUBMISSION: validate, collect the fields, send, and show the result.
  form.addEventListener('submit', async (event) => {
    // Stop the browser's normal form navigation so the visitor stays on this page.
    event.preventDefault();
    if (sending) return;

    // Native HTML validation checks required fields/email; trim also rejects spaces.
    nameField.setCustomValidity(nameField.value.trim() ? '' : 'Please enter your name.');
    messageField.setCustomValidity(
      messageField.value.trim() ? '' : 'Please add a few details about your project.',
    );
    if (!form.reportValidity()) return;

    // A downloaded file can preview the design, but sending needs an HTTP(S) host.
    if (!/^https?:$/.test(window.location.protocol)) {
      showStatus(
        'Please open the hosted website to send your message. Your details are still here.',
        'error',
      );
      return;
    }

    // Read FormData BEFORE disabling fields; disabled inputs are not included.
    const data = new FormData(form);
    // _honey is the hidden spam trap. A real visitor should leave it empty.
    if (String(data.get('_honey') || '').trim()) {
      showStatus(
        'This submission could not be accepted. Please refresh the page and try again.',
        'error',
      );
      return;
    }

    // Use the same form identity for / and /index.html, including subfolder hosts.
    const page = new URL('./', window.location.href);
    // FormSubmit uses the underscore-prefixed settings below.
    // _replyto makes your email reply go to the visitor, not the delivery service.
    const payload = {
      name: String(data.get('name')).trim(),
      email: String(data.get('email')).trim(),
      service: String(data.get('service')),
      message: String(data.get('message')).trim(),
      _subject: 'Portfolio inquiry: ' + String(data.get('service')),
      _replyto: String(data.get('email')).trim(),
      _template: 'table',
      _honey: '',
      _url: page.href,
    };

    setSending(true);
    showStatus('Sending your message…', 'pending');
    // Stop waiting after 20 seconds if the service never responds.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      // fetch sends JSON in the background. No mailto link or popup is used here.
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'omit',
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json();
      // An activation notice is not delivery success, even if success says "true".
      if (/activat|confirm.*(?:email|form)|verif.*email/i.test(String(result.message || ''))) {
        showStatus(
          'Email delivery has not been activated yet. The portfolio owner needs to confirm the FormSubmit activation email. Your message is still here.',
          'error',
        );
        return;
      }
      // Accept only an OK HTTP response AND an explicit true success value.
      if (!response.ok || (result.success !== true && result.success !== 'true')) {
        showStatus(
          response.status === 429
            ? 'Too many attempts. Please wait a minute before trying again. Your details are still here.'
            : 'Your message was not accepted. Your details are still here; please try again in a moment.',
          'error',
        );
        return;
      }
      // Clear the visitor's details only after the provider accepts the submission.
      form.reset();
      showStatus('Thank you—your inquiry has been submitted. I’ll reply by email.', 'success');
    } catch {
      // Network errors, timeouts, and unreadable responses keep all typed details.
      showStatus(
        'We couldn’t confirm your submission. Your details are still here. Check your connection and wait a moment before trying again.',
        'error',
      );
    } finally {
      // Runs after success or failure, including early returns inside try.
      clearTimeout(timeout);
      setSending(false);
    }
  });

  // The HTML starts disabled; enable it only after our submit handler is attached.
  button.disabled = false;
})();
