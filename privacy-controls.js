(() => {
  'use strict';
  const key = 'dyco-advertising-choice-v1';
  const panel = document.getElementById('ad-choice');
  const status = document.getElementById('ad-status');
  const allow = panel.querySelector('[data-allow]');
  const reject = panel.querySelector('[data-reject]');
  const settings = document.querySelector('[data-settings]');
  const signal = () => navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  function read() { try { return localStorage.getItem(key); } catch { return null; } }
  function save(v) { try { localStorage.setItem(key, v); return read() === v; } catch { return false; } }
  let loaded = false;
  function load() {
    if (loaded || signal() || read() !== 'allow' || /\/(contact|privacy)\.html$/.test(location.pathname)) return;
    loaded = true;
    (window._linkedin_data_partner_ids ||= []).push(window._linkedin_partner_id = '10324612');
    if (!window.lintrk) { window.lintrk = (...args) => window.lintrk.q.push(args); window.lintrk.q = []; }
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
    document.head.append(tag);
  }
  function update() {
    allow.disabled = signal();
    status.textContent = signal() ? 'Browser opt-out signal honored. Advertising is off.'
      : read() === 'allow' ? 'Advertising is on for this browser.' : 'Advertising is off for this browser.';
    settings.textContent = signal() ? 'Cookie settings · Opt-out honored' : 'Cookie settings';
    const inline = document.getElementById('privacy-status');
    if (inline) inline.textContent = status.textContent;
  }
  function choose(value, reset = false) {
    const ok = save(value);
    update();
    if (loaded && (value !== 'allow' || signal() || !ok)) { location.reload(); return; }
    if (value === 'allow' && ok) load();
    if (!ok) { status.textContent = 'Your browser could not save this choice. Advertising stays off.'; }
    panel.hidden = true;
    if (!reset) settings.focus();
  }
  function optOut() { if (location.hash === '#opt-out') choose('deny', true); }
  window.addEventListener('hashchange', optOut);
  window.addEventListener('storage', e => {
    if (e.key !== key && e.key !== null) return;
    if (loaded && (read() !== 'allow' || signal())) { location.reload(); return; }
    update(); panel.hidden = true;
  });
  window.addEventListener('pageshow', () => {
    if (loaded && (read() !== 'allow' || signal())) location.reload();
  });
  settings.hidden = false;
  settings.onclick = () => { update(); panel.hidden = false; reject.focus(); };
  reject.onclick = () => choose('deny');
  allow.onclick = () => { if (!signal()) choose('allow'); };
  if (signal() || location.hash === '#opt-out') choose('deny', true);
  else { panel.hidden = ['allow','deny'].includes(read()) || location.pathname.endsWith('/privacy.html'); load(); }
  update();
})();
