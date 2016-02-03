var appMaster = {
    fetchIGs: function(data){
      this.igList = [];
      for(var i=0; i<data.feed.entry.length; i++)
       {
           this.igList[i] = {
             'name' : data.feed.entry[i]['gsx$igname']['$t'],
             'description' : data.feed.entry[i]['gsx$description']['$t'],
             'timeslot' : data.feed.entry[i]['gsx$weeklytimeslots']['$t'],
             'photo' : data.feed.entry[i]['gsx$igphotourl']['$t'],
             'type' : data.feed.entry[i]['gsx$igtype']['$t']
          };

          var content = document.querySelector('template').content;
          var type = content.querySelector('.typeFilter');
          type.className = 'typeFilter ' + this.igList[i].type;

          var bkgImage = content.querySelector('.ig-image');
          bkgImage.className = 'clickabe ig-image ig' + i;
          if(this.igList[i].photo != '')
            bkgImage.src = this.igList[i].photo;

          var igName = content.querySelector('.ig-name');
          igName.textContent = this.igList[i].name;

          document.querySelector('.ig-list').insertBefore(
              document.importNode(content, true),document.querySelector('.contentBeforeThis'));

          (function(name, photo, desc) {
             $('.ig'+i).click(function(){
                 $("#igDetailsName").text(name);
                 $("#igDetailsImage").attr("src",photo);
                 $("#igDetailsText").text(desc);
                 $("#myModal").modal();
             });
           })(this.igList[i].name, this.igList[i].photo, this.igList[i].description);

       }
       $('.contentBeforeThis').remove();
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
        $(".igJam").click(function(){
                $("#igDetailsName").text("PB & Jam");
                $("#igDetailsImage").attr("src","img/ig_jam.jpg");
                $("#igDetailsText").text("HELLOO");
                $("#myModal").modal();
            });
            $(".igOrcasays").click(function(){
                $("#igDetailsName").text("Orca Says");
                $("#igDetailsImage").attr("src","img/ig_write.jpg");
                $("#igDetailsText").text("Orca Says is a student-run multimedia publication by NUS Residential College 4. From coverage of the fast lives of residents to stimulating think pieces by residents, Orca Says is by the residents, for the residents (and everyone else).");
                $("#myModal").modal();
            });
            $(".igBaking").click(function(){
                $("#igDetailsName").text("Baking Club");
                $("#igDetailsImage").attr("src","img/ig_bake.jpg");
                $("#igDetailsText").text("Do you like muffins, cookies or just love to eat? Join baking club to learn and hone your baking skills. Savour your finished product with your friends and neighbours!");
                $("#myModal").modal();
            });
            $(".igShake").click(function(){
                $("#igDetailsName").text("Shake It Off");
                $("#igDetailsImage").attr("src","img/ig_sports.jpg");
                $("#igDetailsText").text("Whether you're new to exercise or a fitness veteran, workouts are hard work. Make hard work fun together with other residents. Work out that muscle you never knew you had.");
                $("#myModal").modal();
            });
            $(".igTheatre").click(function(){
                $("#igDetailsName").text("Theatre Club");
                $("#igDetailsImage").attr("src","img/ig_theatre.jpg");
                $("#igDetailsText").text("Theatre a collaborative form of fine art. Express yourself through stage play and screen play. Seek out like minded residents to perform a play on your very own stage!");
                $("#myModal").modal();
            });

    }

}; // AppMaster


$(document).ready(function() {

    appMaster.smoothScroll();

    appMaster.reviewsCarousel();

    appMaster.animateScript();

    appMaster.revSlider();

    appMaster.scrollMenu();

    appMaster.igLinkModals();

});
