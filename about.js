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

// ── Parallax on hero image ──
const heroImg = document.getElementById('heroImg');
const quoteImg = document.getElementById('quoteImg');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (heroImg) {
    heroImg.style.transform = `translateY(${scrollY * 0.35}px)`;
  }

  if (quoteImg) {
    const section = quoteImg.closest('.quote-section');
    const rect = section.getBoundingClientRect();
    const offset = (window.innerHeight - rect.top) * 0.15;
    quoteImg.style.transform = `translateY(${offset}px)`;
  }
}, { passive: true });

// ── Hero lines reveal on load ──
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal-line').forEach(el => {
    el.classList.add('is-visible');
  });
});

// ── Scroll reveal (reveal-up elements) ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

// ── Statement word-by-word reveal ──
function splitIntoWords(el) {
  // preserve <br> and <em> tags while wrapping words
  const html = el.innerHTML;
  el.innerHTML = html.replace(/(<br\s*\/?>|<\/?em>|[^<\s]+)/g, (match) => {
    if (match.startsWith('<')) return match; // keep tags as-is
    return `<span class="word">${match}</span>`;
  });
}

const statementText = document.querySelector('.statement-text');
if (statementText) {
  splitIntoWords(statementText);

  const wordObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const words = entry.target.querySelectorAll('.word');
        words.forEach((word, i) => {
          setTimeout(() => word.classList.add('visible'), i * 55);
        });
        wordObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  wordObserver.observe(statementText);
}

// ── Timeline items stagger on scroll ──
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.timeline-item');
      items.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(20px)';
        item.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
        requestAnimationFrame(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        });
      });
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

const timeline = document.querySelector('.timeline');
if (timeline) timelineObserver.observe(timeline);
