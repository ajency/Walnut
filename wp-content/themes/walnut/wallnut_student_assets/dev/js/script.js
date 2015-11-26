$(function() {
    // Chapters selection
    // Onclick of filters icon rotate
    $('.panel-title a').click(function() {
        // single click row
        $(this).find('.drop-icon i').toggleClass('is-open');
    });
    $('.tick .panel-body').click(function() {
        $(this).find('.checked').toggleClass('is-checked').parent().siblings().find('.checked').removeClass('is-checked');
    });
    //Transition Dashboard Effect
    var ripple_wrap = $('.ripple-wrap'),
        rippler = $('.ripple'),
        finish = false,
        monitor = function(el) {
            var computed = window.getComputedStyle(el, null),
                borderwidth = parseFloat(computed.getPropertyValue('border-left-width'));
            if (!finish && borderwidth >= 1500) {
                el.style.WebkitAnimationPlayState = "paused";
                el.style.animationPlayState = "paused";
                swapContent();
            }
            if (finish) {
                el.style.WebkitAnimationPlayState = "running";
                el.style.animationPlayState = "running";
                return;
            } else {
                window.requestAnimationFrame(function() {
                    monitor(el)
                });
            }
        };
    storedcontent = $('#content-2').html();
    $('#content-2').remove();
    rippler.bind("webkitAnimationEnd oAnimationEnd msAnimationEnd mozAnimationEnd animationend", function(e) {
        ripple_wrap.removeClass('goripple');
    });
    // $('body').on('click', 'a', function(e) {
    $('.wrap').on('click', '.next-page', function(e) {
        rippler.css('left', e.clientX + 'px');
        rippler.css('top', e.clientY + 'px');
        e.preventDefault();
        finish = false;
        ripple_wrap.addClass('goripple');
        window.requestAnimationFrame(function() {
            monitor(rippler[0])
        });
    });

    function swapContent() {
        var newcontent = $('#content-area').html();
        $('#content-area').html(storedcontent);
        storedcontent = newcontent;
        // do some Ajax, put it in the DOM and then set this to true
        setTimeout(function() {
            finish = true;
        }, 10);
    }
    //Practice quiz radio buttons and carousel settings
    $('label').click(function() {
        // find the first span which is our circle/bubble
        var el = $(this).children('span:first-child');
        // add the bubble class (we do this so it doesnt show on page load)
        el.addClass('circle');
        // clone it
        var newone = el.clone(true);
        // add the cloned version before our original
        el.before(newone);
        // remove the original so that it is ready to run on next click
        el.remove();
    });
    //Carousel options for practice quiz
    $('#carousel-example-generic1').carousel({
        pause: true,
        interval: false, //stop cycling
        wrap: false //stop from looping
    });
    //Loader Trigger
    //  NProgress.start();
    // setTimeout(function() { NProgress.done(); }, 1000);
    // Ripple Effect
    //$('.fab-content').ripple();
    //Settings button toggle and effect
    $(window).load(function() {
        var buttonCircles = $(".nav-circle");
        $(".btn-nav").on("tap click", function(e) {
            e.preventDefault();
            $(this).toggleClass("closed-nav")
            if ($(this).hasClass("closed-nav")) {
                slideDown();
            } else {
                slideUp()
            }
        });
        $(".round-circle").click(function() {
            $(".btn-nav").toggleClass("closed-nav");
            slideUp();
        })

        function slideDown() {
            var topMargin = 20
            for (i = 0; i < buttonCircles.length; i++) {
                topMargin += 70
                $(buttonCircles[i]).animate({
                    top: topMargin
                }, function() {
                    $(".circle-container, .round-circle").css("visibility", "visible");
                    if ($(".fa-cog").hasClass("unRotateIcon")) {
                        $(".fa-cog").removeClass("unRotateIcon").addClass("rotateIcon");
                    } else {
                        $(".fa-cog").addClass("rotateIcon");
                    }
                })
            }
        }

        function slideUp() {
            var resetTop = 20
            for (i = 0; i < buttonCircles.length; i++) {
                $(buttonCircles[i]).animate({
                    top: resetTop
                }, 400, function() {
                    $(".circle-container, .round-circle").css("visibility", "hidden");
                    if ($(".fa-cog").hasClass("rotateIcon")) {
                        $(".fa-cog").removeClass("rotateIcon").addClass("unRotateIcon");
                    } else {
                        $(".fa-cog").addClass("unRotateIcon");
                    }
                })
            }
        }
    });
    //Input focus material type
    $(".mat-input").focus(function() {
        $(this).parent().addClass("is-active is-completed");
    });
    $(".mat-input").focusout(function() {
        if ($(this).val() === "") $(this).parent().removeClass("is-completed");
        $(this).parent().removeClass("is-active");
    });

     $( ".mat-input" ).each(function( index ) {
        if($(this).val()!==""){

            $( this ).parent().addClass("is-active is-completed");
        }
    });

    //Grid load effect onload
     window.scrollReveal = new scrollReveal();
});