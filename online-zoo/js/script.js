(function () {
  /**
   * --------------------------------------------------------------------------------
   *  FUNCTIONS
   * --------------------------------------------------------------------------------
   */

  const $ = (selector, container) => {
    return container ? container.querySelector(selector) : document.querySelector(selector);
  };

  const getContainEl = (target, selector, container) => {
    const el = target.closest(selector);
    return (!el || !container.contains(el)) ? 0 : el;
  }

  /**
   * --------------------------------------------------------------------------------
   *  TOGGLE COLOR MODE
   * --------------------------------------------------------------------------------
   */

  const toggleColorMode = document.querySelector('.toggle-color-mode');

  toggleColorMode.addEventListener('input', () => {
    document.body.classList.toggle('page_dark-mode');
    document.body.classList.toggle('page_light-mode');
  });

  /**
   * --------------------------------------------------------------------------------
   *  HERO SLIDER
   * --------------------------------------------------------------------------------
   */

  const heroSlider = {
    container: $('.hero-carousel__container'),
    slideClass: '.hero-carousel__card',
    activeSlide: $('.carousel__card_active', this.container),
    range: $('.carousel__range', this.container),
    fraction: $('.carousel-fraction__current', this.container)
  }

  /* GO TO NEXT SLIDE ================================================================================ */

  const goNextSlide = curSlide => {
    const sliderElems = heroSlider.container.children;

    for (let i = 0; i < curSlide.dataset.index - 2; i++) {
      sliderElems[i].classList.add('hero-carousel__card_hidden');
    }

    const curSlideMargin = +window.getComputedStyle(curSlide).marginRight.replace('px', '');
    const offsetX = Math.abs(curSlide.offsetLeft - heroSlider.activeSlide.clientWidth - curSlideMargin);
    heroSlider.container.style.transform = `translateX(-${ offsetX }px)`;
  }

  /* GO TO PREV SLIDE ================================================================================ */
  
  const goPrevSlide = curSlide => {
    if (+curSlide.dataset.index > 1) {
      heroSlider.container.children[curSlide.dataset.index - 2].classList.remove('hero-carousel__card_hidden');
    }

    const translateX = +heroSlider.container.style.transform.replace(/(translateX\()?(px\))?/g, '');
    const curSlideMargin = +window.getComputedStyle(curSlide).marginRight.replace('px', '');
    const offsetX = translateX + curSlide.clientWidth + curSlideMargin;
    heroSlider.container.style.transform = `translateX(${ offsetX }px)`;
  }

  /* CHANGE SLIDE ================================================================================ */
  
  const changeSlide = e => {
    const el = getContainEl(e.target, heroSlider.slideClass, heroSlider.container);

    if (el && !el.matches('.carousel__card_active')) {
      const curIndex = el.dataset.index;
      (curIndex > heroSlider.activeSlide.dataset.index) ? goNextSlide(el) : goPrevSlide(el);

      heroSlider.activeSlide.classList.remove('carousel__card_active');
      heroSlider.activeSlide = el;
      el.classList.add('carousel__card_active');

      // Input (range)
      heroSlider.range.value = curIndex;
      heroSlider.fraction.innerText = curIndex < 10 ? 0 + curIndex : curIndex;
    }
  }

  /* RESET SLIDER ================================================================================ */

  const resetSlider = () => {
    const defaultVal = heroSlider.range.defaultValue;
    const el = heroSlider.container.children[defaultVal - 1];
    const sliderElems = heroSlider.container.children;

    heroSlider.container.style.transform = '';

    for (let i = 0; i < heroSlider.activeSlide.dataset.index - 2; i++) {
      sliderElems[i].classList.remove('hero-carousel__card_hidden');
    }

    heroSlider.activeSlide.classList.remove('carousel__card_active');
    heroSlider.activeSlide = el;
    el.classList.add('carousel__card_active');

    heroSlider.range.value = defaultVal;
    heroSlider.fraction.innerText = defaultVal < 10 ? 0 + defaultVal : defaultVal;
  }

  /* HANDLERS ================================================================================ */
  
  heroSlider.container.addEventListener('click', changeSlide);
  
  heroSlider.range.addEventListener('input', e => {
    heroSlider.container.children[e.currentTarget.value - 1].click();
  });

  window.addEventListener('resize', resetSlider);
}());