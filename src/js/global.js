/* Working Diagnosis - shared template behaviour.
   Include on every page: <script src="theme/wd.js" defer></script>
   Handles: dark mode (persisted), the right Calculators quick-dock
   (injected so every page is consistent), and accordions. */
(function () {
  var CALCS = [
    { t: 'AF Risk · CHA₂DS₂-VASc', k: 'AF', href: 'pages-calculators/calculator-af-risk.html' },
    { t: 'CV Risk · PREDICT', k: 'CV', href: 'pages-calculators/calculator-cv-risk.html' },
    { t: 'COPD Management', k: 'CO', href: 'pages-calculators/calculator-copd.html' },
    { t: 'Cervical Screening', k: 'CX', href: 'pages-calculators/calculator-cervical-screening.html' },
    { t: 'Geriatric Toolkit', k: 'GE', href: 'pages-calculators/calculator-geriatric.html' },
    { t: 'Paediatric Doses', k: 'PD', href: 'paediatric-doses.html' },
  ];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* ---- Dark mode ---- */
  function applyDark(on) {
    document.body.classList.toggle('dark', on);
    localStorage.setItem('wd-dark', on ? '1' : '0');
    document.querySelectorAll('[data-wd-dark]').forEach(function (b) {
      b.textContent = on ? '☀' : '☾';
      b.setAttribute('title', on ? 'Switch to light' : 'Switch to dark');
    });
  }
  function initDark() {
    var saved = localStorage.getItem('wd-dark');
    var isDark = saved === '1' ? true : false;
    applyDark(isDark);
    document.querySelectorAll('[data-wd-dark]').forEach(function (b) {
      b.addEventListener('click', function () {
        applyDark(!document.body.classList.contains('dark'));
      });
    });
  }

  /* ---- Quick-dock (Calculators) ---- */
  function buildDock() {
    if (document.querySelector('.wd-quickdock')) return;
    var dock = el('div', 'wd-quickdock');

    var tab = el('button', 'qd-tab');
    tab.innerHTML = '<span class="ico">🧮</span><span class="lbl">Clinical Tools</span>';
    dock.appendChild(tab);

    var panel = el('div', 'qd-panel');
    var inner = el('div', 'qd-inner');
    var head = el('div', 'qd-head', '<span class="t">Quick Calculators</span>');
    var x = el('button', 'x', '✕');
    head.appendChild(x);
    inner.appendChild(head);
    CALCS.forEach(function (c) {
      var a = el('a', 'qd-link');
      a.href = wdPrefix() + c.href;
      a.innerHTML = '<span>' + c.t + '</span><span class="k">' + c.k + '</span>';
      inner.appendChild(a);
    });
    inner.appendChild(el('div', 'qd-foot', 'Pinned tools, available on every page.'));
    panel.appendChild(inner);
    dock.appendChild(panel);
    document.body.appendChild(dock);

    function setOpen(open) {
      dock.classList.toggle('open', open);
      localStorage.setItem('wd-quick-open', open ? '1' : '0');
    }
    tab.addEventListener('click', function () { setOpen(!dock.classList.contains('open')); });
    x.addEventListener('click', function () { setOpen(false); });
    if (localStorage.getItem('wd-quick-open') === '1') setOpen(true);
  }

  /* ---- Accordions ---- */
  function initAcc() {
    document.querySelectorAll('.wd-acc-head').forEach(function (h) {
      h.addEventListener('click', function () {
        h.closest('.wd-acc').classList.toggle('open');
      });
    });
  }

  /* ---- Standard footer (single source of truth) ----
     Replaces the contents of any <footer class="wd-footer"> on the page,
     and injects one if the page has none. Paths are resolved relative to
     this script's own location, so links work from root and subfolders. */
  function wdPrefix() {
    var s = document.querySelector('script[src$="theme/wd.js"]');
    if (s) {
      var src = s.getAttribute('src') || '';
      return src.slice(0, src.indexOf('theme/wd.js'));
    }
    return '';
  }
  function buildFooter() {
    var p = wdPrefix();
    var disc = document.body.getAttribute('data-wd-disc') ||
      'For use by qualified clinicians. Always apply clinical judgment; verify dosing against local formularies.';
    var html =
      '<div class="wd-footer-inner">' +
        '<span class="disc">' + disc + '</span>' +
        '<div class="wd-footer-links">' +
          '<a href="https://buymeacoffee.com" target="_blank" rel="noopener">Buy me a coffee</a>' +
          '<a href="mailto:feedback@workingdiagnosis.com">Feedback</a>' +
          '<a href="mailto:suggest@workingdiagnosis.com">Suggest a topic</a>' +
          '<a href="' + p + 'about.html">About</a>' +
        '</div>' +
        '<span class="wd-footer-copy">© 2026 Working Diagnosis · Aotearoa New Zealand. All rights reserved.</span>' +
      '</div>';
    var f = document.querySelector('footer.wd-footer');
    if (!f) {
      f = document.createElement('footer');
      f.className = 'wd-footer';
      document.body.appendChild(f);
    }
    f.innerHTML = html;
  }

  /* ---- Card mouse-follow radial gradient ---- */
  function initCardGlow() {
    document.querySelectorAll('.wd-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var pctX = (x / rect.width) * 100;
        var pctY = (y / rect.height) * 100;
        card.style.setProperty('--mouse-x', pctX + '%');
        card.style.setProperty('--mouse-y', pctY + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      });
    });
  }

  /* ---- Dynamic time greeting ---- */
  function initGreeting() {
    var greetEl = document.getElementById('wd-greeting');
    if (!greetEl) return;
    
    var hour = new Date().getHours();
    var greeting = '';
    
    if (hour >= 5 && hour < 12) {
      greeting = 'Good morning. What are you looking up today?';
    } else if (hour >= 18 && hour < 24) {
      greeting = 'Late clinic? Let\'s find it quickly.';
    }
    
    if (greeting) {
      greetEl.textContent = greeting;
    } else {
      greetEl.style.display = 'none';
    }
  }

  function init() { initDark(); buildDock(); buildFooter(); initAcc(); initCardGlow(); initGreeting(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
