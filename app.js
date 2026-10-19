/*
 * APP.JS — INTERACTIONS AND ANIMATIONS
 * This file is loaded at the end of index.html, after the page elements exist.
 * Each numbered section handles one feature. Search for EDIT for common updates.
 * The customer contact form is handled separately in contact.js.
 */

/* 01. PROJECT DETAILS — EDIT the text shown in each project popup.
 * Array positions start at 0 and match data-project in index.html.
 * Keep project card text in index.html in sync with these longer descriptions.
 */
const projects = [
  {
    title: 'Vistara',
    description: 'Property Rental & Management Platform',
    features: [
      'Dynamic property listings, secure user authentication, and interactive reservation booking workflows.',
      'RESTful backend APIs built with Node.js and Express to manage database queries and secure data flow.',
      'Responsive Tailwind CSS layouts and MongoDB schemas for user profiles and listings.',
    ],
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
  },
  {
    title: 'TradeVibe',
    description: 'Financial Market & Stock Trading Dashboard',
    features: [
      'Real-time trading simulation with interactive stock monitoring graphs, dynamic watchlists, and portfolio trackers.',
      'Server-side logic and database models for user orders, holdings, and portfolio fund calculations.',
      'Client-side rendering optimizations for smooth navigation and fast-loading market data updates.',
    ],
    tags: ['React.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
  },
  {
    title: 'Zoom Clone',
    description: 'Zoom-style real-time communication project',
    features: [
      'Peer-to-peer video communication with multi-user virtual meeting rooms and media controls.',
      'WebRTC protocols and signaling mechanisms for low-latency audio/video connections.',
      'Dashboard for room creation, participant management, and call controls.',
    ],
    tags: ['JavaScript', 'Node.js', 'WebRTC', 'Tailwind CSS'],
  },
];

/* 02. PROJECT POPUP — fill the dialog when a Project details button is clicked. */
const dialog = document.getElementById('project-dialog');
document.querySelectorAll('[data-project]').forEach((button) =>
  button.addEventListener('click', () => {
    // dataset.project reads the button's data-project attribute from the HTML.
    const project = projects[Number(button.dataset.project)];
    document.getElementById('dialog-title').textContent = project.title;
    document.getElementById('dialog-description').textContent = project.description;
    // Build real elements and use textContent so descriptions stay plain text.
    document.getElementById('dialog-features').replaceChildren(
      ...project.features.map((text) => {
        const listItem = document.createElement('li');
        listItem.textContent = text;
        return listItem;
      }),
    );
    document.getElementById('dialog-tags').replaceChildren(
      ...project.tags.map((text) => {
        const element = document.createElement('span');
        element.className = 'tag';
        element.textContent = text;
        return element;
      }),
    );
    dialog.showModal();
  }),
);
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
// Close on a click outside the popup; clicking inside its content keeps it open.
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  }
});

/* 03. MOBILE MENU AND FOOTER YEAR */
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('navigation');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
// Close the mobile menu after the visitor chooses a section.
nav.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }),
);
document.getElementById('year').textContent = new Date().getFullYear();

/* 04. ROTATING HERO TEXT AND THE MOTION ON/OFF BUTTON */
// Respect the visitor's reduced-motion setting before starting animations.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-toggle');
const rotatingCopy = document.querySelector('.rotating-copy');
// EDIT: These phrases follow "I work on" in the hero section.
const phrases = ['business websites.', 'custom web applications.', 'landing pages.'];
let phraseIndex = 0;
let motionTimer = null;
let textTimer = null;
let motionPaused = false;

// Clear both timers so repeated clicks never start duplicate animation loops.
function stopText() {
  clearInterval(motionTimer);
  clearTimeout(textTimer);
  rotatingCopy.classList.remove('changing');
}

// Fade the old phrase, wait 220 ms, then show the next phrase every 3.2 seconds.
function startText() {
  stopText();
  if (reducedMotion.matches || motionPaused) return;
  motionTimer = setInterval(() => {
    if (document.hidden) return;
    rotatingCopy.classList.add('changing');
    textTimer = setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      rotatingCopy.textContent = phrases[phraseIndex];
      rotatingCopy.classList.remove('changing');
    }, 220);
  }, 3200);
}
motionButton.addEventListener('click', () => {
  motionPaused = !motionPaused;
  document.body.classList.toggle('motion-paused', motionPaused);
  motionButton.setAttribute('aria-pressed', String(motionPaused));
  motionButton.textContent = motionPaused ? 'Motion: off' : 'Motion: on';
  startText();
});
reducedMotion.addEventListener('change', startText);
startText();

