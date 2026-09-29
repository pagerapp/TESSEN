const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
const uiCopy = {
  ru: { openMenu: 'Открыть меню', closeMenu: 'Закрыть меню', copied: 'Адрес скопирован ', copyFailed: 'Скопируйте адрес выше ', copyEmail: 'Скопировать адрес ' },
  en: { openMenu: 'Open menu', closeMenu: 'Close menu', copied: 'Email address copied ', copyFailed: 'Copy the address above ', copyEmail: 'Copy email address ' },
  zh: { openMenu: '打开菜单', closeMenu: '关闭菜单', copied: '邮箱地址已复制 ', copyFailed: '请复制上方邮箱地址 ', copyEmail: '复制邮箱地址 ' },
}[document.documentElement.lang.startsWith('zh') ? 'zh' : document.documentElement.lang] || {
  openMenu: 'Открыть меню', closeMenu: 'Закрыть меню', copied: 'Адрес скопирован ', copyFailed: 'Скопируйте адрес выше ', copyEmail: 'Скопировать адрес ',
};

if (menuButton && menu) {
  const closeMenu = () => {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', uiCopy.openMenu);
    document.body.classList.remove('menu-open');
  };
  menuButton.addEventListener('click', () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? uiCopy.closeMenu : uiCopy.openMenu);
    document.body.classList.toggle('menu-open', opening);
  });
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });
  matchMedia('(min-width: 1181px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
}

const founderBadge = document.querySelector('[data-founder-badge]');
if (founderBadge) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    founderBadge.classList.add('is-visible');
  } else {
    founderBadge.classList.add('is-pending');
    const observer = new IntersectionObserver(entries => {
      founderBadge.classList.toggle('is-in-view', entries[0].isIntersecting);
      if (entries[0].isIntersecting) {
        founderBadge.classList.add('is-visible');
        founderBadge.classList.remove('is-pending');
      }
    }, { threshold: 0.15 });
    observer.observe(founderBadge);
  }
}

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const projectCards = [...document.querySelectorAll('.archive-list .project-teaser')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  projectCards.forEach(card => {
    card.hidden = filter !== 'all' && !card.dataset.category.includes(filter);
  });
}));

const gallery = document.querySelector('#selected-gallery');
if (gallery) {
  const slides = [...gallery.querySelectorAll('.gallery-slide')];
  const previous = document.querySelector('.gallery-arrow-prev');
  const next = document.querySelector('.gallery-arrow-next');
  const current = document.querySelector('[data-gallery-current]');
  const progress = document.querySelector('.gallery-progress span');
  let active = 0;
  let scheduled = false;
  gallery.classList.add('gallery-enhanced');

  const update = () => {
    const left = gallery.getBoundingClientRect().left;
    const nearest = slides.reduce((result, slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - left);
      return distance < result.distance ? { index, distance } : result;
    }, { index: 0, distance: Infinity }).index;
    if (nearest !== active) {
      active = nearest;
      current.textContent = String(active + 1).padStart(2, '0');
    }
    slides.forEach((slide, index) => slide.classList.toggle('is-active', index === active));
    previous.disabled = active === 0;
    next.disabled = active === slides.length - 1;
    progress.style.transform = `translateX(${active * 100}%)`;
    scheduled = false;
  };
  const goTo = index => {
    const slide = slides[Math.max(0, Math.min(index, slides.length - 1))];
    const left = slide.getBoundingClientRect().left - gallery.getBoundingClientRect().left + gallery.scrollLeft;
    gallery.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  gallery.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }, { passive: true });
  previous.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  addEventListener('resize', update, { passive: true });
  update();
}

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      copied = true;
    } catch { /* Clipboard API can be unavailable in some browsers. */ }
    if (!copied) {
      const field = document.createElement('textarea');
      field.value = button.dataset.copy;
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.append(field);
      field.select();
      copied = document.execCommand('copy');
      field.remove();
    }
    button.firstChild.textContent = copied ? uiCopy.copied : uiCopy.copyFailed;
    window.setTimeout(() => { button.firstChild.textContent = uiCopy.copyEmail; }, 2200);
  });
});

// Reveal once the project images are decoded and the fan is in view.
const projectFan = document.querySelector('.hero-media-svg');
document.querySelectorAll('[data-concept-carousel]').forEach(carousel => {
  const track = carousel.querySelector('.concept-offer-track');
  const previous = carousel.querySelector('[data-concept-prev]');
  const next = carousel.querySelector('[data-concept-next]');
  if (!previous || !next) return;
  const update = () => {
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  const move = direction => {
    const card = track.querySelector('.concept-offer');
    if (!card) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
});
if (projectFan) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const hub = projectFan.querySelector('.hero-fan-hub');
  let visible = !('IntersectionObserver' in window);
  let loaded = false;
  const updateFan = () => {
    projectFan.classList.toggle('fan-motion', !motion.matches);
    projectFan.classList.toggle('is-in-view', loaded && visible && !document.hidden);
  };
  updateFan();
  const sources = [...new Set([...projectFan.querySelectorAll('image')].map(image => image.getAttribute('href')))];
  Promise.allSettled(sources.map(src => {
    const image = new Image();
    image.src = src;
    return image.decode();
  })).then(() => { loaded = true; updateFan(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      updateFan();
    }, { threshold: .12 }).observe(projectFan);
  }
  document.addEventListener('visibilitychange', updateFan);
  motion.addEventListener('change', updateFan);
  const replay = () => {
    if (motion.matches || !loaded) return;
    // Cancel only the fan's reveal, then restart the shared CSS timeline.
    projectFan.classList.remove('fan-motion');
    void projectFan.getBoundingClientRect();
    updateFan();
  };
  hub?.addEventListener('click', replay);
  hub?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      replay();
    }
  });
}
