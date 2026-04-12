// ── Header scroll shadow ──
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Hamburger menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// ── Category filter ──
const filterBtns = document.querySelectorAll('.filter-btn');
const blogCards  = document.querySelectorAll('.blog-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

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

// ── Grid / list view toggle ──
const blogGridSection = document.getElementById('blogGridSection');
const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
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
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, view);
    } catch (_) {}
  }

  let savedView = null;
  try {
    const v = localStorage.getItem(VIEW_STORAGE_KEY);
    if (v === 'list' || v === 'grid') savedView = v;
  } catch (_) {}

  if (savedView) applyBlogView(savedView);

  viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyBlogView(btn.dataset.view);
    });
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
