(function ($) {

    /* Глобальные константы */

    let isDesktop; /* т.е. не смартфон, а любой десктоп */
    let isMonitor; /* т.е. монитор типа 1920 */
    let responsiveSpacing;
    let headerHeight;

    function initGlobalConstant() {
        isDesktop = window.matchMedia("(min-width: 740px)").matches;
        isMonitor = window.matchMedia("(min-width: 1850px)").matches;
        responsiveSpacing = !isDesktop ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('--container-padding')) : 40;
        headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0;
    }

    /* При открытии страницы */
    initGlobalConstant();

    /* При ресайзе страницы */
    window.addEventListener('resize', initGlobalConstant);





    /* Все слайдеры в одной функции, чтобы их можно было переинициализировать при ресайзе */
    function initCarousels() {

        /* Swiper для галерей */

        let gallerySwipers = [];
        if (!isDesktop) {

            document.querySelectorAll('.carousel--js-init-gallery').forEach(($carousel) => {

                const swiperInstance = new Swiper($carousel.querySelector('.swiper'), {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: responsiveSpacing,
                    autoHeight: true,

                    pagination: {
                        el: $carousel.querySelector('.carousel__pagination'),
                        type: "fraction",
                    },

                    navigation: {
                        prevEl: $carousel.querySelector('.carousel__button--prev'),
                        nextEl: $carousel.querySelector('.carousel__button--next'),
                    }
                });

                gallerySwipers.push(swiperInstance);

            });

        } else {

            gallerySwipers.forEach(function (swiper) {
                swiper.destroy();
            });
        }



        /* Swiper для слайдера */

        document.querySelectorAll('.carousel--js-init-slider').forEach(($carousel) => {

            new Swiper($carousel.querySelector('.swiper'), {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: responsiveSpacing,
                autoHeight: true,

                pagination: {
                    el: $carousel.querySelector('.carousel__pagination'),
                    type: "fraction",
                },

                navigation: {
                    prevEl: $carousel.querySelector('.carousel__button--prev'),
                    nextEl: $carousel.querySelector('.carousel__button--next'),
                },

                breakpoints: {
                    740: {
                        pagination: {
                            el: $carousel.querySelector('.carousel__pagination'),
                            type: "bullets",
                            bulletClass: 'carousel__bullet',
                            bulletActiveClass: 'carousel__bullet--current',
                            clickable: true
                        },
                    },
                },
            });
        });



        /* Swiper для слайдера */

        const progressCircle = document.querySelector(".carousel__progress");

        document.querySelectorAll('.carousel--js-init-intro').forEach(($carousel) => {

            new Swiper($carousel.querySelector('.swiper'), {
                slidesPerView: 1,
                slidesPerGroup: 1,

                autoplay: {
                    delay: 10000,
                    disableOnInteraction: true
                },

                on: {
                    autoplayTimeLeft(s, time, progress) {
                        progressCircle.style.setProperty("width", (1 - progress) * 100 + '%');
                    }
                },

                pagination: {
                    el: $carousel.querySelector('.carousel__pagination'),
                    type: "bullets",
                    bulletClass: 'carousel__bullet',
                    bulletActiveClass: 'carousel__bullet--current',
                    clickable: true
                },

                breakpoints: {
                    740: {
                        pagination: false
                    },
                },
            });
        });
    }



    $(document).ready(initCarousels);

    $(window).on('resize', function () {
        setTimeout(initCarousels, 1000)
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
        if ($(window).scrollTop() > 10) {
            $html.addClass('page-scrolled');
        } else {
            $html.removeClass('page-scrolled');
        }
    }


    /* Бургер */

    let rememberedPageScrollPosition = 0;

    $('.header__toggle-menu').on('click', function () {

        if (!$html.hasClass('burger-expanded')) {

            if (!isDesktop) {
                rememberedPageScrollPosition = $(window).scrollTop(); /* Запомнить скролл пользователя, так как display: none на .page его сбросит (смотри .burger-expanded .page) */
            }

            $html.addClass('burger-expanded');

            if (!isDesktop) {
                $(window).scrollTop(0); /* При открытии меню, его скролл должен быть в начале */
            }

        } else {

            $html.removeClass('burger-expanded');

            if (!isDesktop) {
                $(window).scrollTop(rememberedPageScrollPosition);/* При закрытии меню скролл должен быть там, где пользователь его оставил */
            }
        }
    });


    $(document).on('click', function (event) {
        if (!$(event.target).closest('.header__dropdown, .header__toggle-menu').length) {
            $html.removeClass('burger-expanded');
        }
    });


    $(document).on('keyup', function (event) {
        if (event.keyCode === 27) {
            $html.removeClass('burger-expanded');
        }
    });

    $('.header__close-menu').on('click', function () {
        $html.removeClass('burger-expanded');
    })


    /* Аккордеон */

    $('.accordion__handler').on('click', function () {
        const item = $(this).parents('.accordion__item');
        const expandedSibling = item.siblings('.accordion__item--expanded');

        if( ! item.hasClass('accordion__item--expanded') ) {
            expandedSibling.removeClass('accordion__item--expanded');
            expandedSibling.find('.accordion__dropdown').slideUp(300);
            item.addClass('accordion__item--expanded');
            item.find('.accordion__dropdown').slideDown(300);
        } else  {
            item.removeClass('accordion__item--expanded');
            item.find('.accordion__dropdown').slideUp(300);
        }
    });



    /* Инпуты */

    /* Select placeholder */
    function selectPlaceholder($element) {
        if ($element.val() === 'placeholder') {
            $element.parent('.input').addClass('input--placeholder-is-chosen');
        } else {
            $element.parent('.input').removeClass('input--placeholder-is-chosen');
        }
    }

    $('select.input__widget').each(function () {
        selectPlaceholder($(this));
    }).on('change', function () {
        selectPlaceholder($(this));
    });

    /* Expanding textarea */
    function expandTextarea($element) {
        $element.css('height', 'auto');
        $element.css('height', ($element[0].scrollHeight + 2 * parseInt($element.css('border-width'), 10)) + 'px');
    }

    const $expandableInputs = $('.input--expandable .input__widget');

    $expandableInputs.each(function () {
        expandTextarea($(this));
    }).on('input', function () {
        expandTextarea($(this));
    });

    $(window).on('resize', function () {
        $expandableInputs.each(function () {
            expandTextarea($(this));
        });
    });
    /* Error field */
    $('.input__widget').on('focus', function () {
        $(this).parents('.input').removeClass('input--error');
        $(this).parents('.input').nextUntil(':not(.helper--error)').remove();
    });




    /* Форма */

    /* Уведомления */
    document.querySelectorAll('.alert').forEach(function (alert) {
        alert.addEventListener('click', function () {
            alert.style.display = 'none';
        });
    });

    document.addEventListener('keyup', function (event) {
        if (event.keyCode === 27) {
            document.querySelectorAll('.alert').forEach(function (alert) {
                alert.style.display = 'none';
            });
        }
    });


    /* Сама форма */
    document.querySelectorAll('[data-js-form]').forEach(function (form) {
        const subscriptionInputs = form.querySelectorAll('.input, .choice');
        const subscriptionSubmit = form.querySelector('[data-js-submit]');
        const subscriptionSuccessAlert = document.querySelector('[data-js-alert-success]');
        const subscriptionFailureAlert = document.querySelector('[data-js-alert-failure]');

        /* Состояния инпутов (на время отправки формы инпуты должны блокироваться) */
        function disableSubscriptionInputs() {
            subscriptionInputs.forEach((input) => {
                input.querySelector('.input__widget, .choice__widget').setAttribute('disabled', 'disabled');
            });
        }

        function enableSubscriptionInputs() {
            subscriptionInputs.forEach((input) => {
                input.querySelector('.input__widget, .choice__widget').removeAttribute('disabled');
            });
        }

        /* Очистка инпутов (после успешной отправки форму должны очищаться) */
        function cleanSubscriptionInputs() {

            subscriptionInputs.forEach((input) => {

                /* Есть три варианта инпутов: */

                // 1) Текстовые инпуты внутри компонента .input (это всё, что не тег <select>):
                const textInputs = input.querySelector('.input__widget:not(select)');
                if (textInputs) {
                    textInputs.value = '';
                }

                // 2) <select> внутри .input
                const selects = input.querySelector('select.input__widget');
                if (selects) {
                    const placeholderOption = Array.from(selects.options).find(option => option.getAttribute('value') === 'placeholder');
                    if (placeholderOption) {
                        selects.value = placeholderOption.value;
                        input.classList.add('input--placeholder-is-chosen');
                    }
                }

                // 3) .choice__widget
                const choices = input.querySelector('.choice__widget');
                if (choices) {
                    choices.checked = false;
                }
            });
        }

        /* Состояния кнопки */
        function changeSubmitStateToLoading() {
            subscriptionSubmit.classList.add('button--loading');
            subscriptionSubmit.setAttribute('disabled', 'disabled');
        }

        function changeSubmitStateToSuccess() {
            subscriptionSubmit.classList.remove('button--loading');
            subscriptionSubmit.classList.add('button--success');
            subscriptionSubmit.setAttribute('disabled', 'disabled');
        }

        function changeSubmitStateToFailure() {
            subscriptionSubmit.classList.remove('button--loading');
            subscriptionSubmit.classList.add('button--warning');
            subscriptionSubmit.setAttribute('disabled', 'disabled');
        }

        function changeSubmitStateToPristine() {
            subscriptionSubmit.classList.remove('button--loading', 'button--success', 'button--warning');
            subscriptionSubmit.removeAttribute('disabled');
        }

        /* Если пользователь начал взаимодействовать с инпутами, то убираем уведомления с прошлой попытки отправки: */
        subscriptionInputs.forEach(input => input.addEventListener('input', () => {
            subscriptionFailureAlert.style.display = 'none';
        }));


        /* Отправка */
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            /* Если с прошлой попытки висит уведомление об ошибке: */
            subscriptionFailureAlert.style.display = 'none';

            /* Начинаем отправку данных, для начала блокируем форму */
            disableSubscriptionInputs();
            changeSubmitStateToLoading();

            /* Представим, что 3000ms отправляем данные */
            setTimeout(function () {

                /* ... дальше развилка, пусть для примера будет рандом 50/50: */

                // Если данные успешно отправлены
                if (Math.random() < 0.5) {

                    // показываем зелёное уведомление:
                    subscriptionSuccessAlert.style.display = 'block';

                    // показываем галочку на кнопке:
                    changeSubmitStateToSuccess();

                    // и то и другое на 4.5 секунды:
                    setTimeout(function () {
                        subscriptionSuccessAlert.style.display = 'none';
                        changeSubmitStateToPristine();
                        enableSubscriptionInputs();

                        //и очищаем форму:
                        cleanSubscriptionInputs();
                    }, 4500);

                }

                // Если произошла ошибка
                else {

                    // показываем красное уведомление
                    subscriptionFailureAlert.style.display = 'block';

                    // Показываем восклицательный знак на кнопке:
                    changeSubmitStateToFailure();

                    // В данном случае всего 2 секунды, чтобы пользователь мог быстро вернуться к работе с формой.
                    // Уведомление в этом случае НЕ убираем -- пусть висит, пока пользователь не увидит и явно не закроет, или не начнёт заново заполнять форму / попытается отправить:
                    setTimeout(function () {
                        changeSubmitStateToPristine();
                        enableSubscriptionInputs();
                    }, 2000);

                }

            }, 3000);

        });
    });


    /* Переключатель в групповой заявке */

    document.addEventListener("DOMContentLoaded", function () {

        const switchItems = document.querySelectorAll('[data-js-application-performances], [data-js-application-excursions]');
        const selectField = document.querySelector('[data-js-application-select-show]');

        switchItems.forEach((item) => {
            item.addEventListener('click', function () {
                switchItems.forEach(btn => btn.classList.remove('switch__item--current'));
                this.classList.add('switch__item--current');
                selectField.style.display = this.hasAttribute('data-js-application-performances') ? 'block' : 'none';
            });
        });
    });



    /* Clipped */

    function resize($clipped) {
        if ( ! $clipped.hasClass('clipped--open') ) {
            $clipped.find('.clipped__viewport').css('height', $clipped.attr('data-canonical-height') );
        } else {
            $clipped.find('.clipped__viewport').css('height', $clipped.attr('data-actual-height') );
        }
    }


    function init() {
        $('.clipped').each(function () {

            var $clipped = $(this);
            var height = 0;
            var canonicalHeight = 0;

            /* Reset heights to their defaults before measuring */
            $clipped.addClass('clipped--measurement');

            /* Measure */
            height = $clipped.find('.clipped__content').outerHeight();
            canonicalHeight = parseInt( $clipped.attr('data-canonical-height') );

            /* if Monitor */
            if(isMonitor) {
                canonicalHeight = canonicalHeight * 1.2;
                $clipped.attr('data-canonical-height', canonicalHeight)
            }

            $clipped.attr('data-actual-height', height);

            /* Back to what it was before measurement */
            $clipped.removeClass('clipped--measurement');

            /* Do we need to run the whole thing? */
            if( height > canonicalHeight ) {
                $clipped.addClass('clipped--expandable');

                /* Set heights */
                resize($clipped);

            } else {
                $clipped.removeClass('clipped--expandable');
                $clipped.find('.clipped__viewport').css('height', '' );
            }
        });
    }


    $(window).on('resize', init);
    $(window).on('load', init);

    $('.clipped__handler').on('click', function () {
        var $clipped = $(this).parents('.clipped');
        $clipped.toggleClass('clipped--open');
        resize($clipped);
    });



    /* Tabs */

    $('.tabs__tag').on('click', function (event) {
        event.preventDefault();
        const $tabs = $(this).parents('.tabs');
        const index = $(this).index();

        const $handler = $tabs.find('.tabs__handler');
        const label = $(this).text();

        /* tag */
        $tabs.find('.tabs__tag--current').removeClass('tabs__tag--current');
        $(this).addClass('tabs__tag--current');

        /* body */
        $tabs.find('.tabs__item--current').removeClass('tabs__item--current');
        $tabs.find('.tabs__item:eq('+index+')').addClass('tabs__item--current');

        /* handler */
        $handler.text(label);
    });

    $('.tabs__handler').on('click', function () {
        $(this).parents('.tabs').toggleClass('tabs--expanded');
    })

    $(document).on('click', function (event) {
        if (!$(event.target).closest('.tabs__handler, .tabs__nav').length) {
            $('.tabs').removeClass('tabs--expanded');
        }
    });




    /* month */

    $('.month__handler').on('click', function (event) {
        $(this).parents('.month').toggleClass('month--expanded');
    });



    /* picker */

    $('.picker__handler').on('click', function () {
        const $picker = $(this).parents('.picker');
        $('.picker').not($picker).removeClass('picker--expanded');
        $picker.toggleClass('picker--expanded');
    });


    $(document).on('click', function (event) {
        if (!$(event.target).closest('.picker').length) {
            $('.picker').removeClass('picker--expanded');
        }
    });


    $(document).on('keyup', function (event) {
        if (event.keyCode === 27) {
            $('.picker').removeClass('picker--expanded');
        }
    });



    /* filters */

    $('.filters__handler').on('click', function () {
        $(this).parents('.filters').toggleClass('filters--expanded');
    });

    $(document).on('keyup', function (event) {
        if (event.keyCode === 27) {
            $('.picker').removeClass('picker--expanded');
        }
    });



    /* Play */

    $('.play__handler').on('click', function () {
        $(this).parents('.play__schedule').toggleClass('play__schedule--expanded');
    });


})(jQuery);