/* 05. SCROLL REVEALS AND ACTIVE NAVIGATION LINKS */
// IntersectionObserver tells us when a section enters the visible part of the page.
if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          reveals.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll('.section-head,.service,.about-panel,.contact-panel')
    .forEach((element) => {
      element.classList.add('reveal');
      reveals.observe(element);
    });
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.querySelectorAll('#navigation a').forEach((link) => {
            const active = link.getAttribute('href') === '#' + entry.target.id;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        }
      });
    },
    { rootMargin: '-15% 0px -55% 0px', threshold: 0 },
  );
  document.querySelectorAll('section[id]').forEach((element) => sectionObserver.observe(element));
}

/* 06. CODE EXAMPLES DISPLAYED IN THE HERO
 * EDIT the example name, roles, or colors here if you customize the introduction.
 * The backtick strings below contain code shown to visitors, not extra files.
 * intro/profile.js, intro/motion.css, and intro/profile.json are display labels.
 */
const codeExamples = {
  javascript: {
    file: 'intro/profile.js',
    code: `// My name. My work. One introduction.
const profile = {
  name: 'Shiva Kant Chaurasiya',
  roles: ['Freelancer', 'Web Developer', 'Full Stack Developer'],
};
document.querySelector('.name').textContent = profile.name;
const roles = document.querySelector('.roles');
roles.replaceChildren(
  ...profile.roles.map((role, index) => {
    const line = document.createElement('span');
    line.textContent = role;
    line.style.setProperty('--index', index);
    return line;
  }),
);`,
  },
  css: {
    file: 'intro/motion.css',
    code: `/* A soft entrance and a rotating role line. */
.name {
  animation: arrive 800ms ease both;
}
.roles span {
  animation: roleCycle 9s ease-in-out infinite;
  animation-delay: calc(var(--index) * 3s);
}
@keyframes arrive {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes roleCycle {
  0%,
  28% {
    opacity: 1;
    transform: translateY(0);
  }
  33%,
  95% {
    opacity: 0;
    transform: translateY(-12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}`,
  },
  config: {
    file: 'intro/profile.json',
    code: `{
  "name": "Shiva Kant Chaurasiya",
  "roles": ["Freelancer", "Web Developer", "Full Stack Developer"],
  "accent": "#2563EB",
  "background": "#F8FAFC"
}`,
  },
};

/* 07. DEMO TABS, SYNTAX COLORS, AND COPY BUTTON */
let currentLanguage = 'javascript';
const codeOutput = document.getElementById('code-example');
const codeTabs = [...document.querySelectorAll('[data-language]')];
const copyButton = document.getElementById('copy-code');
const copyFeedback = document.getElementById('copy-feedback');
let copyReset;

// Split sample code into colored tokens without inserting it as HTML.
function highlightCode(source) {
  // Small, dependency-free highlighter for these three fixed examples.
  const pattern =
    /(\/\/[^\n]*|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:const|async|await|try|catch|def|if|not|raise|return|str|float|dict)\b|\b\d+(?:\.\d+)?\b)/g;
  const fragments = [];
  let lastTokenEnd = 0;
  for (const match of source.matchAll(pattern)) {
    fragments.push(document.createTextNode(source.slice(lastTokenEnd, match.index)));
    const token = document.createElement('span');
    const value = match[0];
    // Choose the matching CSS class for this piece of the example code.
    let tokenType = 'keyword';
    if (value.startsWith('//') || value.startsWith('#')) {
      tokenType = 'comment';
    } else if (/^["']/.test(value)) {
      tokenType = 'string';
    } else if (/^\d/.test(value)) {
      tokenType = 'number';
    }
    token.className = 'syntax-' + tokenType;
    token.textContent = value;
    fragments.push(token);
    lastTokenEnd = match.index + value.length;
  }
  fragments.push(document.createTextNode(source.slice(lastTokenEnd)));
  codeOutput.replaceChildren(...fragments);
}

// Update the selected tab, code panel, and accessible keyboard focus state.
function selectCodeTab(tab, focus = false) {
  currentLanguage = tab.dataset.language;
  codeTabs.forEach((candidateTab) => {
    const selected = candidateTab === tab;
    candidateTab.setAttribute('aria-selected', String(selected));
    candidateTab.tabIndex = selected ? 0 : -1;
  });
  document.getElementById('code-panel').setAttribute('aria-labelledby', tab.id);
  document.querySelector('.editor-file').textContent = codeExamples[currentLanguage].file;
  highlightCode(codeExamples[currentLanguage].code);
  clearTimeout(copyReset);
  copyButton.textContent = 'Copy code';
  copyFeedback.textContent = 'Copy or run this example.';
  document.getElementById('run-status').textContent =
    'Ready: ' + codeExamples[currentLanguage].file;
  if (focus) tab.focus();
}

