/* ============================================================
   MANUAL DE TRADING DE ORO — JavaScript
   Theme toggle, mobile menu, scroll spy, progress bar
   ============================================================ */

(function () {
  'use strict';

  /* ===== Theme Toggle ===== */
  const themeToggles = document.querySelectorAll('[data-theme-toggle]');
  const root = document.documentElement;

  // Initialize theme from system preference
  let currentTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', currentTheme);

  function updateToggleIcons(theme) {
    themeToggles.forEach(function (toggle) {
      toggle.setAttribute('aria-label', 'Cambiar a tema ' + (theme === 'dark' ? 'claro' : 'oscuro'));
    });
  }

  updateToggleIcons(currentTheme);

  themeToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      updateToggleIcons(currentTheme);
    });
  });

  /* ===== Mobile Hamburger Menu ===== */
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const mainContent = document.getElementById('mainContent');

  function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', openSidebar);
  }
  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  /* ===== Smooth Scroll + Close Mobile Menu on Nav Click ===== */
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          // Close mobile menu first
          if (window.innerWidth <= 900) {
            closeSidebar();
            // Small delay to allow menu to close before scrolling
            setTimeout(function () {
              targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
          } else {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    });
  });

  /* ===== Scroll Progress Bar ===== */
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = progress + '%';
    }
  }

  /* ===== Active Section Highlighting (Scroll Spy) ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinkMap = {};

  navLinks.forEach(function (link) {
    const sectionId = link.getAttribute('data-section');
    if (sectionId) {
      navLinkMap[sectionId] = link;
    }
  });

  const observerOptions = {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  let activeSection = null;

  function setActiveSection(sectionId) {
    if (activeSection === sectionId) return;
    activeSection = sectionId;

    // Remove active class from all
    navLinks.forEach(function (link) {
      link.classList.remove('active');
    });

    // Add active class to current
    const activeLink = navLinkMap[sectionId];
    if (activeLink) {
      activeLink.classList.add('active');
      // Scroll the active link into view in the sidebar
      activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  } else {
    // Fallback for older browsers
    window.addEventListener('scroll', function () {
      let current = '';
      const scrollPos = window.scrollY + 150;

      sections.forEach(function (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          current = section.id;
        }
      });

      if (current) {
        setActiveSection(current);
      }
    }, { passive: true });
  }

  /* ===== Combined Scroll Handler (Progress + Back to Top) ===== */
  const backToTop = document.getElementById('backToTop');

  function handleScroll() {
    updateScrollProgress();

    // Back to top visibility
    if (backToTop) {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  // Throttle scroll handler with requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  handleScroll();

  /* ===== Back to Top Button ===== */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== Close menu on Escape key ===== */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (sidebar.classList.contains('active')) {
        closeSidebar();
      }
    }
  });

  /* ===== Handle window resize ===== */
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 900 && sidebar.classList.contains('active')) {
        closeSidebar();
      }
      updateScrollProgress();
    }, 100);
  });

  /* ===== Checklist persistence (visual only, no localStorage in sandbox) ===== */
  // Checkboxes remain interactive for visual feedback during the session

  /* ===== Collapsible strategy sections (optional) ===== */
  // Strategy cards can be expanded/collapsed by clicking the header
  const strategyHeaders = document.querySelectorAll('.strategy-header');

  strategyHeaders.forEach(function (header) {
    const strategyCard = header.parentElement;
    const strategyBody = strategyCard.querySelector('.strategy-body');

    if (!strategyBody) return;

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'strategy-toggle';
    toggleBtn.setAttribute('aria-label', 'Expandir/Contraer estrategia');
    toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
    toggleBtn.style.cssText = 'position:absolute;top:var(--space-8);right:var(--space-8);width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:var(--radius-md);color:var(--color-text-muted);background:var(--color-surface-2);border:1px solid var(--color-border);cursor:pointer;transition:all 180ms cubic-bezier(0.16,1,0.3,1);';

    toggleBtn.addEventListener('click', function () {
      const isCollapsed = strategyBody.style.display === 'none';
      if (isCollapsed) {
        strategyBody.style.display = '';
        toggleBtn.style.transform = 'rotate(0deg)';
      } else {
        strategyBody.style.display = 'none';
        toggleBtn.style.transform = 'rotate(-90deg)';
      }
    });

    header.style.position = 'relative';
    header.appendChild(toggleBtn);
  });

  /* ===== Scroll Reveal Animations ===== */
  const revealTargets = document.querySelectorAll('.section-header, .strategy-card, .formula-card, .callout, .chart-figure, .data-table, .errors-grid, .checklist-grid, .card-grid');
  
  // Add reveal class to individual elements
  revealTargets.forEach(function(el) {
    el.classList.add('reveal');
  });
  
  // Add stagger class to grids with multiple children
  document.querySelectorAll('.card-grid, .errors-grid, .checklist-grid').forEach(function(el) {
    el.classList.remove('reveal');
    el.classList.add('reveal-stagger');
  });
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.05
    });
    
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function(el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: just show everything
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function(el) {
      el.classList.add('revealed');
    });
  }

  /* ===== Collapsible Estrategias Group ===== */
  const estrategiasToggle = document.getElementById('estrategiasToggle');
  if (estrategiasToggle) {
    estrategiasToggle.addEventListener('click', function() {
      const isExpanded = estrategiasToggle.getAttribute('aria-expanded') === 'true';
      estrategiasToggle.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    });
  }

  /* ===== Smooth Theme Transition ===== */
  const themeTransitionCSS = document.createElement('style');
  themeTransitionCSS.textContent = `
    *, *::before, *::after {
      transition: background-color 320ms cubic-bezier(0.16, 1, 0.3, 1),
                  border-color 320ms cubic-bezier(0.16, 1, 0.3, 1),
                  color 320ms cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hero-section::before, .hero-section::after,
    .scroll-progress, .back-to-top,
    .nav-group-items, .nav-group-chevron {
      transition: none !important;
    }
  `;
  document.head.appendChild(themeTransitionCSS);

  console.log('%cManual de Trading de Oro', 'color: #E8AF34; font-size: 16px; font-weight: bold; font-family: sans-serif;');
  console.log('%cEstrategias Profesionales XAU/USD', 'color: #4F98A3; font-size: 12px;');
})();
