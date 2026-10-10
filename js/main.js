(function ($) {
    "use strict";
    
    // loader
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 1);
    };
    loader();
    
    // Initiate the wowjs
    new WOW().init();
    
    // Custom Cubic Easing Smooth Scroll (easeInOutCubic via requestAnimationFrame)
    let scrollFrame = 0;
    let scrollToken = 0;

    function cancelScroll() {
        scrollToken++;
        if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
        scrollFrame = 0;
    }

    function smoothScrollTo(destination) {
        cancelScroll();
        const start = window.scrollY;
        const end = Math.max(0, destination);
        const distance = end - start;
        if (Math.abs(distance) < 2) {
            window.scrollTo(0, end);
            return;
        }
        const token = scrollToken;
        const duration = Math.min(1200, Math.max(600, Math.abs(distance) * 0.45));
        let started;
        
        const step = function(now) {
            if (token !== scrollToken) return;
            if (started === undefined) started = now;
            const progress = Math.min(1, (now - started) / duration);
            // easeInOutCubic easing: starts slowly, speeds up, and smoothly decelerates at target
            const easing = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, start + distance * easing);
            if (progress < 1) {
                scrollFrame = window.requestAnimationFrame(step);
            } else {
                scrollFrame = 0;
            }
        };
        scrollFrame = window.requestAnimationFrame(step);
    }

    // Cancel animation if user manually scrolls/keys
    window.addEventListener("wheel", cancelScroll, { passive: true });
    window.addEventListener("touchstart", cancelScroll, { passive: true });
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 250) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function (e) {
        e.preventDefault();
        smoothScrollTo(0);
        return false;
    });
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('nav-sticky');
        } else {
            $('.navbar').removeClass('nav-sticky');
        }
    });
    
    // Smooth scrolling on the navbar links with cubic easing
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var target = $(this.hash);
            if (target.length) {
                const targetPos = target.offset().top - 70;
                smoothScrollTo(targetPos);
                
                if ($(this).parents('.navbar-nav').length) {
                    $('.navbar-nav .active').removeClass('active');
                    $(this).closest('a').addClass('active');
                }
            }
        }
    });
    
    // Typed Initiate
    if ($('.hero .hero-text h2').length == 1) {
        var typed_strings = $('.hero .hero-text .typed-text').text();
        var typed = new Typed('.hero .hero-text h2', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }
    
    // Portfolio filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    $('#portfolio-filter li').on('click', function () {
        $("#portfolio-filter li").removeClass('filter-active');
        $(this).addClass('filter-active');
        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
})(jQuery);
