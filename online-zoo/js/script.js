(function () {
  /**
   * --------------------------------------------------------------------------------
   *  MEDIA QUERIES
   * --------------------------------------------------------------------------------
   */

  const mql = {
    phone: window.matchMedia('screen and (max-width: 640px)'),
    tablet: window.matchMedia('screen and (max-width: 768px)'),
    lap: window.matchMedia('screen and (max-width: 1024px)'),
    desk: window.matchMedia('screen and (max-width: 1200px)'),
    widescreen: window.matchMedia('screen and (max-width: 1440px)')
  }

  function matchesBreakpoint(breakpoint) {
    switch (breakpoint) {
      case 'phone':
        return mql.phone.matches;

      case 'tablet':
        return mql.tablet.matches;
        
      case 'lap':
        return mql.lap.matches;

      case 'desk':
        return mql.desk.matches;

      case 'widescreen':
        return mql.widescreen.matches;
    }
  }

  function getCurrentBreakpoint() {
    if (mql.phone.matches) {
      return 'phone';
    }

    if (window.matchMedia('screen and (min-width: 641px) and (max-width: 768px)').matches) {
      return 'tablet';
    }

    if (window.matchMedia('screen and (min-width: 769px) and (max-width: 1024px)').matches) {
      return 'lap';
    }

    if (window.matchMedia('screen and (min-width: 1025px) and (max-width: 1200px)').matches) {
      return 'desk';
    }

    if (window.matchMedia('screen and (min-width: 1201px) and (max-width: 1440px)').matches) {
      return 'widescreen';
    }
  }

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

  if (heroSlider.container) {
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
  }

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

  if (featuredItemsCarousel.container) {
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
  }

  /**
   * --------------------------------------------------------------------------------
   *  VIDEO CAROUSEL
   * --------------------------------------------------------------------------------
   */

  const mainVideo = document.querySelector('.page-zoo__main-video');
  const videoThumbs = document.querySelector('.page-zoo__thumbnails');

  if (mainVideo) {
    videoThumbs.addEventListener('click', e => {
      const el = e.target;

      if (el.matches('.page-zoo__thumbnail')) {
        const videoUrl = el.dataset.url;
        const imgUrl = el.src;

        el.dataset.url = mainVideo.src;
        el.src = mainVideo.dataset.image;

        mainVideo.src = videoUrl;
        mainVideo.dataset.image = imgUrl;
      }
    });
  }

  /**
   * --------------------------------------------------------------------------------
   *  MAP CAROUSEL
   * --------------------------------------------------------------------------------
   */

  if (document.body.matches('.page-map')) {

    // DEFAULT OPTIONS FOR THE CAROUSEL

    mapCarousel.defaults = {
      speed: 150,
      itemClass: '.page-map-carousel__item',
      hotspotClass: '.page-map__hotspot',
      activeItemClass: 'page-map-carousel__item_active',
      activeHotspotClass: 'image-hotspots__item_active'
    };

    function mapCarousel (el) {
      this.root = document.querySelector(el);
    
      // CAROUSEL OBJECTS

      this.container = this.root.querySelector('.page-map-carousel__container');
      this.elems = this.container.children;
      this.elemFirst = this.elems[0];
      this.arrowLeft = this.root.querySelector('.carousel__arrow_type_prev');
      this.arrowRight = this.root.querySelector('.carousel__arrow_type_next');
      this.range = this.root.querySelector('.carousel__range');
      this.fraction = this.root.querySelector('.carousel-fraction__current');
      this.mapContainer = document.querySelector('.page-map__image-hotspots');
      this.hotspots = this.mapContainer.querySelectorAll('.page-map__hotspot');
      this.btn = document.querySelector('.page-map__btn');

      this.options = mapCarousel.defaults;
      mapCarousel.initialize(this);
    }

    /* INITIALIZATION ================================================================================ */
    
    mapCarousel.initialize = that => {
      that.elemCount = that.elems.length;
      const elemStyle = window.getComputedStyle(that.elemFirst);
      that.elemWidth = that.elemFirst.offsetWidth + parseInt(elemStyle.marginRight);

      that.currentElem = 1;
      that.newElem = 1;

      const getTime = () => new Date().getTime();
      let bgTime = getTime();

      function checkElapsedTime (fn) {
        const fnTime = getTime();

        if (fnTime - bgTime > that.options.speed) {
          bgTime = fnTime;
          fn.call(that);
        }
      }

      function changeActiveItem (e) {
        let el;
        let activeClass;

        if (e.currentTarget === that.container) {
          el = getContainEl(e.target, that.options.itemClass, that.container);
          activeClass = that.options.activeItemClass;
        } else {
          el = getContainEl(e.target, that.options.hotspotClass, that.mapContainer);
          activeClass = that.options.activeHotspotClass;
        }

        if (el && !el.matches(activeClass)) {
          const curIndex = el.dataset.index - 1;
          const diff = Math.abs(curIndex - that.currentElem);
          (curIndex > that.currentElem) ? that.elemNext(diff) : that.elemPrev(diff);
        }
      }
    
      // LISTENERS

      that.arrowLeft.addEventListener('click', () => checkElapsedTime(that.elemPrev), false);
      that.arrowRight.addEventListener('click', () => checkElapsedTime(that.elemNext), false);
      that.container.addEventListener('click', changeActiveItem, false);
      that.range.addEventListener('input', () => that.elems[that.range.value - 1].click());
      that.mapContainer.addEventListener('click', changeActiveItem, false);
    };

    /* PREV ELEMENT ================================================================================ */
    
    mapCarousel.prototype.elemPrev = function (num = 1) {
      const oldElem = this.currentElem;

      if (this.newElem !== 0) this.newElem = this.currentElem;

      if (mql.desk.matches && this.newElem === 0) {
        let elm;
        let buf;
        const this$ = this;
  
        for(let i = 0; i < num; i++) {
          elm = this.container.lastElementChild;
          buf = elm.cloneNode(true);
          this.container.insertBefore(buf, this.container.firstElementChild);
          this.container.removeChild(elm);
        };
  
        this.container.style.marginLeft = `-${ this.elemWidth * num }px`;
        this.container.style.cssText = `transition: margin ${ this.options.speed }ms ease;`;
        this.container.style.marginLeft = 0;
  
        setTimeout (() => {
          this$.container.style.cssText = 'transition: none;'
        }, this.options.speed)
      }
      
      this.hotspots[this.currentElem].classList.remove(this.options.activeHotspotClass);

      this.currentElem -= num;
      if(this.currentElem < 0) this.currentElem = this.elemCount - 1;

      this.hotspots[this.currentElem].classList.add(this.options.activeHotspotClass);

      if (mql.desk.matches && this.newElem === 0) {
        this.elems[1].classList.remove(this.options.activeItemClass);
        this.elems[this.newElem].classList.add(this.options.activeItemClass);
      } else {
        this.elems[oldElem].classList.remove(this.options.activeItemClass);
        this.elems[this.currentElem].classList.add(this.options.activeItemClass);
      }
      
      // Input (range)

      this.range.value = this.currentElem + 1;
      this.fraction.innerText = (this.currentElem + 1 < 10) ? '0' + (this.currentElem + 1) : this.currentElem + 1;

      // Btn. change url

      const btnIsActive = !!this.elems[this.currentElem].dataset.name;

      if (btnIsActive) {
        this.btn.classList.remove('page-map__btn_disabled');
        const btnSrcArr = this.btn.pathname.split('/');
        btnSrcArr[btnSrcArr.length - 1] = this.elems[this.currentElem].dataset.name;
        this.btn.pathname = btnSrcArr.join('/');
      } else {
        this.btn.classList.add('page-map__btn_disabled');
      }
    };

    /* NEXT ELEMENT ================================================================================ */

    mapCarousel.prototype.elemNext = function (num = 1) {
      const oldElem = this.currentElem;

      if (this.newElem === 0) this.newElem++;
      else if (this.newElem !== 5) this.newElem = this.currentElem + 1;

      if (mql.desk.matches && this.newElem >= 5) {
        let elm;
        let buf;
        const this$ = this;

        this.container.style.cssText = `transition: margin ${ this.options.speed }ms ease;`;
        this.container.style.marginLeft = `-${ this.elemWidth * num }px`;

        setTimeout (() => {
          this$.container.style.cssText = 'transition: none;';

          for (let i = 0; i < num; i++) {
            elm = this$.container.firstElementChild;
            buf = elm.cloneNode(true);
            this$.container.appendChild(buf);
            this$.container.removeChild(elm)
          };

          this$.container.style.marginLeft = 0;
        }, this.options.speed);
      }

      this.hotspots[this.currentElem].classList.remove(this.options.activeHotspotClass);

      this.currentElem += num;
      if (this.currentElem >= this.elemCount) this.currentElem = 0;

      this.hotspots[this.currentElem].classList.add(this.options.activeHotspotClass);

      if (mql.desk.matches && this.newElem >= 5) {
        this.elems[4].classList.remove(this.options.activeItemClass);
        this.elems[5].classList.add(this.options.activeItemClass);
      } else {
        this.elems[oldElem].classList.remove(this.options.activeItemClass);
        this.elems[this.currentElem].classList.add(this.options.activeItemClass);
      }

      // Input (range)

      this.range.value = this.currentElem + 1;
      this.fraction.innerText = (this.currentElem + 1 < 10) ? '0' + (this.currentElem + 1) : this.currentElem + 1;

      // Btn. change url

      const btnIsActive = !!this.elems[this.currentElem].dataset.name;

      if (btnIsActive) {
        this.btn.classList.remove('page-map__btn_disabled');
        const btnSrcArr = this.btn.pathname.split('/');
        btnSrcArr[btnSrcArr.length - 1] = this.elems[this.currentElem].dataset.name;
        this.btn.pathname = btnSrcArr.join('/');
      } else {
        this.btn.classList.add('page-map__btn_disabled');
      }

      
    };
    
    new mapCarousel('.page-map-carousel');
  }
}());