// Arrow keys, Home, and End let keyboard users navigate the code tabs.
codeTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectCodeTab(tab));
  tab.addEventListener('keydown', (event) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % codeTabs.length;
    else if (event.key === 'ArrowLeft') next = (index + codeTabs.length - 1) % codeTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = codeTabs.length - 1;
    else return;
    event.preventDefault();
    selectCodeTab(codeTabs[next], true);
  });
});

// If clipboard permission is unavailable, select the code for manual copying.
copyButton.addEventListener('click', async () => {
  const source = codeExamples[currentLanguage].code;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(source);
    copyButton.textContent = 'Copied!';
    copyFeedback.textContent = 'Copied to clipboard';
    clearTimeout(copyReset);
    copyReset = setTimeout(() => {
      copyButton.textContent = 'Copy code';
      copyFeedback.textContent = 'Copy or run this example.';
    }, 2200);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(codeOutput);
    selection.removeAllRanges();
    selection.addRange(range);
    copyFeedback.textContent = 'Code selected. Press Ctrl+C or ⌘C.';
  }
});
selectCodeTab(codeTabs[0]);

/* 08. PROJECT PREVIEW TILT — only for mouse-like pointers with motion enabled. */
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const tiltPreviews = [...document.querySelectorAll('.project .mock')];
function resetTilt(element) {
  element.classList.remove('tilting');
  element.style.setProperty('--tilt-x', '0deg');
  element.style.setProperty('--tilt-y', '0deg');
}
tiltPreviews.forEach((element) => {
  let frame = 0;
  element.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || motionPaused || !finePointer.matches) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (reducedMotion.matches || motionPaused) return;
      const box = element.getBoundingClientRect();
      // Convert the pointer position to a 0–1 range within this preview.
      const x = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
      const y = Math.max(0, Math.min(1, (event.clientY - box.top) / box.height));
      element.classList.add('tilting');
      element.style.setProperty('--tilt-x', (0.5 - y) * 10 + 'deg');
      element.style.setProperty('--tilt-y', (x - 0.5) * 10 + 'deg');
      element.style.setProperty('--glare-x', x * 100 + '%');
      element.style.setProperty('--glare-y', y * 100 + '%');
    });
  });
  ['pointerleave', 'pointercancel'].forEach((event) =>
    element.addEventListener(event, () => {
      cancelAnimationFrame(frame);
      resetTilt(element);
    }),
  );
});
reducedMotion.addEventListener('change', () => tiltPreviews.forEach(resetTilt));
motionButton.addEventListener('click', () => tiltPreviews.forEach(resetTilt));

/* 09. SKILL CARD ENTRANCES — reveal each card once when it becomes visible. */
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const skillGrid = document.querySelector('.skill-card-grid');
  const skillObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('skill-visible');
          skillObserver.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  skillGrid.classList.add('skills-animated');
  skillGrid.querySelectorAll('.skill-card').forEach((card) => skillObserver.observe(card));
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      skillGrid.classList.remove('skills-animated');
      skillObserver.disconnect();
    }
  });
}

/* 10. LIVE INTRODUCTION PREVIEW INSIDE A SANDBOXED IFRAME */
// Its CSS is separate from the portfolio page; index.html keeps the sandbox in place.
const demoFrame = document.getElementById('demo-frame');
const runButton = document.getElementById('run-code');

