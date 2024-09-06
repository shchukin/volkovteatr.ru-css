document.addEventListener('DOMContentLoaded', () => {

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


});


/* Модалка -- здесь кусок кода на jQuery поскольку пока не могу
   найти хорошую замену magnific popup */

(function ($) {

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

})(jQuery);


/* Маска для телефона -- используем старую версию input.mask
 * Для неё есть плагин для номеров телефонов, который понимает
 * русские города. Например, при ввооде +74852 скобочка увеличивается
 * с трёх до четырёх штук.
 */

(function ($) {

    $('[type="tel"]').inputmask({
        alias: 'phoneru',
    });

})(jQuery);
