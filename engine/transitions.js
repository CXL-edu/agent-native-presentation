function scheduleMotionCompletion(slide) {
  if (slide.dataset.motionOnce !== 'true') return;
  if (slide._motionTimer) window.clearTimeout(slide._motionTimer);
  const elements = [...slide.querySelectorAll('[data-motion-art] .draw-path, [data-motion-art] .fade-in')];
  const totalMs = Math.max(0, ...elements.map((element) => {
    const style = getComputedStyle(element);
    const duration = Number.parseFloat(style.animationDuration) || 0;
    const delay = Number.parseFloat(style.animationDelay) || 0;
    return (duration + delay) * 1000;
  }));
  slide._motionTimer = window.setTimeout(() => {
    if (slide.classList.contains('motion-enter')) {
      slide.classList.remove('motion-enter');
      slide.classList.add('motion-complete');
    }
    slide._motionTimer = null;
  }, totalMs + 120);
}

export function setActiveSlide(slides, index) {
  slides.forEach((slide, i) => {
    const active = i === index;
    const hasMotion = Boolean(slide.querySelector('[data-motion-art]'));
    const motionOnce = slide.dataset.motionOnce === 'true';
    if (!active && slide._motionTimer) {
      window.clearTimeout(slide._motionTimer);
      slide._motionTimer = null;
    }
    if (!active && hasMotion) {
      if (motionOnce && slide.classList.contains('motion-enter')) {
        slide.classList.remove('motion-enter');
        slide.classList.add('motion-complete');
      } else if (!motionOnce) {
        slide.classList.remove('motion-enter', 'motion-complete');
      }
    }
    slide.classList.toggle('is-active', active);
    if (active && hasMotion && (!motionOnce || slide.dataset.motionPlayed !== 'true')) {
      if (motionOnce) slide.dataset.motionPlayed = 'true';
      slide.classList.remove('motion-complete');
      slide.classList.add('motion-enter');
      scheduleMotionCompletion(slide);
    }
    slide.setAttribute('aria-hidden', String(!active));
  });
}

export function installMotionLifecycle(root) {
  root.querySelectorAll('.slide').forEach((slide) => {
    const art = slide.querySelector('[data-motion-art]');
    if (!art) return;
    const paths = [...art.querySelectorAll('.draw-path')];
    const primary = paths.at(-1) || art.querySelector('.fade-in');
    primary?.addEventListener('animationend', (event) => {
      if (slide.dataset.motionOnce !== 'true') return;
      if (event.animationName === 'draw-path' || !art.querySelector('.draw-path')) {
        slide.classList.remove('motion-enter');
        slide.classList.add('motion-complete');
      }
    }, { once: true });
  });
}