// Build a small standalone HTML document for the selected demo tab.
function buildDemo(language) {
  const profile = JSON.parse(codeExamples.config.code);
  const paused = reducedMotion.matches || motionPaused;
  // Backticks allow a readable, multi-line string with ${...} value placeholders.
  const baseCSS = `
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 25px 23px;
      background: ${profile.background};
      color: #172B45;
      font: 13px/1.5 Arial;
      overflow: hidden;
    }
    .label {
      font: 10px monospace;
      letter-spacing: 2px;
      color: #52647A;
    }
    .name {
      font-size: clamp(23px, 5vw, 32px);
      letter-spacing: -1px;
      line-height: 1.15;
      margin: 15px 0 10px;
      max-width: 380px;
    }
    .roles {
      position: relative;
      height: 31px;
      color: ${profile.accent};
      font-size: 18px;
      font-weight: 600;
    }
    .roles span {
      position: absolute;
      inset: 0;
      opacity: 0;
    }
    .note {
      font-size: 11px;
      color: #52647A;
      margin-top: 15px;
    }
    .line {
      width: 40px;
      height: 3px;
      background: ${profile.accent};
      border-radius: 4px;
      margin-top: 17px;
    }
  `;

  // Show all roles without movement when motion is paused or reduced.
  const staticCSS = `
    .roles span {
      animation: none !important;
      opacity: 1;
      position: static;
      display: inline;
      font-size: 12px;
    }
    .roles span + span:before {
      content: " / ";
      color: #52647A;
    }
    .roles {
      height: auto;
    }
    .name {
      animation: none !important;
    }
  `;
  const css =
    baseCSS +
    codeExamples.css.code +
    '@media(prefers-reduced-motion:reduce){' +
    staticCSS +
    '}' +
    (paused ? staticCSS : '');
  // The Config tab supplies its profile data to the same introduction-rendering code.
  const script =
    language === 'config'
      ? 'const profile = ' +
        JSON.stringify(profile) +
        ';\n' +
        codeExamples.javascript.code.slice(
          codeExamples.javascript.code.indexOf('document.querySelector'),
        )
      : codeExamples.javascript.code;
  // srcdoc displays this document inside the iframe, not in the main page.
  return `<!doctype html>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <style>${css}</style>
      </head>
      <body>
        <div class="label">HELLO, I’M</div>
        <h1 class="name"></h1>
        <div class="roles" aria-label="Freelancer, Web Developer, Full Stack Developer"></div>
        <div class="line"></div>
        <p class="note">Thoughtful interfaces. Practical solutions.</p>
        <script>${script}</script>
      </body>
    </html>`;
}

// Rebuild the preview only when Run is clicked or motion preferences change.
runButton.addEventListener('click', () => {
  try {
    demoFrame.srcdoc = buildDemo(currentLanguage);
    document.getElementById('run-status').textContent =
      'Running ' + codeExamples[currentLanguage].file;
    runButton.innerHTML = 'Run again <span aria-hidden="true">↻</span>';
  } catch (error) {
    document.getElementById('run-status').textContent =
      'Could not run this example. Please try another tab.';
  }
});
demoFrame.addEventListener('load', () => {
  if (demoFrame.srcdoc)
    document.getElementById('run-status').textContent = 'Live · name and role introduction';
});
demoFrame.srcdoc = buildDemo('javascript');
reducedMotion.addEventListener('change', () => {
  demoFrame.srcdoc = buildDemo(currentLanguage);
});
motionButton.addEventListener('click', () => {
  demoFrame.srcdoc = buildDemo(currentLanguage);
});

/* 11. SCROLL-CONTROLLED BACKGROUND COLORS
 * EDIT gradientStops to change the background palette.
 * Each stop contains two RGB colors: [red, green, blue], each channel from 0 to 255.
 * Stops are ordered from the top of the page to the bottom. Keep at least two.
 */
// Scroll position, rather than time, controls the colors in both directions.
const gradientStops = [
  [
    [231, 239, 248],
    [233, 245, 246],
  ],
  [
    [240, 233, 250],
    [235, 239, 249],
  ],
  [
    [225, 243, 235],
    [234, 246, 243],
  ],
  [
    [249, 240, 228],
    [249, 244, 236],
  ],
];

// progress is 0 at the top and 1 at the bottom. Blend the nearest two stops.
function gradientAt(progress) {
  // Clamp to 0–1 so overscroll cannot read past the end of the color array.
  const position = Math.max(0, Math.min(1, progress)) * (gradientStops.length - 1);
  const index = Math.min(Math.floor(position), gradientStops.length - 2);
  const amount = position - index;
  return gradientStops[index].map(
    (color, layer) =>
      'rgb(' +
      color
        .map((value, channel) =>
          Math.round(value + (gradientStops[index + 1][layer][channel] - value) * amount),
        )
        .join(',') +
      ')',
  );
}
let gradientFrame = 0;
function updateScrollGradient() {
  gradientFrame = 0;
  if (reducedMotion.matches || motionPaused) return;
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  const colors = gradientAt(distance > 0 ? window.scrollY / distance : 0);
  document.body.style.setProperty('--scroll-wash', colors[0]);
  document.body.style.setProperty('--scroll-glow', colors[1]);
}

// Schedule at most one update per browser paint, even during fast scrolling.
function scheduleScrollGradient() {
  if (!gradientFrame && !reducedMotion.matches && !motionPaused)
    gradientFrame = requestAnimationFrame(updateScrollGradient);
}
window.addEventListener('scroll', scheduleScrollGradient, { passive: true });
window.addEventListener('resize', scheduleScrollGradient, { passive: true });
window.addEventListener('pageshow', scheduleScrollGradient);
reducedMotion.addEventListener('change', scheduleScrollGradient);
motionButton.addEventListener('click', scheduleScrollGradient);
updateScrollGradient();
