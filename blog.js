// ── Header scroll shadow ──
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Hamburger / mobile menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function openMobileMenu() {
  mobileMenu.removeAttribute('hidden');
  mobileMenu.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'סגירת תפריט ניווט');
  const firstLink = mobileMenu.querySelector('a');
  if (firstLink) firstLink.focus();
}

function closeMobileMenu() {
  mobileMenu.setAttribute('hidden', '');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'פתיחת תפריט ניווט');
}

hamburger.addEventListener('click', () => {
  if (mobileMenu.hasAttribute('hidden')) {
    openMobileMenu();
  } else {
    closeMobileMenu();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !mobileMenu.hasAttribute('hidden')) {
    closeMobileMenu();
    hamburger.focus();
  }
});

// ── Category filter ──
const filterBtns = document.querySelectorAll('.filter-btn');
const blogCards  = document.querySelectorAll('.blog-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    const filter = btn.dataset.filter;
    blogCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Initialise aria-pressed on filter buttons
filterBtns.forEach(btn => {
  btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
});

// ── Grid / list view toggle ──
const blogGridSection = document.getElementById('blogGridSection');
const viewToggleBtns  = document.querySelectorAll('.view-toggle-btn');
const VIEW_STORAGE_KEY = 'daniella-blog-view';

if (blogGridSection && viewToggleBtns.length) {
  function applyBlogView(view) {
    const isList = view === 'list';
    blogGridSection.classList.toggle('view-list', isList);
    viewToggleBtns.forEach(b => {
      const on = b.dataset.view === view;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(VIEW_STORAGE_KEY, view); } catch (_) {}
  }

  let savedView = null;
  try {
    const v = localStorage.getItem(VIEW_STORAGE_KEY);
    if (v === 'list' || v === 'grid') savedView = v;
  } catch (_) {}

  if (savedView) applyBlogView(savedView);

  viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => applyBlogView(btn.dataset.view));
  });
}

// ── Scroll-reveal for blog cards ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.blog-card, .featured-card').forEach(el => {
  el.classList.add('reveal-on-scroll');
  revealObserver.observe(el);
});
