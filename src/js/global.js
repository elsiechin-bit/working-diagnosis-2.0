// ============================================================
// WORKING DIAGNOSIS - GLOBAL JAVASCRIPT
// Theme toggle, search, and utility functions
// ============================================================

(function() {
  // ---- DARK MODE TOGGLE ----
  const btn = document.getElementById('darkBtn');
  if (!btn) return;

  const stored = localStorage.getItem('wd-dark');
  if (stored === 'true' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
    btn.textContent = '☀';
  }

  btn.addEventListener('click', () => {
    const on = document.body.classList.toggle('dark');
    btn.textContent = on ? '☀' : '☾';
    localStorage.setItem('wd-dark', on);
  });
})();
