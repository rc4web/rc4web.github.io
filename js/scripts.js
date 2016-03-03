var appMaster = {
    fetchIGs: function(data){
      appMaster.igList = [];
      for(var i=0; i<data.feed.entry.length; i++)
       {
           appMaster.igList[i] = {
             'name' : data.feed.entry[i]['gsx$igname']['$t'],
             'description' : data.feed.entry[i]['gsx$description']['$t'],
             'timeslot' : data.feed.entry[i]['gsx$weeklytimeslots']['$t'],
             'photo' : data.feed.entry[i]['gsx$igphotourl']['$t'],
             'type' : data.feed.entry[i]['gsx$igtype']['$t']
          };

          //Quick Fix: Needs Refactoring
          if(appMaster.igList[i].type == 'Sports')
            appMaster.igList[i].type = 'three';
          else if(appMaster.igList[i].type == 'Others')
            appMaster.igList[i].type = 'one';
          else if(appMaster.igList[i].type == 'Performing Arts')
            appMaster.igList[i].type = 'two';

          var content = document.querySelector('template').content;
          var type = content.querySelector('.typeFilter');
          type.className = 'typeFilter ' + appMaster.igList[i].type;

          var bkgImage = content.querySelector('.ig-image');
          bkgImage.className = 'clickabe ig-image ig' + i;
          if(appMaster.igList[i].photo != '')
            bkgImage.src = appMaster.igList[i].photo;

          var igName = content.querySelector('.ig-name');
          igName.textContent = appMaster.igList[i].name;

          document.querySelector('.ig-list').insertBefore(
              document.importNode(content, true),document.querySelector('.contentBeforeThis'));

       }
       $('.contentBeforeThis').remove();
       appMaster.igLinkModals();
       appMaster.screensCarousel();


    },

    preLoader: function(){
        imageSources = []
        $('img').each(function() {
            var sources = $(this).attr('src');
            imageSources.push(sources);
        });

        $.ajax({
            url: 'https://spreadsheets.google.com/feeds/list/1x6AIK5gzAghtu2SXc2D0qq6M-UHKpPuX2ykrZwVQNZg/1/public/values?alt=json',
            dataType: "json",
            success: this.fetchIGs
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
            appMaster.igLinkModals();
        });

        $('.js-filter-one').on('click', function() {
            $('.filtering').slickFilter('.one');
            $('.filter a').removeClass('active');
            $(this).addClass('active');
            appMaster.igLinkModals();
        });

        $('.js-filter-two').on('click', function() {
            $('.filtering').slickFilter('.two');
            $('.filter a').removeClass('active');
            $(this).addClass('active');
            appMaster.igLinkModals();
        });

        $('.js-filter-three').on('click', function() {
            $('.filtering').slickFilter('.three');
            $('.filter a').removeClass('active');
            $(this).addClass('active');
            appMaster.igLinkModals();
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


    igLinkModals: function() {
        for(var i = 0; i<appMaster.igList.length; i++) {
          (function(name, photo, desc) {
             $('.ig'+i).click(function(){
                 $("#igDetailsName").text(name);
                 $("#igDetailsImage").attr("src",photo);
                 $("#igDetailsText").text(desc);
                 $("#myModal").modal();
             });
           })(appMaster.igList[i].name, appMaster.igList[i].photo, appMaster.igList[i].description);
        }
    }

}; // AppMaster


$(document).ready(function() {
    appMaster.igList = [];

    appMaster.smoothScroll();

    appMaster.reviewsCarousel();

    appMaster.animateScript();

    appMaster.revSlider();

    appMaster.scrollMenu();

    appMaster.igLinkModals();

});
