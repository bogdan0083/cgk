$(document).ready(function() {
  var $servicesPromoSlider = $('.services-promo-slider .wrapper');
  var $packagesSlider = $('.packages-tabs-slider');
  var $projectsSlider = $('.projects-slider');
  var $teamSlider = $('.team-slider .wrapper');
  var $aboutSlider = $('.about-slider .wrapper');
  var $tabs = $('.js-tabs');
  var $servicesSlider = $('.other-services-slider');

  var windowWidth = $(window).width();

  var waypoints = $('.projects').waypoint(function() {
    var $this = $(this.element);
    var $circles = $this.find('.js-circle');
    $projectsSlider.slick('slickSetOption', 'autoplay', true);
    animateCircles($circles);
    // destroy waypoints
    this.destroy();
  }, {offset: '10%'});

  $('.team-slider').waypoint(function() {
    var $this = $(this.element);
    // Отрисовка в шапке на главной

    $('#frame').addClass('showing');

    new Vivus('frame', {
      duration: 200,
      type: 'sync'
    }, function() {
      $('#frame').addClass('finished');
    }).play();

    // destroy waypoints
    this.destroy();
  }, {offset: '500'});
  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

  (function initMap() {
    if ($('#map').length > 0) {
      var myLatLng = {
        lat: 55.733287,
        lng: 37.595181
      }
      var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 14,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          }, {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }, {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          }, {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          }, {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          }, {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          }, {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          }, {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }, {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          }, {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          }, {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dadada"
              }
            ]
          }, {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          }, {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }, {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          }, {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          }, {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#c9c9c9"
              }
            ]
          }, {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }
        ]
      });
      var marker = new google.maps.Marker({position: myLatLng, title: "Hello World!", icon: 'images/logo-shadow.png'});
      marker.setMap(map);
    }
  })();

  function onSvgDrawEnd() {
    $('.promo-svg svg').addClass('finished');
  }

  // сменяет картинку в проектах
  // принимает в качестве аргумента индекс начального и конечного слайда
  function changePicture(currentIndex, nextIndex) {
    var $projectsImagesContainer = $('.projects-images');
    var $wrappers = $projectsImagesContainer.find('.image-wrapper');
    var $imgs = $wrappers.find('.projects-image');
    $wrappers.eq(currentIndex).addClass('first');
    $wrappers.eq(nextIndex).addClass('second');
    var $currentImg = $imgs.eq(currentIndex);
    // $currentImg.eq(currentIndex).css({
    //   height: $projectsImagesContainer.outerHeight(),
    //   width: $projectsImagesContainer.outerWidth()
    // });

    $wrappers.eq(currentIndex).addClass('active');
    setTimeout(function() {
      $wrappers.removeClass('first second active').eq(nextIndex).addClass('first');
    }, 1000);
  }
  // Функция для анимирования кругов в проектах
  // В каждом кругу смотрит на 2 значения в атрибутах:
  // data-circle-value (значение до которого делать анимацию)
  // data-circle-max-value (значение до котого делать анимацию)
  // Функция установки красной рамки в табах на главной
  // Принимает в качесте аргументов контейнер и саму рамку.
  function animateCircles(circles, redraw) {
    circles.each(function(idx, circle) {
      var toValue = $(circle).data('circle-value');
      var maxValue = $(circle).data('circle-max-value');
      setTimeout(function() {
        if (redraw) {
          $(circle).addClass('active').circleProgress('redraw');
        } else {
          $(circle).addClass('active').circleProgress({
            value: (toValue / maxValue),
            size: 65,
            thickness: 6,
            startAngle: 300,
            fill: {
              color: '#555554'
            },
            emptyFill: '#313131'
          });
        }
      }, idx * 500);
    });
  }

  function setTabFrame($tabsContainer, $tabFrame) {
    var $activeTab = $tabsContainer.find('.js-tab-link.active');
    var activeTabWidth = $activeTab.outerWidth();
    var activeTabPosLeft = $activeTab.position().left;
    var frameWidth = $tabFrame.width();
    $tabFrame.css('transform', 'translateX(' + (activeTabPosLeft + (activeTabWidth / 2) - frameWidth / 2) + 'px) translateZ(0)');
  }

  $('.mobile-trigger-wrap').click(function(e) {
    e.preventDefault();
    $(this).find('span').toggleClass('active');
    $('.main-nav').toggleClass('active');
  });

  $(window).resize(function () {
    var $frame = $('.frame');
    if ($frame.length > 0) {
      $frame.each(function (idx, frame) {
        setTabFrame( $(this).parent(), $(this) );
      });
    }
  });
  // ПЛАГИНЫ

  // Init Animate On Scroll library (AOS);
  AOS.init({offset: 200});

  // слайдер на главной
  $servicesPromoSlider.slick({
    autoplay: false,
    autoplaySpeed: 5000,
    infinite: true,
    arrows: false,
    dots: false,
    fade: true
  });

  var $otherServices = $('.other-services');
  var $numCurrent = $otherServices.find('.num-current');
  var $numMax = $otherServices.find('.num-max');

  $servicesSlider.on('init', function (e, slick) {
    var $slides = slick.$slides;
    var $activeSlides = $slides.filter('.slick-active').length;
    // $numCurrent
    $numMax.text( Math.round($slides.length / $activeSlides) );
  });

  $servicesSlider.on('beforeChange', function (e, slick, current, next) {
    var $slides = slick.$slides;
    var $paginationNum = $numCurrent.text();
    // $numCurrent
    $numCurrent.text(next > current ? (parseInt($paginationNum) + 1) : (parseInt($paginationNum) - 1));
  });

  $servicesSlider.slick({
    slidesToShow: 1,
    mobileFirst: true,
    prevArrow: $('.other-services .arr-left'),
    nextArrow: $('.other-services .arr-right'),
    infinite: false,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5
        }
      }

    ]
  })
  // слайдер проектов
  $projectsSlider.on('init', function() {
    $('.image-wrapper').eq(0).css('z-index', 1);
    AOS.refresh();
    Waypoint.refreshAll();
  });

  $('.js-input').focus(function() {
    $(this).prev().addClass('hidden');
  });

  $('.js-input').blur(function() {
    if (!$(this).val()) {
      $(this).prev().removeClass('hidden');
    }
  });

  $projectsSlider.slick({
    infinite: true,
    pauseOnHover: true,
    autoplay: false,
    autoplaySpeed: 8000,
    arrows: false,
    dots: false,
    adaptiveHeight: true,
    fade: true,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          swipe: false,
          autoplay: true
        }
      }
    ]
  });

  $('.popup-link').magnificPopup({type: 'inline', showCloseBtn: false, removalDelay: 300, mainClass: 'mfp-move-horizontal'});
  $('.zoom-popup').magnificPopup({
    type: 'image',
    easing: 'ease-in-out',
    mainClass: 'mfp-with-zoom',
    zoom: {
      enabled: true, // By default it's false, so don't forget to enable it
      duration: 300, // duration of the effect, in milliseconds
      easing: 'ease-in-out' // CSS transition easing function
    }
  });

  $teamSlider.on('init', function() {
    Waypoint.refreshAll();
  });

  $teamSlider.slick({
    infinite: true,
    // autoplay: true,
    // autoplaySpeed: 8000,
    arrows: true,
    dots: false,
    // adaptiveHeight: true,
    // fade: true,
    centerMode: true,
    mobileFirst: true,
    initialSlide: 1,
    prevArrow: $('.team .arr-left'),
    nextArrow: $('.team .arr-right'),
    easing: 'ease-out',
    responsive: [
      {
        breakpoint: 1100,
        arrows: true,
        settings: {
          slidesToShow: 3
        }
      }
    ]
  });

  $aboutSlider.on('init', function() {
    AOS.refresh();
    Waypoint.refreshAll();
    setTimeout(function () {
      $aboutSlider.find('.slide').eq(0).addClass('slide-animated');
    }, 100);
  });

  $aboutSlider.on('beforeChange', function(_, slick, current, next) {
    var $currentSlide = $(slick.$slides[current]);
    var $nextSlide = $(slick.$slides[next]);

    $currentSlide.removeClass( 'slide-animated' );
    $nextSlide.addClass( 'slide-animated' );
    $('.about-slider .num-current').text( next + 1 );
  });

  $aboutSlider.slick({
    infinite: true,
    arrows: true,
    dots: false,
    fade: true,
    prevArrow: $('.about-slider .arr-left'),
    nextArrow: $('.about-slider .arr-right')
  });

