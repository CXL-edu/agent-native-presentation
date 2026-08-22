export function setActiveSlide(slides, index) {
  slides.forEach((slide, i) => {
    const active = i === index;
    const hasMotion = Boolean(slide.querySelector('[data-motion-art]'));
    const motionOnce = slide.dataset.motionOnce === 'true';
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
    }
    slide.setAttribute('aria-hidden', String(!active));
  });
}

export function installMotionLifecycle(root) {
  root.querySelectorAll('.slide').forEach((slide) => {
    const primary = slide.querySelector('[data-motion-art] .draw-path, [data-motion-art] .fade-in');
    primary?.addEventListener('animationend', (event) => {
      if (slide.dataset.motionOnce !== 'true') return;
      if (event.animationName === 'draw-path' || !slide.querySelector('[data-motion-art] .draw-path')) {
        slide.classList.remove('motion-enter');
        slide.classList.add('motion-complete');
      }
    }, { once: true });
  });
}
