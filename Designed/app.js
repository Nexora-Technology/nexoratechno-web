// Nexora Technology — app behaviour
(function () {
  const dict = window.NEXORA_I18N;
  const root = document.documentElement;

  // ---------- State ----------
  const saved = {
    theme: localStorage.getItem('nx.theme') || TWEAK_DEFAULTS.theme || 'light',
    accent: localStorage.getItem('nx.accent') || TWEAK_DEFAULTS.accent || '#DAB660',
    lang: localStorage.getItem('nx.lang') || 'vi',
  };

  // ---------- Theme ----------
  const applyTheme = (t) => {
    root.setAttribute('data-theme', t);
    localStorage.setItem('nx.theme', t);
    // Update theme toggle icon
    const icon = document.querySelector('#theme-toggle svg');
    if (icon) {
      if (t === 'dark') {
        icon.innerHTML = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>';
      } else {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
      }
    }
    // Update tweaks UI
    document.querySelectorAll('[data-tweak-theme]').forEach(b => {
      b.classList.toggle('active', b.dataset.tweakTheme === t);
    });
  };

  // ---------- Accent ----------
  const ACCENTS = [
    { name: 'Bạch Lạp Kim', value: '#DAB660' },
    { name: 'Royal Gold',   value: '#E8A93C' },
    { name: 'Amber',        value: '#C8871F' },
    { name: 'Deep Earth',   value: '#A7734A' },
    { name: 'Indigo',       value: '#4F46E5' },
    { name: 'Cyan',         value: '#06B6D4' },
  ];
  const applyAccent = (hex) => {
    root.style.setProperty('--accent', hex);
    // Derive soft variant by mixing with white
    root.style.setProperty('--accent-soft', mixWhite(hex, 0.55));
    localStorage.setItem('nx.accent', hex);
    document.querySelectorAll('#accent-swatches button').forEach(b => {
      b.classList.toggle('active', b.dataset.accent === hex);
    });
  };
  function mixWhite(hex, amt) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substr(0,2),16), g = parseInt(c.substr(2,2),16), b = parseInt(c.substr(4,2),16);
    const R = Math.round(r + (255 - r) * amt);
    const G = Math.round(g + (255 - g) * amt);
    const B = Math.round(b + (255 - b) * amt);
    return `#${R.toString(16).padStart(2,'0')}${G.toString(16).padStart(2,'0')}${B.toString(16).padStart(2,'0')}`;
  }

  // Populate accent swatches
  const swatchWrap = document.getElementById('accent-swatches');
  if (swatchWrap) {
    ACCENTS.forEach(a => {
      const btn = document.createElement('button');
      btn.dataset.accent = a.value;
      btn.title = a.name;
      btn.style.background = a.value;
      btn.addEventListener('click', () => {
        applyAccent(a.value);
        parentSetKeys({ accent: a.value });
      });
      swatchWrap.appendChild(btn);
    });
  }

  // ---------- i18n ----------
  const applyLang = (lang) => {
    const d = dict[lang] || dict.vi;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (d[key] != null) el.textContent = d[key];
    });
    // Budget options
    const budgetSel = document.getElementById('f-budget');
    if (budgetSel) {
      budgetSel.querySelectorAll('option').forEach(opt => {
        const idx = parseInt(opt.dataset.i18nOpt, 10);
        if (d.f_budget_opts && d.f_budget_opts[idx]) opt.textContent = d.f_budget_opts[idx];
      });
    }
    localStorage.setItem('nx.lang', lang);
    document.querySelectorAll('[data-lang]').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  };

  // Language toggle
  document.querySelectorAll('[data-lang]').forEach(b => {
    b.addEventListener('click', () => applyLang(b.dataset.lang));
  });

  // Theme toggle (nav)
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(t);
    parentSetKeys({ theme: t });
  });
  // Theme tweaks
  document.querySelectorAll('[data-tweak-theme]').forEach(b => {
    b.addEventListener('click', () => {
      applyTheme(b.dataset.tweakTheme);
      parentSetKeys({ theme: b.dataset.tweakTheme });
    });
  });

  // ---------- Nav scroll state ----------
  const navEl = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 10) navEl.classList.add('scrolled');
    else navEl.classList.remove('scrolled');

    // Active nav link via section positions
    const sections = ['home', 'services', 'models', 'about', 'contact'];
    let current = 'home';
    for (const id of sections) {
      const sec = document.getElementById(id);
      if (!sec) continue;
      const top = sec.getBoundingClientRect().top;
      if (top <= 120) current = id;
    }
    document.querySelectorAll('[data-nav]').forEach(a => {
      a.classList.toggle('active', a.dataset.nav === current);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---------- Models tabs ----------
  document.querySelectorAll('.model-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const m = tab.dataset.model;
      document.querySelectorAll('.model-tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('[data-model-panel]').forEach(p => {
        p.hidden = p.dataset.modelPanel !== m;
      });
    });
  });

  // ---------- Compare table ----------
  const table = document.getElementById('compare-table');
  if (table) {
    // Column highlight via filter bar OR clicking a column header
    const highlightCol = (col) => {
      // Filter buttons
      document.querySelectorAll('[data-highlight]').forEach(b => {
        b.classList.toggle('active', b.dataset.highlight === col);
      });
      // Header cells
      table.querySelectorAll('thead th').forEach(th => {
        th.classList.toggle('highlighted', col !== 'all' && th.dataset.col === col);
      });
      // Body cells
      table.querySelectorAll('tbody tr').forEach(tr => {
        const tds = tr.querySelectorAll('td');
        tds.forEach((td, idx) => {
          // column index = idx+1
          td.classList.toggle('col-highlighted', col !== 'all' && String(idx + 1) === col);
        });
      });
    };
    document.querySelectorAll('[data-highlight]').forEach(b => {
      b.addEventListener('click', () => highlightCol(b.dataset.highlight));
    });
    // Click header to highlight
    table.querySelectorAll('thead th[data-col]').forEach(th => {
      th.addEventListener('click', () => highlightCol(th.dataset.col));
    });
    // Row label click -> mark row as "sorted/focused"
    table.querySelectorAll('tbody th.row-label').forEach(rowTh => {
      rowTh.addEventListener('click', () => {
        const wasSorted = rowTh.classList.contains('sorted');
        table.querySelectorAll('tbody th.row-label').forEach(t => t.classList.remove('sorted'));
        table.querySelectorAll('tbody tr').forEach(tr => tr.classList.remove('row-sorted'));
        if (!wasSorted) {
          rowTh.classList.add('sorted');
          rowTh.closest('tr').classList.add('row-sorted');
        }
      });
    });
  }

  // ---------- Service chips ----------
  document.querySelectorAll('#service-chips .chip').forEach(c => {
    c.addEventListener('click', () => {
      c.classList.toggle('active');
    });
  });

  // ---------- Contact form ----------
  const form = document.getElementById('contact-form');
  const formBody = document.getElementById('form-body');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    if (!name || !email) {
      // gentle shake
      form.animate([
        { transform: 'translateX(0)' }, { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }
      ], { duration: 280 });
      return;
    }
    const original = submitBtn.innerHTML;
    const lang = localStorage.getItem('nx.lang') || 'vi';
    submitBtn.innerHTML = `<span>${dict[lang].f_submitting}</span>`;
    submitBtn.disabled = true;
    setTimeout(() => {
      formBody.hidden = true;
      formSuccess.hidden = false;
      submitBtn.innerHTML = original;
      submitBtn.disabled = false;
    }, 900);
  });

  document.getElementById('form-reset')?.addEventListener('click', () => {
    form.reset();
    document.querySelectorAll('#service-chips .chip').forEach(c => c.classList.remove('active'));
    formBody.hidden = false;
    formSuccess.hidden = true;
  });

  // ---------- Mobile burger (simple toggle, shows hidden links) ----------
  const burger = document.getElementById('burger');
  burger?.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    if (!links) return;
    const open = links.style.display === 'flex';
    if (open) {
      links.style.display = '';
    } else {
      links.style.display = 'flex';
      links.style.position = 'absolute';
      links.style.top = '64px';
      links.style.left = '20px';
      links.style.right = '20px';
      links.style.flexDirection = 'column';
      links.style.background = 'var(--bg-elev)';
      links.style.border = '1px solid var(--line)';
      links.style.borderRadius = '14px';
      links.style.padding = '12px';
      links.style.boxShadow = 'var(--shadow-md)';
    }
  });

  // ---------- Tweaks host bridge ----------
  const tweaks = document.getElementById('tweaks');
  function parentSetKeys(edits) {
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    } catch (_) {}
  }
  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode') {
      tweaks.classList.add('open');
    } else if (d.type === '__deactivate_edit_mode') {
      tweaks.classList.remove('open');
    }
  });
  // Announce availability after listener set
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(_) {}

  // ---------- Init ----------
  applyTheme(saved.theme);
  applyAccent(saved.accent);
  applyLang(saved.lang);
})();