$('.js-requisites-toggle').click(function(e) {
  e.preventDefault();
  $(this).toggleClass('active');
  if ($(this).hasClass('active')) {
    $(this).find('span').eq(0).text('Скрыть');
  } else {
    $(this).find('span').eq(0).text('Банковские реквизиты');
  }

  $('.js-requisites').slideToggle();
});

  $('.js-circle').on('circle-animation-progress', function functionname(event, progress, step) {
    var $this = $(this);
    var tovalue = $this.data('circle-value');
    var maxvalue = $this.data('circle-max-value');
    $this.find('.num').text(parseInt(tovalue * progress));
  });

  // слайдер пакетов услуг
  $packagesSlider.on('init', function() {
    AOS.refresh();
    Waypoint.refreshAll();
  });

  $packagesSlider.slick({
    adaptiveHeight: true,
    autoplay: false,
    arrows: false,
    infinite: false,
    dots: false,
    initialSlide: 2
  });

  // Отрисовка в шапке на главной
  if ($('#target').length > 0) {
    new Vivus('target', {
      duration: 200,
      type: 'sync'
    }, onSvgDrawEnd).play();
  }
  // СОБЫТИЯ, ТАЙМАУТЫ И ПРОЧ.
  setTimeout(function() {
    $servicesPromoSlider.slick('slickSetOption', 'autoplay', true, true);
  }, 2500);

  $servicesPromoSlider.on('beforeChange', function(_, slick, currentSlide, next) {
    $('.services-promo-slider').find('.navigation a').removeClass('active').eq(next).addClass('active');
  });

  $('.services-promo-slider').find('.navigation').on('click', 'a', function(e) {
    e.preventDefault();
    var idx = $(this).index();
    $servicesPromoSlider.slick('slickGoTo', idx);
  });

  $projectsSlider.on('beforeChange', function(_, slick, currentSlide, next) {
    var $activeSlide = $(slick.$slides[next]);
    var $circles = $activeSlide.find('.js-circle');
    $projectsSlider.parent().find('.showcase-navigation a').removeClass('active').eq(next).addClass('active');

    // сменить картинку с слайдере с проектами
    changePicture(currentSlide, next);
    $('.js-circle').removeClass('active');

    if ($circles.hasClass('active')) {
      animateCircles($circles, true);
    } else {
      animateCircles($circles);
    }
  });

  $('.projects').find('.showcase-navigation').on('click', 'a', function(e) {
    e.preventDefault();
    var idx = $(this).index();
    $projectsSlider.slick('slickGoTo', idx);
  });

  $packagesSlider.on('swipe', function(_, slick, current, next) {
    var $slider = $(slick.$slides.context);
    console.log(slick);
    $slider.closest('.js-tabs').find('.js-tab-link').eq(slick.currentSlide).trigger('click');
  });

  // js tabs
  $('.js-tab-link').click(function(e) {
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
