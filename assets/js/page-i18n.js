/* ─────────────────────────────────────────────────────────────────────────
   Static-page i18n — swaps text on elements carrying data-i18n-es.

   Usage: put the English copy as the element's normal content and add
   data-i18n-es="Spanish copy" (may contain inline <strong>/<em> markup).
   On load and whenever the language changes (shell dispatches the
   'portfolio-lang-changed' event + stores localStorage 'lang'), every
   tagged element swaps between EN and ES. The original English is snapshotted
   into data-i18n-en on first run so we can swap back.

   Use only on leaf text elements (p, h*, span, li, blockquote, figcaption) —
   never on a wrapper that itself contains another data-i18n-es element.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  function getLang() {
    try { return localStorage.getItem('lang') || 'en'; } catch (e) { return 'en'; }
  }

  function apply(lang) {
    var els = document.querySelectorAll('[data-i18n-es]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el.hasAttribute('data-i18n-en')) {
        el.setAttribute('data-i18n-en', el.innerHTML);
      }
      el.innerHTML = (lang === 'es')
        ? el.getAttribute('data-i18n-es')
        : el.getAttribute('data-i18n-en');
    }
    document.documentElement.lang = lang;
  }

  function run() { apply(getLang()); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  window.addEventListener('portfolio-lang-changed', function (e) {
    apply(e && e.detail ? e.detail : getLang());
  });
})();
