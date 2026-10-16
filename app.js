const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.focus();
  }
});
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const videos = [...document.querySelectorAll('video')];
function applyMotion() {
  videos.forEach(video => reduced.matches ? video.pause() : video.play().catch(() => {}));
}
applyMotion();
reduced.addEventListener('change', applyMotion);
// All decorative footage has an accessible pause control.
document.querySelectorAll('video').forEach(video => {
  let button = video.parentElement.querySelector('.motion');
  if (!button) {
    button = document.createElement('button');
    button.className = 'motion';
    video.parentElement.appendChild(button);
  }
  function update() {
    button.textContent = video.paused ? '▷' : 'Ⅱ';
    button.setAttribute('aria-label', video.paused ? 'Play background video' : 'Pause background video');
  }
  button.addEventListener('click', () => video.paused ? video.play().catch(() => {}) : video.pause());
  video.addEventListener('play', update);
  video.addEventListener('pause', update);
  update();
});

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const topics = {
    general: 'General inquiry',
    founder: 'Connect with the founder',
    newsletter: 'Newsletter subscription request',
    investor: 'Dyco investor inquiry',
    simulator: 'Dyco simulator inquiry',
  };
  const topic = new URLSearchParams(window.location.search).get('topic');
  contactForm.elements.namedItem('_subject').value = topics[topic] || topics.general;
  if (topic === 'newsletter') {
    contactForm.elements.namedItem('message').value = 'Please subscribe me to the Dyco Systems newsletter.';
  }
  // Enable only after the form delivery provider has been approved and configured.
  // FormSubmit's native POST flow keeps its server-verified reCAPTCHA enabled.
  // Client checks are convenience filters, not a substitute for server checks.
  contactForm.addEventListener('submit', event => {
    if (contactForm.elements.namedItem('_honey').value) {
      event.preventDefault();
      document.querySelector('#form-status').textContent = 'Unable to submit this message. Please contact info@dycosystems.com directly.';
      return;
    }
    if (!contactForm.getAttribute('action')) {
      event.preventDefault();
      document.querySelector('#form-status').textContent = 'Online delivery is not connected yet. Please email info@dycosystems.com.';
      return;
    }
    const subject = contactForm.elements.namedItem('_subject');
    if (!subject.value.trim() || /[\r\n]/.test(subject.value)) {
      event.preventDefault();
      subject.setCustomValidity('Please enter a subject on one line.');
      contactForm.reportValidity();
      return;
    }
    if (!contactForm.elements.namedItem('message').value.trim()) {
      event.preventDefault();
      contactForm.elements.namedItem('message').setCustomValidity('Please enter a message.');
      contactForm.reportValidity();
    }
  });
  contactForm.elements.namedItem('message').addEventListener('input', event => event.target.setCustomValidity(''));
  contactForm.elements.namedItem('_subject').addEventListener('input', event => event.target.setCustomValidity(''));
}
