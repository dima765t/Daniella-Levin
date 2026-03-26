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

// ── Testimonials carousel ──
let current = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
  testimonials.forEach((el, i) => {
    el.classList.toggle('active', i === index);
    if (dots[i]) dots[i].classList.toggle('active', i === index);
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

// Autoplay every 5 seconds
setInterval(nextSlide, 5000);

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
