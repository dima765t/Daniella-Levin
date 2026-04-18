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

// ── Testimonials carousel ──
let current = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
  testimonials.forEach((el, i) => {
    const isActive = i === index;
    el.classList.toggle('active', isActive);
    el.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });
  dots.forEach((dot, i) => {
    const isActive = i === index;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function nextSlide() {
  current = (current + 1) % testimonials.length;
  showSlide(current);
}

function prevSlide() {
  current = (current - 1 + testimonials.length) % testimonials.length;
  showSlide(current);
}

function setSlide(index) {
  current = index;
  showSlide(current);
}

// Initialise ARIA state on all testimonials
showSlide(0);

// Autoplay — respects prefers-reduced-motion; pauses on hover/focus
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let autoplayTimer;

function startAutoplay() {
  if (!prefersReducedMotion) {
    autoplayTimer = setInterval(nextSlide, 5000);
  }
}

function stopAutoplay() {
  clearInterval(autoplayTimer);
}

startAutoplay();

const carouselWrap = document.querySelector('.carousel-wrap');
if (carouselWrap) {
  carouselWrap.addEventListener('mouseenter', stopAutoplay);
  carouselWrap.addEventListener('mouseleave', startAutoplay);
  carouselWrap.addEventListener('focusin',    stopAutoplay);
  carouselWrap.addEventListener('focusout',   startAutoplay);
}

// ── Scroll-reveal for sections ──
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .intro-text, .cta-text').forEach(el => {
  el.classList.add('reveal-on-scroll');
  revealObserver.observe(el);
});
