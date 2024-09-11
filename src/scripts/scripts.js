(function ($) {

    /* Глобальные константы */

    let isDesktop;
    let responsiveSpacing;
    let headerHeight;

    function initGlobalConstant() {
        isDesktop = window.matchMedia("(min-width: 740px)").matches;
        responsiveSpacing = !isDesktop ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('--container-padding')) : 0;
        headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0;
    }

    /* При открытии страницы */
    initGlobalConstant();

    /* При ресайзе страницы */
    window.addEventListener('resize', initGlobalConstant);



    /* Swiper */

    var gallerySwiper;
    var isSwiperInit = false;

    function initSwiper() {

        if (!isDesktop) {

            if (!isSwiperInit) {
                isSwiperInit = true;

                // (1) Свайпер может сразу инициализировать несколько слайдеров, без forEach, но ...
                gallerySwiper = new Swiper('.swiper--init-gallery', {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: responsiveSpacing,
                    autoHeight: true,

                    pagination: {
                        el: ".swiper-pagination",
                        type: "fraction",
                    },

                    navigation: {
                        prevEl: '.swiper-button-prev',
                        nextEl: '.swiper-button-next',
                    }
                });
            }
        } else {

            if (isSwiperInit) {
                isSwiperInit = false;

                // (2) ... но для дестроя нужно уже знать, массив слайдеров ли это, или отдельный инстанс в объекте
                if (Array.isArray(gallerySwiper)) {
                    gallerySwiper.forEach(function(swiper) {
                        swiper.destroy();
                    });
                } else {
                    gallerySwiper.destroy();
                }
            }
        }
    }

    initSwiper();

    window.addEventListener('resize', function () {
        initSwiper();
    });






    /* Модалка */

    const $fixedHeader = $('.header__fixed-part');
    const scrollWidth = $(window).outerWidth() - $(window).width();

    $('.mfp-handler').magnificPopup({
        type: 'inline',
        removalDelay: 200,
        showCloseBtn: false,
        callbacks: {
            open: function () {

                // Перезапускаем обсчёт expanding textareas для инстансов внутри откртой модалки
                const instance = $.magnificPopup.instance;
                const modalContent = instance.content[0];
                const textareas = $(modalContent).find('.input--expandable .input__widget');
                textareas.each(function () {
                    expandTextarea(this);
                });

                /* Шапка фиксированная, ей тоже надо корректировать пропавшее пространство подскроллбаром */
                $fixedHeader.css({'margin-right': scrollWidth});
            },
            close: function () {
                $fixedHeader.css({'margin-right': '0'});
            }
        }
    });



    /* Маска для телефона -- используем старую версию input.mask
     * Для неё есть плагин для номеров телефонов, который понимает
     * русские города. Например, при ввооде +74852 скобочка увеличивается
     * с трёх до четырёх штук.
     */


    $('[type="tel"]').inputmask({
        alias: 'phoneru',
    });



    /* Скролл страницы */

    const $html = $('html');

    $(window).on('scroll', isPageScrolled);
    $(document).ready(isPageScrolled);

    function isPageScrolled() {
        if( $(window).scrollTop() > 10 ) {
            $html.addClass('page-scrolled');
        } else {
            $html.removeClass('page-scrolled');
        }
    }


    /* Бургер */

    let rememberedPageScrollPosition = 0;

    $('.header__toggle-menu').on('click', function () {

        if( ! $html.hasClass('burger-expanded') ) {
            if(!isDesktop) {
                rememberedPageScrollPosition = $(window).scrollTop(); /* Запомнить скролл пользователя, так как display: none на .page его сбросит (смотри .burger-expanded .page) */
            }
            $html.addClass('burger-expanded');
            $(window).scrollTop(0); /* При открытии меню, его скролл должен быть в начале */
        } else {
            $html.removeClass('burger-expanded');
            if(!isDesktop) {
                $(window).scrollTop(rememberedPageScrollPosition);/* При закрытии меню скролл должен быть там, где пользователь его оставил */
            }
        }
    });


    /* hide popup by overlay click ( goo.gl/SJG2Hw ) */

    $(document).on('click', function(event) {
        if (!$(event.target).closest('.header__dropdown, .header__toggle-menu').length) {
            $html.removeClass('burger-expanded');
        }
    });


    /* hide popup by Esc press */

    $(document).on('keyup', function(event) {
        if (event.keyCode == 27) {
            $html.removeClass('burger-expanded');
        }
    });

})(jQuery);

