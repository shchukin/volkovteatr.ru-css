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



        /* Swiper для фидбека */

        document.querySelectorAll('.carousel--js-init-feedback').forEach(($carousel) => {

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
                        slidesPerView: 2,
                        slidesPerGroup: 2,
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



        /* Swiper для Intro */

        const introTiles = document.querySelectorAll('.jumbotron__tile');
        const introSlideAutoplayDuration = 10000;

        document.querySelectorAll('.carousel--js-init-intro').forEach(($carousel) => {

            const progressCircle = $carousel.querySelector(".carousel__progress");

            const swiper = new Swiper($carousel.querySelector('.swiper'), {
                slidesPerView: 1,
                slidesPerGroup: 1,

                autoplay: {
                    delay: introSlideAutoplayDuration,
                    disableOnInteraction: false
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


            swiper.on('slideChange', function () {
                const currentSlide = swiper.slides[swiper.activeIndex];
                const video = currentSlide.querySelector('video');

                if (video) {

                    // для слайдов с видосами нужно будет пересчитать время для autoplay, сразу вырубаем его
                    swiper.autoplay.stop();

                    // Каждое видео каждый раз запускаем с начала
                    video.currentTime = 0;
                    video.play();

                    // новое время для текущего слайда
                    swiper.params.autoplay.delay = video.duration * 1000 - 2 * swiper.params.speed; /* swiper.params.speed -- время между слайдами */

                    // запускаем autoplay после установки нового времени
                    swiper.autoplay.start();
                } else {
                    swiper.params.autoplay.delay = introSlideAutoplayDuration;
                }

                if(introTiles.length) {
                    introTiles.forEach(element => element.classList.remove('jumbotron__tile--current'));
                    introTiles[swiper.activeIndex].classList.add('jumbotron__tile--current')
                }
            });


            introTiles.forEach((tile, index) => {
                tile.addEventListener('click', () => {
                    swiper.slideTo(index)
                });
            });


        });





        /* Swiper для Stories */

        document.querySelectorAll('.carousel--js-init-stories').forEach(($carousel) => {

            const progressCircle = $carousel.querySelectorAll(".story__progress");

            new Swiper($carousel.querySelector('.swiper'), {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: responsiveSpacing,
                centeredSlides: true, // Центрирование нужно, чтобы активным подсвечивался центральный айтем
                loop: true, // а чтобы слева, до первого айтема не было дыры приходится зацикливаться

                autoplay: {
                    delay: 3000
                },

                on: {
                    autoplayTimeLeft(s, time, progress) {
                        progressCircle.forEach(circle => {
                            circle.style.setProperty("width", (1 - progress) * 100 + '%');
                        });
                    }
                },

                navigation: {
                    prevEl: $carousel.querySelector('.carousel__button--prev'),
                    nextEl: $carousel.querySelector('.carousel__button--next'),
                },

                pagination: {
                    el: $carousel.querySelector('.carousel__pagination'),
                    type: "fraction",
                },

                breakpoints: {
                    740: {
                        slidesPerView: 'auto',
                        slidesPerGroup: 1,
                        speed: 800,
                        spaceBetween: 30,
                        pagination: false,
                        simulateTouch: false,  // Prevent touch gestures from initiating slide changes
                        allowTouchMove: false, // Disable all touch and mouse drag interactions
                    },
                    1850: {
                        slidesPerView: 'auto',
                        slidesPerGroup: 1,
                        speed: 800,
                        spaceBetween: 40,
                        pagination: false,
                        simulateTouch: false,  // Prevent touch gestures from initiating slide changes
                        allowTouchMove: false, // Disable all touch and mouse drag interactions
                    }
                },
            });
        });
    }



    $(document).ready(initCarousels);

    $(window).on('resize', function () {
        setTimeout(initCarousels, 1000)
    });


    /* Slick */


    $(document).ready(function() {
        const autoplaySpeed = 3000; // Define autoplay speed (3 seconds)
        const $slider = $('.slick-slider--init-stories');

        $slider.slick({
            centerMode: true,
            centerPadding: '60px',
            autoplay: true,
            autoplaySpeed: autoplaySpeed,
            pauseOnHover: false,
            pauseOnFocus: false,
            pauseOnSwipe: false,
            infinite: true,
            slidesToShow: 5,
            draggable: false,

            /* Адаптив от большего к меньшему: */
            responsive: [
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 3,
                    }
                },
                {
                    breakpoint: 740,
                    settings: {
                        slidesToShow: 1,
                        centerPadding: '0',
                        draggable: true,
                    }
                }
            ]
        });


        /* Прогрессбар в сторисах работает прост как изменение ширины через стилевой transition */

        const $progressBars = $('.story__progress');
        $progressBars.css('width', '0');

        function resetProgressBars() {
            $progressBars.css('width', '0');
        }

        function animateProgressBar(index) {
            resetProgressBars();
            const $currentProgressBar = $(`.slick-slide[data-slick-index="${index}"] .story__progress`);
            $currentProgressBar.css({
                width: '0',
                transition: 'none'
            });
            setTimeout(() => {
                $currentProgressBar.css({
                    transition: `width ${autoplaySpeed + 400}ms linear`, // 400ms -- time included in slide change
                    width: '100%'
                });
            }, 50); // Задержка нужна для того, чтобы убедиться, что transition применился
        }

        $slider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            animateProgressBar(nextSlide);
        });

        animateProgressBar(0);
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

                // Перезапускаем обсчёт expanding textareas для инстансов внутри открытой модалки
                const instance = $.magnificPopup.instance;
                const modalContent = instance.content[0];
                const textareas = $(modalContent).find('.input--expandable .input__widget');

                textareas.each(function () {
                    expandTextarea($(this));
                });

                /* Шапка фиксированная, ей тоже надо корректировать пропавшее пространство под скроллбаром */
                $fixedHeader.css({'margin-right': scrollWidth});
            },
            close: function () {
                $fixedHeader.css({'margin-right': '0'});
            }
        }
    });


    $('.mfp-image').magnificPopup({
        type: 'image',
        removalDelay: 200,
        showCloseBtn: false,
        callbacks: {
            open: function () {

                // Перезапускаем обсчёт expanding textareas для инстансов внутри откртой модалки
                const instance = $.magnificPopup.instance;
                const modalContent = instance.content[0];
                const textareas = $(modalContent).find('.input--expandable .input__widget');

                textareas.each(function () {
                    expandTextarea($(this));
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
        if (!$(event.target).closest('.header__dropdown, .header__toggle-menu, .header__detachable-part').length) {
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

        const applicationSwitch = document.querySelectorAll('[data-js-application-performances], [data-js-application-excursions]');
        const applicationSpectacleSelect = document.querySelector('[data-js-application-select-show]');

        const applicationSpectacleHeader = document.querySelector('[data-js-application-spectacle-header]');
        const applicationExcursionHeader = document.querySelector('[data-js-application-excursion-header]');

        applicationSwitch.forEach((item) => {
            item.addEventListener('click', function () {
                applicationSwitch.forEach(btn => btn.classList.remove('switch__item--current'));
                this.classList.add('switch__item--current');

                applicationSpectacleHeader.style.display = this.hasAttribute('data-js-application-performances') ? 'block' : 'none';
                applicationExcursionHeader.style.display = this.hasAttribute('data-js-application-performances') ? 'none' : 'block';

                applicationSpectacleSelect.style.display = this.hasAttribute('data-js-application-performances') ? 'block' : 'none';
            });
        });
    });



    /* Переключатель на главной */


    $('[data-js-schedule-switch]').on('click', function () {

        const $tabs = $(this).parents('.schedule');
        const index = $(this).index();

        /* tag */
        $tabs.find('.switch__item--current').removeClass('switch__item--current');
        $(this).addClass('switch__item--current');

        /* body */
        $tabs.find('.schedule__tab--current').removeClass('schedule__tab--current');
        $tabs.find('.schedule__tab:eq('+index+')').addClass('schedule__tab--current');

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



    /* Расхлопывание поиска */

    const $searchField = document.querySelector('.search-filter__widget');

    $('.header__action--search').on('click', function () {
        $html.addClass('search-expanded');
        $searchField.focus();
    });


    $('.header__close-search').on('click', function () {
        $html.removeClass('search-expanded');
    });

    $(document).on('keyup', function (event) {
        if (event.keyCode === 27) {
            $html.removeClass('search-expanded');
        }
    });



    /* Расхлопывание подменю на смартфонах */

    $('.nav__link').on('click', function (event) {
        if(!isDesktop) {
            const $navItem = $(this).parents('.nav__item');
            if ( $navItem.find('.nav__sub-nav').length ) {
                event.preventDefault();
                $navItem.toggleClass('nav__item--expanded');
            }
        }
    });




    /* Копипаста со старого сайта, с некоторыми правками */

    var initCheckoutMap = function () {
        var activePlaces = [];
        var prices = [];
        var items = $('.plans__main-scheme .checkout__map-place'); // в контектсе .plans__main-scheme только для главной сцены
        items.each(function (index, item) {
            $(item).attr('data-id', index);

            if (!$(item).hasClass('checkout__map-place--disabled') && !$(item).hasClass('checkout__map-place-fake')) {

                activePlaces.push(index);
                var currentPrice = Number($(item).attr('data-price'));
                if (!isNaN(currentPrice) && currentPrice !== 0 && prices.indexOf(currentPrice) < 0) {
                    prices.push(currentPrice);
                }
            }
        });

        prices.sort(function (a, b) {
            if (a > b) {
                return 1;
            }

            if (a < b) {
                return -1;
            }

            return 0;
        });

        //$('.checkout__map-places--active').text(activePlaces.length);
        $('.checkout__map-places--minprice').text(prices[0]);
        $('.checkout__map-places--maxprice').text(prices[prices.length - 1]);
    }

    var setPointPositionOnMiniMap = function (coords) {
        var fullMapWidth = $(".checkout__map-places-inner").width();
        var fullMapHeight = $(".checkout__map-places-inner").height();
        var coordX = coords[0];
        var coordY = coords[1];

        var leftPartOfMapCoords = Math.floor(fullMapWidth / 3);
        var middleXPartOfMapCoords = leftPartOfMapCoords * 2;

        var topPartOfMapCoords = Math.floor(fullMapHeight / 3);
        var middleYPartOfMapCoords = topPartOfMapCoords * 2;


        if (coordX <= leftPartOfMapCoords) {

            if (coordY <= topPartOfMapCoords) {
                $('.checkout__map-nav-point').css({
                    'top': '11px',
                    'left': '11px'
                })
            } else if (coordY > topPartOfMapCoords && coordY <= middleYPartOfMapCoords) {
                $('.checkout__map-nav-point').css({
                    'top': '25px',
                    'left': '11px'
                })
            } else if (coordY > middleYPartOfMapCoords) {
                $('.checkout__map-nav-point').css({
                    'top': 'unset',
                    'bottom': '11px',
                    'left': '11px'
                })
            }

        } else if (coordX > leftPartOfMapCoords && coordX <= middleXPartOfMapCoords) {

            if (coordY <= topPartOfMapCoords) {
                $('.checkout__map-nav-point').css({
                    'top': '11px',
                    'left': '25px'
                })
            } else if (coordY > topPartOfMapCoords && coordY <= middleYPartOfMapCoords) {
                $('.checkout__map-nav-point').css({
                    'top': '25px',
                    'left': '25px'
                })
            } else if (coordY > middleYPartOfMapCoords) {
                $('.checkout__map-nav-point').css({
                    'top': 'unset',
                    'bottom': '11px',
                    'left': '25px'
                })
            }

        } else if (coordX > middleXPartOfMapCoords) {

            if (coordY <= topPartOfMapCoords) {
                $('.checkout__map-nav-point').css({
                    'top': '11px',
                    'left': 'unset',
                    'right': '11px'
                })
            } else if (coordY > topPartOfMapCoords && coordY <= middleYPartOfMapCoords) {
                $('.checkout__map-nav-point').css({
                    'top': '25px',
                    'left': 'unset',
                    'right': '11px'
                })
            } else if (coordY > middleYPartOfMapCoords) {
                $('.checkout__map-nav-point').css({
                    'top': 'unset',
                    'bottom': '11px',
                    'left': 'unset',
                    'right': '11px'
                })
            }

        }
    }



    $(document).ready(function () {

        var clientWidth = $(window).width();
        initCheckoutMap();
        $('.checkout__map-place').on('click', function () {
            $(this).toggleClass('checkout__map-place--active');
            var stage = $(this).attr('data-name-floor');
            var row = $(this).attr('data-name-row');
            var place = $(this).attr('data-place');
            var price = $(this).attr('data-price');
            var id = $(this).attr('data-id');



            if (!$(this).hasClass('checkout__map-place--active')) {
                $(this).removeClass('checkout__map-place--active')
                $('.checkout__summary-item[data-id="' + id + '"]').remove();
            }

            if ($('.checkout__map-place--active').length > 0) {
                $('.checkout-modal').attr('data-state', 'selected');
            } else {
                $('.checkout-modal').attr('data-state', 'select');
            }


        })

        $('.modal-close, .modal__overlay').on('click', function () {
            $('.checkout-modal').attr('data-state', 'select');
            $(this).closest('.modal').fadeOut("fast");
            $(this).closest('.checkout').fadeOut("fast");
            $('body').css('overflow', 'unset');
        });


        //добавление фотографий с мест (не для мобилок и не для камерной сцены)
        if ($(`[data-id=632]`).length != 0) {
            const arPlace = [
                0,
                4,
                8,
                239,
                244,
                355,
                372,
                391,
                427,
                465,
                542,
                596,
                632,
                663,
                359,
                236,
                718,
                681,
                768,
                289,
                308,
                76,
                98
            ];

            arPlace.forEach((el) => {
                $(`[data-id=${el}]`).addClass('checkout__map-place--photo');

                if ($(`[data-id=${el}]`).hasClass('checkout__map-place--disabled')) {
                    $(`[data-id=${el}]`).wrapAll(`<div class='pic-mod' data-id-mod=${el}>`);
                } else {
                    $(`[data-id=${el}]`).append(`<div class='pic-mod' data-id-mod=${el}>`);
                }
            });

            let timers = [];

            const clear = (arr) => {
                arr.forEach(el => {
                    clearTimeout(el);
                });
            }

            $('[data-id-mod]').on('mouseenter', function (e) {

                if (arPlace.indexOf($(e.target).data('id-mod')) != -1) {
                    $('.modal-pic').attr('href', '../content/scene-photo/' + $(e.target).data('id-mod') + '.jpg');
                    $('.modal-pic--picture').attr('src', '../content/scene-photo/' + $(e.target).data('id-mod') + '.jpg');
                    $('.modal-pic').show();
                    $('.modal-pic').css({
                        'top': e.pageY - 210,
                        'left': e.clientX - 150,
                    });
                    if (clientWidth < 1334) {
                        $('.modal-pic').css({
                            'height': 100,
                            'width': 150,
                            'top': e.pageY - 110,
                            'left': e.clientX - 80,
                        });
                        if ($(e.target).data('id-mod') == 236) {
                            $('.modal-pic').css({
                                'left': e.clientX - 150
                            });
                        }
                        if ($(e.target).data('id-mod') == 241) {
                            $('.modal-pic').css({
                                'left': e.clientX - 150
                            });
                        }
                        if ($(e.target).data('id-mod') == 244) {
                            $('.modal-pic').css({
                                'left': e.clientX - 150
                            });
                        }
                        if ($(e.target).data('id-mod') == 0) {
                            $('.modal-pic').css({
                                'left': e.clientX
                            });
                        }
                        if ($(e.target).data('id-mod') == 4) {
                            $('.modal-pic').css({
                                'left': e.clientX
                            });
                        }
                        if ($(e.target).data('id-mod') == 8) {
                            $('.modal-pic').css({
                                'left': e.clientX
                            });
                        }
                    }
                    clear(timers);
                    timers = [];
                }
            });

            $('[data-id-mod]').on('mouseleave', function (e) {
                if (arPlace.indexOf($(e.target).data('id-mod')) != -1) {
                    const _ = setTimeout(() => {
                        $('.modal-pic').hide();
                        $('.modal-pic').attr('href', '');
                        $('.modal-pic--picture').attr('src', '');
                    }, 100);
                    timers.push(_);
                }
            });

            $('.modal-pic').on('mouseenter', function () {
                clear(timers);
                timers = [];
            });

            $('.modal-pic').on('mouseleave', function () {
                const _ = setTimeout(() => {
                    $('.modal-pic').hide();
                    $('.modal-pic').attr('href', '');
                    $('.modal-pic--picture').attr('src', '');
                }, 100);
                timers.push(_);
            });

            $('.modal-pic').on('click', function (event) {
                event.preventDefault();

                const path = $(this).attr('href')

                $(this).hide();
                $(this).attr('href', '');
                $(this).find('.modal-pic--picture').attr('src', '');

                $.magnificPopup.open({
                    items: {
                        src: path,
                    },
                    type: 'image',
                });
            });
        }

    });

})(jQuery);

