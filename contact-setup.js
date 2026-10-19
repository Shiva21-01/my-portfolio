/*
 * CONTACT-SETUP.JS — ONE-TIME OWNER ACTIVATION HELP
 * Loaded only by contact-setup.html. The HTML form performs a normal POST
 * when the owner clicks its button. This script does not send requests itself.
 */

// Keep setup-page variables separate from other page scripts.
(() => {
  const form = document.getElementById('activation-form');
  const status = document.getElementById('setup-status');
  const button = document.getElementById('request-activation');
  // Opening a downloaded HTML file is enough for viewing, but not for setup.
  if (!/^https?:$/.test(window.location.protocol)) {
    button.disabled = true;
    status.textContent = 'Open this setup page on your hosted website to request activation.';
    return;
  }
  // Use the same folder URL as contact.js, even on another host or a subfolder.
  document.getElementById('activation-url').value = new URL('./', window.location.href).href;
  // Show instructions after the click. The inbox confirmation still happens manually.
  form.addEventListener('submit', () => {
    status.textContent =
      'Complete the FormSubmit step in the new tab, then check your Inbox and Spam. Delivery is ready only after you confirm the activation email.';
  });
})();
