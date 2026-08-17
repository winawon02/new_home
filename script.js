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
  let reviewMoving = false;
  let reviewDirection = 0;

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

  const setCurrentReview = (card) => {
    reviewCards.forEach((item) => item.classList.toggle('is-current', item === card));
    reviewIndex = Number(card?.dataset.reviewIndex || 0);
  };

  const arrangeReviews = (nextIndex = reviewIndex, immediate = true) => {
    if (!reviewTrack || !reviewCards.length) return;
    const perPage = visibleReviews();
    const centerOffset = Math.floor(perPage / 2);
    reviewCards.forEach((card, index) => { card.dataset.reviewIndex = String(index); });
    reviewIndex = ((nextIndex % reviewCards.length) + reviewCards.length) % reviewCards.length;
    const orderedCards = Array.from({ length: reviewCards.length }, (_, index) => {
      const logicalIndex = (reviewIndex - centerOffset + index + reviewCards.length) % reviewCards.length;
      return reviewCards[logicalIndex];
    });
    reviewTrack.innerHTML = '';
    reviewTrack.append(...orderedCards);
    setCurrentReview(orderedCards[centerOffset]);
    reviewTrack.style.transition = immediate ? 'none' : '';
    reviewTrack.style.transform = 'translate3d(0, 0, 0)';
    if (reviewPrev) reviewPrev.disabled = false;
    if (reviewNext) reviewNext.disabled = false;
    if (immediate) window.requestAnimationFrame(() => { reviewTrack.style.transition = ''; });
  };

  const animateReview = (direction) => {
    if (!reviewTrack || reviewMoving || !reviewCards.length) return;
    const perPage = visibleReviews();
    const centerOffset = Math.floor(perPage / 2);
    const cardWidth = reviewTrack.children[0]?.offsetWidth || 0;
    reviewMoving = true;
    reviewDirection = direction;

    if (direction > 0) {
      const target = reviewTrack.children[centerOffset + 1];
      setCurrentReview(target);
      reviewTrack.style.transform = `translate3d(-${cardWidth}px, 0, 0)`;
      return;
    }

    const lastCard = reviewTrack.lastElementChild;
    if (lastCard) reviewTrack.prepend(lastCard);
    reviewTrack.style.transition = 'none';
    reviewTrack.style.transform = `translate3d(-${cardWidth}px, 0, 0)`;
    setCurrentReview(reviewTrack.children[centerOffset]);
    window.requestAnimationFrame(() => {
      reviewTrack.style.transition = '';
      reviewTrack.style.transform = 'translate3d(0, 0, 0)';
    });
  };

  reviewTrack?.addEventListener('transitionend', (event) => {
    if (event.propertyName !== 'transform' || !reviewMoving) return;
    reviewMoving = false;
    if (reviewDirection > 0 && reviewTrack.children.length) reviewTrack.append(reviewTrack.firstElementChild);
    reviewTrack.style.transition = 'none';
    reviewTrack.style.transform = 'translate3d(0, 0, 0)';
    window.requestAnimationFrame(() => {
      reviewTrack.style.transition = '';
    });
  });
  reviewPrev?.addEventListener('click', () => animateReview(-1));
  reviewNext?.addEventListener('click', () => animateReview(1));
  window.addEventListener('resize', () => arrangeReviews(reviewIndex));

  const introStage = document.querySelector('.intro-scroll-stage');
  const introSection = document.querySelector('.intro');
  const darkSection = document.querySelector('.section--dark');
  const updateIntroPin = () => {
    if (!introStage || !introSection || !darkSection) return;
    const methodTop = darkSection.getBoundingClientRect().top + window.scrollY;
    const shouldPin = window.scrollY >= methodTop - window.innerHeight && window.scrollY < methodTop;
    introStage.classList.toggle('is-pinned', shouldPin);
    introSection.classList.toggle('is-pinned', shouldPin);
  };
  if (introStage && introSection && darkSection) {
    window.addEventListener('scroll', updateIntroPin, { passive: true });
    window.addEventListener('resize', updateIntroPin);
    updateIntroPin();
  }

  if (darkSection && header) {
    const updateHeaderTheme = () => {
      const darkRect = darkSection.getBoundingClientRect();
      const headerHeight = header.getBoundingClientRect().height;
      const isDark = darkRect.top <= headerHeight && darkRect.bottom > headerHeight;
      header.classList.toggle('is-dark', isDark);
      if (logo) logo.src = isDark ? logoLight : logoDark;
    };
    window.addEventListener('scroll', updateHeaderTheme, { passive: true });
    window.addEventListener('resize', updateHeaderTheme);
    updateHeaderTheme();
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
      contactPanel.classList.add('is-width-expanded', 'is-expanded');
      window.setTimeout(() => contactPanel.classList.add('is-height-expanded'), 600);
      window.setTimeout(() => contactPanel.classList.add('is-content-visible'), 1450);
    };

    if ('IntersectionObserver' in window) {
      const contactPanelObserver = new IntersectionObserver(([entry], observer) => {
        if (!entry.isIntersecting) return;
        window.setTimeout(expandContactPanel, 450);
        observer.disconnect();
      }, { rootMargin: '0px 0px -15%' });
      contactPanelObserver.observe(contactPanel);
    } else {
      window.setTimeout(expandContactPanel, 450);
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
  arrangeReviews(0);
})();
