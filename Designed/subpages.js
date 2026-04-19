// Shared helpers + i18n for subpages
(function () {
  window.NX = window.NX || {};

  NX.getLang = function () { return localStorage.getItem('nx.lang') || 'vi'; };
  NX.getTheme = function () { return localStorage.getItem('nx.theme') || 'light'; };
  NX.getAccent = function () { return localStorage.getItem('nx.accent') || '#DAB660'; };

  NX.applyTheme = function (t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('nx.theme', t);
  };

  NX.applyAccent = function (hex) {
    document.documentElement.style.setProperty('--accent', hex);
    const c = hex.replace('#', '');
    const r = parseInt(c.substr(0,2),16), g = parseInt(c.substr(2,2),16), b = parseInt(c.substr(4,2),16);
    const amt = 0.55;
    const toHex = (v) => v.toString(16).padStart(2,'0');
    const soft = `#${toHex(Math.round(r+(255-r)*amt))}${toHex(Math.round(g+(255-g)*amt))}${toHex(Math.round(b+(255-b)*amt))}`;
    document.documentElement.style.setProperty('--accent-soft', soft);
    localStorage.setItem('nx.accent', hex);
  };

  NX.t = function (key) {
    const d = window.NEXORA_I18N[NX.getLang()] || window.NEXORA_I18N.vi;
    return d[key] || key;
  };

  // Set up shared nav behaviours used across subpages
  NX.initSharedChrome = function () {
    NX.applyTheme(NX.getTheme());
    NX.applyAccent(NX.getAccent());

    const navEl = document.getElementById('nav');
    const onScroll = () => {
      if (!navEl) return;
      if (window.scrollY > 10) navEl.classList.add('scrolled');
      else navEl.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Language toggle
    document.querySelectorAll('[data-lang]').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === NX.getLang());
      b.addEventListener('click', () => {
        localStorage.setItem('nx.lang', b.dataset.lang);
        location.reload();
      });
    });

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    const setThemeIcon = () => {
      const icon = themeBtn?.querySelector('svg');
      if (!icon) return;
      if (NX.getTheme() === 'dark') {
        icon.innerHTML = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>';
      } else {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
      }
    };
    setThemeIcon();
    themeBtn?.addEventListener('click', () => {
      const t = NX.getTheme() === 'dark' ? 'light' : 'dark';
      NX.applyTheme(t);
      setThemeIcon();
    });

    // Apply i18n to nav labels + generic [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = NX.t(el.dataset.i18n);
      if (v && v !== el.dataset.i18n) el.textContent = v;
    });

    // Mobile burger
    const burger = document.getElementById('burger');
    burger?.addEventListener('click', () => {
      const links = document.querySelector('.nav-links');
      if (!links) return;
      const open = links.style.display === 'flex';
      if (open) links.style.display = '';
      else {
        Object.assign(links.style, {
          display: 'flex', position: 'absolute', top: '64px', left: '20px',
          right: '20px', flexDirection: 'column', background: 'var(--bg-elev)',
          border: '1px solid var(--line)', borderRadius: '14px', padding: '12px',
          boxShadow: 'var(--shadow-md)'
        });
      }
    });
  };

  // Parse ?slug= from URL
  NX.getSlug = function () {
    const p = new URLSearchParams(location.search);
    return p.get('slug');
  };
})();
