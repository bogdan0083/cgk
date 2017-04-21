$(document).ready(function () {
  var $servicesPromoSlider = $('.services-promo-slider .wrapper');
  var $packagesSlider = $('.packages-tabs-slider');
  var $projectsSlider = $('.projects-slider');
  var $tabs = $('.js-tabs');

  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

  // Функция для анимирования кругов в проектах
  // В каждом кругу смотрит на 2 значения в атрибутах:
  // data-circle-value (значение до которого делать анимацию)
  // data-circle-max-value (значение до котого делать анимацию)
  // Функция установки красной рамки в табах на главной
  // Принимает в качесте аргументов контейнер и саму рамку.
  function animateCircles(circles) {
    circles.each(function (idx, circle) {
      var toValue = $(circle).data('circle-value');
      var maxValue = $(circle).data('circle-max-value');
      setTimeout(function () {
        $(circle).addClass('active').circleProgress({
          value: (toValue / maxValue),
          size: 65,
          thickness: 6,
          startAngle: 300,
          fill: { color: '#555554' },
          emptyFill: '#313131'
        });
      }, idx * 500);
    });
  }

  function setTabFrame($tabsContainer, $tabFrame) {
    var $activeTab = $tabsContainer.find('.js-tab-link.active');
    var activeTabWidth = $activeTab.outerWidth();
    var activeTabPosLeft = $activeTab.position().left;
    var frameWidth = $tabFrame.width();
    $tabFrame.css(
      'transform',
      'translateX(' + ( activeTabPosLeft + (activeTabWidth / 2) - frameWidth / 2 ) + 'px) translateZ(0)'
    );
  }

  $('.mobile-trigger-wrap').click(function (e) {
    e.preventDefault();
    $(this).find('span').toggleClass('active');
    $('.main-nav').toggleClass('active');
  });

  // ПЛАГИНЫ

  // Init Animate On Scroll library (AOS);
  AOS.init();

  // слайдер на главной
  $servicesPromoSlider.slick({
    autoplay: false,
    autoplaySpeed: 5000,
    infinite: true,
    arrows: false,
    dots: false,
    fade: true
  });

  // слайдер проектов
  $projectsSlider.slick({
    autoplay: false,
    autoplaySpeed: 5000,
    arrows: false,
    dots: false,
    adaptiveHeight: true
  });

  $('.js-circle').on('circle-animation-progress', function functionName(event, progress, step) {
    var $this = $(this);
    var toValue = $this.data('circle-value');
    var maxValue = $this.data('circle-max-value');
    $this.find('.num').text( parseInt(toValue * progress) );
  });
  // слайдер пакетов услуг
  $packagesSlider.on('init', function () {
    AOS.refresh();
    $(window).trigger('resize');
  });

  $packagesSlider.slick({
    adaptiveHeight: true,
    autoplay: false,
    arrows: false,
    infinite: false,
    dots: false,
    initialSlide: 2
  });

  $('.projects-circles').eq(0).waypoint({
    handler: function () {
      var $this = $(this.element);
      var $circles = $this.find('.js-circle');
      animateCircles($circles);
    },
    offset: '30%'
  });
  // Отрисовка в шапке на главной
  new Vivus('target', {
    duration: 300,
    type: 'sync'
  }).play();

  // СОБЫТИЯ, ТАЙМАУТЫ И ПРОЧ.
  setTimeout(function () {
    $servicesPromoSlider.slick('slickSetOption', 'autoplay', true, true);
  }, 2500);

  $servicesPromoSlider.on('beforeChange', function(_, slick, currentSlide, next) {
    $('.services-promo-slider').find('.navigation a').removeClass('active').eq(next).addClass('active');
  });

  $('.services-promo-slider').find('.navigation').on('click', 'a', function (e) {
    e.preventDefault();
    var idx = $(this).index();
    $servicesPromoSlider.slick('slickGoTo', idx);
  });

  $('.projects').find('.showcase-navigation').on('click', 'a', function (e) {
    e.preventDefault();
    var idx = $(this).index();
    $projectsSlider.slick('slickGoTo', idx);
  });

  $packagesSlider.on('swipe', function(_, slick, current, next) {
    var $slider = $(slick.$slides.context);
    console.log(slick);
    $slider
      .closest('.js-tabs')
      .find('.js-tab-link')
      .eq(slick.currentSlide)
      .trigger('click');
  });

  // js tabs
  $('.js-tab-link').click(function (e) {
    e.preventDefault();
    var idx = $(this).index() - 1;
    console.log(idx);
    var $tabParent = $(this).parent();
    $tabParent.children().removeClass('active');
    $(this).addClass('active');
    var $tabFrame = $tabParent.find('.frame');
    $(this).closest('.js-tabs').find('.packages-tabs-slider').slick('slickGoTo', idx);
    setTabFrame($tabParent, $tabFrame);
  });

  $tabs.each(function(_, tabsContainer) {
    var $tabsContainer = $(tabsContainer);
    var $tabFrame = $tabsContainer.find('.frame');
    if ($tabFrame.length > 0) {
      setTabFrame($tabsContainer, $tabFrame);
    }
  });

  setTabFrame();
});
