var appMaster = {

    preLoader: function(){
        imageSources = []
        $('img').each(function() {
            var sources = $(this).attr('src');
            imageSources.push(sources);
        });
        if($(imageSources).load()){
            $('.pre-loader').fadeOut('slow');
        }
    },

    smoothScroll: function() {
        // Smooth Scrolling
        $('a[href*=#]:not([href=#carousel-example-generic])').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {

                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });
    },

    reviewsCarousel: function() {
        // Reviews Carousel
        $('.review-filtering').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 5000
        });
    },

    screensCarousel: function() {        
        // Screens Carousel
        $('.filtering').slick({
            slidesToShow: 3,
            slidesToScroll: 3,
            dots: false,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            }, {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }, {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
        });

        $('.js-filter-all').on('click', function() {
            $('.filtering').slickUnfilter();
            $('.filter a').removeClass('active');
            $(this).addClass('active');
        });

        $('.js-filter-one').on('click', function() {
            $('.filtering').slickFilter('.one');
            $('.filter a').removeClass('active');
            $(this).addClass('active');
        });

        $('.js-filter-two').on('click', function() {
            $('.filtering').slickFilter('.two');
            $('.filter a').removeClass('active');
            $(this).addClass('active');
        });

        $('.js-filter-three').on('click', function() {
            $('.filtering').slickFilter('.three');
            $('.filter a').removeClass('active');
            $(this).addClass('active');
        });

        // Re-init popup whenever filter is called
        $('.filter .button').click(function() {
            appMaster
                .popUp('.popup_ig_gallery', {
                    "url": "data/ig_info.json",
                });
        });

    },

    animateScript: function() {
        $('.scrollpoint.sp-effect1').waypoint(function(){
            if (!$(this).hasClass('active')) {
                $(this).toggleClass('active');
                $(this).toggleClass('animated fadeInLeft');
            }
        },{
            offset:'100%'
        });
        $('.scrollpoint.sp-effect2').waypoint(function(){
            if (!$(this).hasClass('active')) {
                $(this).toggleClass('active');
                $(this).toggleClass('animated fadeInRight');
            }
        },{
            offset:'100%'
        });
        $('.scrollpoint.sp-effect3').waypoint(function(){
            if (!$(this).hasClass('active')) {
                $(this).toggleClass('active');
                $(this).toggleClass('animated fadeInDown');
            }
        },{
            offset:'100%'
        });
        $('.scrollpoint.sp-effect4').waypoint(function(){
            if (!$(this).hasClass('active')) {
                $(this).toggleClass('active');
                $(this).toggleClass('animated fadeIn');
            }
        },{
            offset:'100%'
        });
        $('.scrollpoint.sp-effect5').waypoint(function(){
            if (!$(this).hasClass('active')) {
                $(this).toggleClass('active');
                $(this).toggleClass('animated fadeInUp');
            }
        },{
            offset:'100%'
        });
    },

    revSlider: function() {

        var docHeight = $(window).height();


        var mainSlider = $('.tp-banner').revolution({
            delay: 9000,
            startwidth: 1170,
            startheight: docHeight,
            hideThumbs: 10,
            touchenabled: false,
            fullWidth: "on",
            hideTimerBar: "on",
            fullScreen: "on",
            onHoverStop: "off",
            fullScreenOffsetContainer: ""
        });
        
    },

    scrollMenu: function(){
        var num = 50; //number of pixels before modifying styles

        $(window).bind('scroll', function () {
            if ($(window).scrollTop() > num) {
                $('nav').addClass('scrolled');

            } else {
                $('nav').removeClass('scrolled');
            }
        });
    },

    /*
        gallery: string, class name
            groups related img together
        options object accepts
        scrollable: boolean
            whether main screen is scrollable when popup is open
            defaults to false
        url: string
            location of jsonp data
    */
    popUp: function(gallery, options) {
        options.scrollable = 
            options.scrollable !== undefined 
                ? options.scrollable : false;

        // clean up any existing popup events/data to prevent duplication
        $(document).off('.popup', gallery);
        $(document).off('click', '[href="popup_next"], [href="popup_prev"]');
        $(gallery).removeData('popup');            

        // retrieve json data for ig description
        $.ajax({
            url: options.url,
            type: 'GET',
            dataType: 'jsonp',
            crossDomain: true,
            jsonpCallback: "cb",
            success: function(data) {

                // Popup Overlay
                var ig_settings = {
                    // custom property 
                    gallery: gallery,
                    scrollable: options.scrollable,

                    // standard plugin properties
                    closeContent: '',

                    markup: 
                    '<div class="popup">'+
                        '<div class="popup_content_wrap">'+
                            '<div class="popup_content"></div>'+
                            '<div class="popup_nav">'+
                                '<a href="popup_next"></a>'+
                                '<a href="popup_prev"></a>'+
                            '</div>'+
                        '</div>'+
                        '<div class="popup_details">'+
                             '<ul></ul>'+
                         '</div>'+
                    '</div>',

                    replaced: function($popup, $back){

                        // update markup with data
                        var $details = $('.popup_details ul', $popup);
                        var name = $('.popup_active').parent().find('.ig-name').text();
                        var info = data[name];

                        // clears text first
                        $details.html('');

                        $.each(info, function(k, v) {
                            $details.append('<li>' + k + ': ' + v + '</li>');
                        });


                        var plugin = this;
                        var $pop = $('.popup', $popup);
                        
                        // Animate the popup to new size
                        $pop.animate({
                            width : $pop.find('img').outerWidth(true),
                            height : $pop.find('.popup_content').outerHeight(true) +
                                     $pop.find('.popup_details').outerHeight(true)
                        }, {
                            duration : 50,
                            step : function(){
                                // Need to center the poup on each step
                                $popup.css({
                                    top  : plugin.getCenter().top,
                                    left : plugin.getCenter().left
                                });
                            },
                            complete : function(){
                                // Fade in!
                                $pop
                                    .find('.popup_content')
                                    .animate({opacity : 1}, plugin.o.speed, function(){
                                        plugin.center();
                                        plugin.o.afterOpen.call(plugin);
                                    });
                            }
                        });
                    },

                    show: function($popup, $back){
                        // Update markup with data
                        var $details = $('.popup_details ul', $popup);
                        var name = $('.popup_active').parent().find('.ig-name').text();
                        var info = data[name];

                        $.each(info, function(k, v) {
                            $details.append('<li>' + k + ': ' + v + '</li>');
                        });
                        
                        // Styling
                        var plugin = this;
                        var $pop = $('.popup', $popup);

                        // Default fade in
                        $popup.
                            animate({opacity : 1}, plugin.o.speed, 
                                function(){
                                    plugin.o.afterOpen.call(plugin);
                                });
                        
                        // Set the inline styles as we animate later
                        $pop.css({
                            width  : $pop.find('img').outerWidth(true),
                        });

                        plugin.center();
                    },

                    afterOpen: function() {
                        var plugin = this;
                        if (plugin.o.scrollable === false) {
                            $('body').addClass('modal-open');
                        }
                    },
                    afterClose: function() {
                        // Resets the gallery index
                        this.currentIndex = undefined;
                        
                        // Enable scrolling
                        $('body').removeClass('modal-open');
                    },
                };

                $(gallery).popup(ig_settings);

            },
        });

        // Next and prev links for any items using Popup.js plugin
        $(document).on('click', '[href="popup_next"], [href="popup_prev"]', function(e) {
            e.preventDefault();

            var $current = $('.popup_active');
            var popup = $current.data('popup');
            var $items = $(popup.o.gallery);
            var numItems = $items.length;

            // Inits index when opening popup
            if (popup.currentIndex === undefined) {
                popup.currentIndex = $items.index($current);
            }

            // Animate the next item
            $('.'+popup.o.contentClass)
                .animate({opacity: 0}, 'fast', function() {
                    var choice = $(e.target).attr('href');
                    var newIndex = undefined;

                    if (choice === 'popup_next') {newIndex = popup.currentIndex + 1}
                    else if (choice === 'popup_prev') {newIndex = popup.currentIndex - 1}

                    // Cycles items in gallery
                    if      (newIndex >= numItems) { newIndex = 0; }
                    else if (newIndex < 0)        { newIndex = numItems - 1; }
                    popup.currentIndex = newIndex;

                    // Opens the next item
                    $current = $($items[popup.currentIndex]);
                    popup.open($current.attr('href'), undefined, $current[0]);
                });
        });
    }

}; // AppMaster


$(document).ready(function() {

    appMaster.smoothScroll();

    appMaster.reviewsCarousel();

    appMaster.screensCarousel();

    appMaster.animateScript();

    appMaster.revSlider();

    appMaster.scrollMenu();

    appMaster
        .popUp('.popup_ig_gallery', {
            "url": "data/ig_info.json",
        });

});
