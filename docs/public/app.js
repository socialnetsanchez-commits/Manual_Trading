(function () {
  'use strict';

  const storageKey = 'manual-trading-oro-theme';
  const root = document.documentElement;
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const strategiesToggle = document.getElementById('estrategiasToggle');
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
  const sections = Array.from(document.querySelectorAll('main section[id]'));

  function preferredTheme() {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_error) {
      // The app also works when browser storage is unavailable.
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-label', `Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`);
    });
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (_error) {
      // Saving a preference is optional.
    }
  }

  function setSidebar(open) {
    if (!sidebar || !overlay) return;
    sidebar.classList.toggle('active', open);
    overlay.classList.toggle('active', open);
    overlay.setAttribute('aria-hidden', String(!open));
  }

  function updateScrollState() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);

    const marker = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0];
    for (const section of sections) {
      if (section.offsetTop <= marker) current = section;
      else break;
    }
    if (current) {
      navLinks.forEach((link) => link.classList.toggle('active', link.dataset.section === current.id));
    }
  }

  setTheme(preferredTheme());

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });

  document.getElementById('hamburger')?.addEventListener('click', () => setSidebar(true));
  document.getElementById('sidebarClose')?.addEventListener('click', () => setSidebar(false));
  overlay?.addEventListener('click', () => setSidebar(false));

  strategiesToggle?.addEventListener('click', () => {
    const expanded = strategiesToggle.getAttribute('aria-expanded') === 'true';
    strategiesToggle.setAttribute('aria-expanded', String(!expanded));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => setSidebar(false));
  });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setSidebar(false);
  });
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState);
  updateScrollState();
}());
