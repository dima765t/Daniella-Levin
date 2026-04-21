(function () {
  'use strict';

  var pageLoadTime = Date.now();
  var sessionCtaCount = parseInt(sessionStorage.getItem('cta_count') || '0', 10);

  var CTA_SELECTOR = [
    'a[href*="wa.me"]',
    'a.btn-hero',
    'a.btn-hero-ghost',
    'a.btn-cta',
    'a.btn-cta-mobile',
    'a.btn-cta-large',
    'a.btn-ticket',
    'a.btn-ticket-full',
    'a.btn-watch',
    'a.btn-text',
    'a.lecture-thumb-link',
  ].join(', ');

  function getDeviceType() {
    var w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  }

  function getScrollDepth() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 100;
    return Math.round((scrollTop / docHeight) * 100);
  }

  function getPageSection(el) {
    var node = el;
    while (node && node !== document.body) {
      var cls = (typeof node.className === 'string') ? node.className : '';
      var tag = (node.tagName || '').toLowerCase();
      if (tag === 'header' || cls.indexOf('main-header') !== -1) return 'navigation';
      if (cls.indexOf('mobile-menu') !== -1) return 'mobile_navigation';
      if (tag === 'footer' || cls.indexOf('footer-nav') !== -1 || cls.indexOf('footer-inner') !== -1) return 'footer';
      if (cls.indexOf('cta-banner') !== -1) return 'cta_banner';
      if (cls.indexOf('page-hero') !== -1) return 'page_hero';
      if (cls.indexOf('hero') !== -1) return 'hero';
      if (cls.indexOf('intro-section') !== -1) return 'about_preview';
      if (cls.indexOf('services-section') !== -1) return 'services';
      if (cls.indexOf('testimonials-section') !== -1) return 'testimonials';
      if (cls.indexOf('lecture-card') !== -1) return 'lecture_card';
      if (cls.indexOf('lectures-grid') !== -1) return 'lectures_grid';
      if (cls.indexOf('blog-card') !== -1 || cls.indexOf('blog-grid') !== -1 || cls.indexOf('blog-featured') !== -1) return 'blog_card';
      if (cls.indexOf('episode-card') !== -1 || cls.indexOf('episodes') !== -1) return 'podcast_episode';
      if (cls.indexOf('podcast-platforms') !== -1 || cls.indexOf('podcast-hero') !== -1) return 'podcast_header';
      if (cls.indexOf('about-hero') !== -1 || cls.indexOf('therapist') !== -1 || cls.indexOf('bio-section') !== -1) return 'about_content';
      node = node.parentElement;
    }
    return 'page';
  }

  function getCtaType(href) {
    if (!href || href === '#') return 'placeholder';
    if (href.indexOf('wa.me') !== -1) return 'whatsapp';
    if (/^https?:\/\//i.test(href) || href.indexOf('//') === 0) return 'external';
    return 'internal_nav';
  }

  function getCtaStyle(el) {
    var cls = (typeof el.className === 'string') ? el.className : '';
    if (cls.indexOf('btn-hero-ghost') !== -1) return 'hero_secondary';
    if (cls.indexOf('btn-hero') !== -1) return 'hero_primary';
    if (cls.indexOf('btn-cta-large') !== -1) return 'banner_cta';
    if (cls.indexOf('btn-cta-mobile') !== -1) return 'mobile_nav_cta';
    if (cls.indexOf('btn-cta') !== -1) return 'nav_cta';
    if (cls.indexOf('btn-ticket-full') !== -1) return 'ticket_full';
    if (cls.indexOf('btn-ticket') !== -1) return 'ticket_overlay';
    if (cls.indexOf('btn-watch') !== -1) return 'watch_lecture';
    if (cls.indexOf('lecture-thumb-link') !== -1) return 'lecture_thumb';
    if (cls.indexOf('btn-text') !== -1) return 'text_link';
    return 'link';
  }

  function decodeWhatsAppMessage(href) {
    try {
      var match = href.match(/[?&]text=([^&]*)/);
      if (match) return decodeURIComponent(match[1]).substring(0, 100);
    } catch (e) {}
    return '';
  }

  function isAboveFold(el) {
    try {
      var rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight;
    } catch (e) {
      return false;
    }
  }

  document.addEventListener('click', function (e) {
    var target = e.target.closest ? e.target.closest(CTA_SELECTOR) : null;
    if (!target) return;

    sessionCtaCount++;
    try { sessionStorage.setItem('cta_count', sessionCtaCount); } catch (e) {}

    var href = target.getAttribute('href') || '';
    var ctaType = getCtaType(href);
    var ctaText = (target.textContent || target.innerText || '')
      .replace(/[\uD800-\uDFFF]/g, '')  // strip emoji surrogates
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 100);

    var params = {
      cta_text:           ctaText,
      cta_type:           ctaType,
      cta_style:          getCtaStyle(target),
      page_section:       getPageSection(target),
      destination_url:    href.substring(0, 100),
      page_path:          window.location.pathname,
      scroll_depth_pct:   getScrollDepth(),
      time_on_page_sec:   Math.round((Date.now() - pageLoadTime) / 1000),
      device_type:        getDeviceType(),
      viewport_width:     window.innerWidth,
      is_above_fold:      isAboveFold(target),
      session_cta_count:  sessionCtaCount,
    };

    if (ctaType === 'whatsapp') {
      params.whatsapp_message = decodeWhatsAppMessage(href);
    }

    if (typeof gtag === 'function') {
      gtag('event', 'cta_click', params);
    }
  });
})();
