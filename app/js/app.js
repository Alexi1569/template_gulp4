import LazyLoad from 'vanilla-lazyload';
import fancybox from '@fancyapps/fancybox';
import Swiper from 'swiper';
import mask from 'jquery-mask-plugin';
import scrollbar from '../libs/jquery.scrollbar.min';

jQuery(document).ready(function($) {
  let windowWidth = $(window).width();
  let containerW = $('.container').width();
  let headerHeight = $('.header').outerHeight(true);
  let windowHeight = $(window).height();

  $.fancybox.defaults.hideScrollbar = false;
  $.fancybox.defaults.touch = false;

  $.fancybox.defaults.btnTpl.smallBtn =
    '<span data-fancybox-close class="modal-close">' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.642 15.642"><path fill-rule="evenodd" d="M8.882 7.821l6.541-6.541A.75.75 0 1 0 14.362.219L7.821 6.76 1.28.22A.75.75 0 1 0 .219 1.281L6.76 7.822l-6.54 6.54a.75.75 0 0 0 1.06 1.061l6.541-6.541 6.541 6.541a.75.75 0 1 0 1.06-1.061l-6.54-6.541z"/></svg>' +
    '</span>';

  $(window).resize(function() {
    windowWidth = $(window).width();
    containerW = $('.container').width();
    headerHeight = $('.header').outerHeight(true);
    windowHeight = $(window).height();
  });

  $(window).on('load', function() {});

  $(document).on('click touchstart', function(event) {
    if (
      !$(event.target.closest('.category__sidebar')).is('.category__sidebar') &&
      $('.category__sidebar').hasClass('visible') &&
      !$(event.target.closest('.category__filter-open')).is(
        '.category__filter-open'
      )
    ) {
      $('.category__sidebar').removeClass('visible');
    }
  });

  if ('ontouchstart' in document.documentElement) {
    $('body').addClass('touch-device');
  } else {
    $('body').removeClass('touch-device');
  }

  $('.only-text-input').bind('keyup blur', function() {
    var node = $(this);
    node.val(node.val().replace(/[^a-zA-Zа-яА-Я ]/g, ''));
  });

  $('.only-numbers-input').bind('keyup blur', function() {
    var node = $(this);
    node.val(node.val().replace(/[^0-9 ()-+]/g, ''));
  });

  $('.js-tabs').each(function() {
    var $el = $(this);
    var $top = $el.find('.tabs__top li');
    var $bottom = $el.find('.tabs__item');

    $top.click(function(e) {
      e.preventDefault();
      var target = $(this).data('tab');
      var $activeItem = $el.find('.tabs__item.active');
      var activeTab = $el.find('.tabs__top li.active').data('tab');

      if (!(target === activeTab)) {
        $el.find('.tabs__top li.active').removeClass('active');
        $(this).addClass('active');
        activeTab = $el.find('.tabs__top li.active').data('tab');

        $activeItem.fadeOut(220, function() {
          $activeItem.removeClass('active');

          $(activeTab).fadeIn(350, function() {
            $(activeTab).addClass('active');
          });
        });
      }
    });
  });

  if ($('.scrollbar-outer').length) {
    $('.scrollbar-outer').scrollbar();
  }

  if ($('.custom-select').length) {
    $('.custom-select').each(function() {
      $(this).select2({
        minimumResultsForSearch: -1,
        dropdownParent: $(this).closest('.select'),
        dropdownCssClass: 'select-drop',
        containerCssClass: 'select-wrap'
      });
    });
  }

  $('.js-scroll-top').click(function(e) {
    e.preventDefault();

    var target = $(this).attr('href');
    $('html, body').animate({ scrollTop: $(target).offset().top }, 700);
  });

  if ($('.lazyload').length) {
    window.lazyLoadInstance = new LazyLoad({
      elements_selector: '.lazyload'
    });
  }

  $('.js-menu-open').click(function() {
    $('#mobile-menu').toggleClass('active');
    $(this).toggleClass('active');
  });

  if ($('body').hasClass('touch-device')) {
    $('.list-select__top').click(function() {
      $(this)
        .closest('.list-select')
        .toggleClass('active');
    });
  }
});
