/* ============================================================
   South Herts Financial Services — Demo Site JavaScript
   MOTION_INTENSITY=6: CSS cubic-bezier transitions + IntersectionObserver
   ============================================================ */

(function () {
  'use strict';

  /* ----- Navigation: scroll state ----- */
  const header = document.getElementById('site-header');

  function updateHeaderState() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState(); // run on load

  /* ----- Navigation: hamburger toggle ----- */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on nav link click
    navMenu.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ----- Scroll reveal: IntersectionObserver ----- */
  const revealItems = document.querySelectorAll('.reveal-item');

  if (revealItems.length > 0) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  /* ----- Demo Modal ----- */
  const modal = document.getElementById('demo-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalTriggers = document.querySelectorAll('.btn-modal');

  // All focusable elements in the modal for focus trap
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  let previousFocus = null;

  function openModal() {
    previousFocus = document.activeElement;
    modal.classList.add('is-open');
    backdrop.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'hidden';

    // Focus first focusable element
    const focusable = modal.querySelectorAll(focusableSelectors);
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }

  function closeModal() {
    modal.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (previousFocus) {
      previousFocus.focus();
      previousFocus = null;
    }
  }

  // Open on any modal trigger
  modalTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  // Close on × button
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close on backdrop click
  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Focus trap inside modal
  if (modal) {
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;

      const focusable = Array.from(modal.querySelectorAll(focusableSelectors));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: backwards
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: forwards
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ----- Hero load-in: trigger reveals immediately ----- */
  // Items with --i:0 and --i:1 in hero fire on load, not on scroll
  document.querySelectorAll('.hero .reveal-item').forEach(function (el) {
    // Slight delay to allow CSS to paint first
    setTimeout(function () {
      el.classList.add('is-visible');
    }, 80);
  });

})();
