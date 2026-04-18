/* ── Header scroll shadow ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── Hamburger / mobile menu ── */
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

/* ── Tab filter (tablist pattern) ── */
const tabBtns  = document.querySelectorAll('.tab-btn');
const cards    = document.querySelectorAll('.lecture-card');
const tabPanel = document.getElementById('lectures-tabpanel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
      b.setAttribute('tabindex', '-1');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    btn.setAttribute('tabindex', '0');
    if (tabPanel && btn.id) tabPanel.setAttribute('aria-labelledby', btn.id);

    const filter = btn.dataset.tab;
    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.type === filter;
      card.classList.toggle('hidden', !match);
    });
  });

  /* Arrow-key navigation within tablist (WCAG keyboard pattern for tabs) */
  btn.addEventListener('keydown', (e) => {
    const btnsArr = Array.from(tabBtns);
    const idx     = btnsArr.indexOf(btn);
    let target;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      target = btnsArr[(idx - 1 + btnsArr.length) % btnsArr.length];
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      target = btnsArr[(idx + 1) % btnsArr.length];
    } else if (e.key === 'Home') {
      target = btnsArr[0];
    } else if (e.key === 'End') {
      target = btnsArr[btnsArr.length - 1];
    }
    if (target) {
      e.preventDefault();
      target.focus();
    }
  });
});
