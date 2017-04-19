$( document ).ready(function () {

  // Init Animate On Scroll library (AOS);

  AOS.init();

  var $servicesPromoSlider = $('.services-promo-slider .wrapper');

  $('.mobile-trigger-wrap').click(function (e) {
    e.preventDefault();
    $(this).find('span').toggleClass('active');
    $('.main-nav').toggleClass('active');
  });

  // слайдер на главной
  $servicesPromoSlider.slick({
    autoplay: false,
    autoplaySpeed: 5000,
    infinite: true,
    arrows: false,
    dots: false,
    fade: true
  });

  setTimeout(function () {
    $servicesPromoSlider.slick('slickSetOption', 'autoplay', true, true);
  }, 2500);

  $servicesPromoSlider.on('beforeChange', function (event, slick, currentSlide, next) {
    $('.services-promo-slider')
      .find('.navigation a')
      .removeClass('active')
      .eq(next)
      .addClass('active');
  });

  $('.services-promo-slider').find('.navigation').on('click', 'a', function (e) {
    e.preventDefault();
    var idx = $(this).index();
    $servicesPromoSlider.slick('slickGoTo', idx);
  });

  new Vivus('target', {
    duration: 300,
    type: 'sync'
  }, onSvgDrawEnd).play();

  // js tabs

  $('.js-tab-link').click(function (e) {
    e.preventDefault();
    var $tabParent = $(this).parent();
    $tabParent.children().removeClass('active');
    $(this).addClass('active');
  });

  function onSvgDrawEnd() {
    $('.promo-svg svg').addClass('finished');
  }
});
