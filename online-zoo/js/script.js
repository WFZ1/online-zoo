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
    slideClass: '.hero-carousel__card'
  }

  heroSlider.activeSlide = $('.carousel__card_active', heroSlider.container);
  heroSlider.range = $('.carousel__range', heroSlider.container.parentElement);
  heroSlider.fraction = $('.carousel-fraction__current', heroSlider.container.parentElement);

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

  /**
   * --------------------------------------------------------------------------------
   *  FEATURED ITEMS CAROUSEL
   * --------------------------------------------------------------------------------
   */

  const featuredItemsCarousel = {
    container: $('.featured-items-carousel'),
    items: document.querySelectorAll('.featured-items-carousel__card'),
    currentItem: 0,
    inputVal: 0,
    isEnabled: true
  };

  featuredItemsCarousel.prevBtn = $('.carousel__arrow_type_prev', featuredItemsCarousel.container);
  featuredItemsCarousel.nextBtn = $('.carousel__arrow_type_next', featuredItemsCarousel.container);
  featuredItemsCarousel.range = $('.carousel__range', featuredItemsCarousel.container);
  featuredItemsCarousel.fraction = $('.carousel-fraction__current', featuredItemsCarousel.container);

  function changeCurrentItem (n) {
    this.currentItem = (n + this.items.length) % this.items.length;

    // Input (range)
    this.inputVal = this.currentItem / 4 + 1;
    this.range.value = this.inputVal;
    this.fraction.innerText = this.inputVal < 10 ? '0' + this.inputVal : this.inputVal;
  }
  
  function hideItem (direction) {
    this.isEnabled = false;
    this.range.disabled = true;

    for (let i = this.currentItem; i < this.currentItem + 4; i++) {
      this.items[i].classList.add(direction);
      this.items[i].addEventListener('animationend', e => {
        e.currentTarget.classList.remove('featured-items-carousel__card_active', direction);
      });
    }
  }

  function showItem (direction) {
    for (let i = this.currentItem; i < this.currentItem + 4; i++) {
      this.items[i].classList.add('featured-items-carousel__card_next', direction);
      this.items[i].addEventListener('animationend', e => {
        const el = e.currentTarget;
        el.classList.remove('featured-items-carousel__card_next', direction);
        el.classList.add('featured-items-carousel__card_active');
        this.isEnabled = true;
        this.range.disabled = false;
      });
    }
  }

  function nextItem () {
    const directionHide = (this.currentItem === this.items.length - 4) ? 'featured-items-carousel__card_to-left-double' : 'featured-items-carousel__card_to-left';

    hideItem.call(this, directionHide);
    changeCurrentItem.call(this, this.currentItem + 4);

    const directionShow = (this.currentItem === 0) ? 'featured-items-carousel__card_from-right' : 'featured-items-carousel__card_to-left';

    showItem.call(this, directionShow);
  }

  function previousItem () {
    const directionHide = (this.currentItem === 0) ? 'featured-items-carousel__card_to-right' : 'featured-items-carousel__card_from-left';

    hideItem.call(featuredItemsCarousel, directionHide);
    changeCurrentItem.call(featuredItemsCarousel, featuredItemsCarousel.currentItem - 4);

    const directionShow = (this.currentItem === this.items.length - 4) ? 'featured-items-carousel__card_to-right-double' : 'featured-items-carousel__card_from-left';

    showItem.call(featuredItemsCarousel, directionShow);
  }

  featuredItemsCarousel.prevBtn.addEventListener('click', () => {
    if (featuredItemsCarousel.isEnabled) previousItem.call(featuredItemsCarousel);
  });
  
  featuredItemsCarousel.nextBtn.addEventListener('click', () => {
    if (featuredItemsCarousel.isEnabled) nextItem.call(featuredItemsCarousel);
  });

  featuredItemsCarousel.range.addEventListener('input', e => {
    if (featuredItemsCarousel.isEnabled) {
      if (e.currentTarget.value > featuredItemsCarousel.inputVal) {
        featuredItemsCarousel.nextBtn.click();
      } else {
        featuredItemsCarousel.prevBtn.click();
      }
    }
  });
}());