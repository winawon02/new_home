(() => {
  const header = document.querySelector('[data-header]');
  const logo = document.querySelector('[data-logo]');
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');
  const topButton = document.querySelector('[data-scroll-top]');
  const heroSlides = [...document.querySelectorAll('[data-hero-slides] .hero-slide')];
  const heroCurrent = document.querySelector('[data-hero-current]');
  const heroPrev = document.querySelector('[data-hero-prev]');
  const heroNext = document.querySelector('[data-hero-next]');
  const reviewTrack = document.querySelector('[data-review-track]');
  const reviewCards = [...document.querySelectorAll('.review-card')];
  const reviewPrev = document.querySelector('[data-review-prev]');
  const reviewNext = document.querySelector('[data-review-next]');
  const contactPanel = document.querySelector('[data-contact-panel]');
  const contactForm = document.querySelector('[data-contact-form]');
  const contactStatus = document.querySelector('[data-contact-status]');

  const logoDark = 'assets/images/test-logo.svg';
  const logoLight = 'assets/images/logo-white.png';
  let heroIndex = 0;
  let reviewIndex = 0;

  const closeMenu = () => {
    if (!menuToggle || !siteNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    siteNav.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  const renderHero = (nextIndex) => {
    if (!heroSlides.length) return;
    heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, index) => {
      const active = index === heroIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    if (heroCurrent) heroCurrent.textContent = String(heroIndex + 1).padStart(2, '0');
  };

  heroPrev?.addEventListener('click', () => renderHero(heroIndex - 1));
  heroNext?.addEventListener('click', () => renderHero(heroIndex + 1));

  const visibleReviews = () => window.matchMedia('(max-width: 1199px)').matches ? 1 : 3;

  const renderReviews = (nextIndex) => {
    const perPage = visibleReviews();
    const maxIndex = Math.max(0, reviewCards.length - perPage);
    reviewIndex = Math.min(Math.max(nextIndex, 0), maxIndex);
    if (reviewTrack) reviewTrack.style.transform = `translateX(-${reviewIndex * (100 / perPage)}%)`;
    reviewCards.forEach((card, index) => card.classList.toggle('is-current', index === reviewIndex));
    if (reviewPrev) reviewPrev.disabled = reviewIndex === 0;
    if (reviewNext) reviewNext.disabled = reviewIndex === maxIndex;
  };

  reviewPrev?.addEventListener('click', () => renderReviews(reviewIndex - 1));
  reviewNext?.addEventListener('click', () => renderReviews(reviewIndex + 1));
  window.addEventListener('resize', () => renderReviews(reviewIndex));

  const darkSection = document.querySelector('.section--dark');
  if (darkSection && header) {
    const headerObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-dark', entry.isIntersecting);
      if (logo) logo.src = entry.isIntersecting ? logoLight : logoDark;
    }, { threshold: 0.08 });
    headerObserver.observe(darkSection);
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -80px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if (contactPanel) {
    contactPanel.classList.add('is-collapsed');
    const expandContactPanel = () => {
      contactPanel.classList.remove('is-collapsed');
      contactPanel.classList.add('is-expanded');
    };

    if ('IntersectionObserver' in window) {
      const contactPanelObserver = new IntersectionObserver(([entry], observer) => {
        if (!entry.isIntersecting) return;
        window.setTimeout(expandContactPanel, 250);
        observer.disconnect();
      }, { rootMargin: '0px 0px -15%' });
      contactPanelObserver.observe(contactPanel);
    } else {
      window.setTimeout(expandContactPanel, 250);
    }
  }

  window.addEventListener('scroll', () => {
    topButton?.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });
  topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = Object.fromEntries(new FormData(contactForm).entries());
    formData._replyto = formData.email;
    submitButton.disabled = true;
    if (contactStatus) {
      contactStatus.textContent = '문의 내용을 전송하고 있습니다.';
      contactStatus.className = 'form-status is-loading';
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false || result.success === 'false') {
        throw new Error(result.message || '문의 전송에 실패했습니다.');
      }
      window.location.href = 'success.html';
    } catch (error) {
      submitButton.disabled = false;
      if (contactStatus) {
        contactStatus.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
        contactStatus.className = 'form-status is-error';
      }
    }
  });

  renderHero(0);
  renderReviews(0);
})();
