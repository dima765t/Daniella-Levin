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

// ── Scroll-reveal for episode cards ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.episode-card, .featured-episode-card').forEach(el => {
  el.classList.add('reveal-on-scroll');
  revealObserver.observe(el);
});
