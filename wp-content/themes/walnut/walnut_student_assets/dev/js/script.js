

// ---------------------------
// SITE SCRIPTS -----------
// ---------------------------



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
    /*commented  by kapil
    $('#carousel-example-generic1').carousel({
        pause: true,
        interval: false, //stop cycling
        wrap: false //stop from looping
    });
    */


    //Progress Loader Trigger
    //  NProgress.start();
    // setTimeout(function() { NProgress.done(); }, 1000);



    // Ripple Effect
    //$('.fab-content').ripple();


    //Settings button toggle and effect

    $('.log-session.fab-header').click(function(){

        $(this).toggleClass('setting-bg');

    });


    // Settings Button effect

    $(window).load(function() {
        var buttonCircles = $(".nav-circle");
        $(".btn-nav").on("tap click", function(e) {
            e.preventDefault();
            $(this).toggleClass('setting-bg');
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

    //window.scrollReveal = new scrollReveal();


    //Notification popover

    // $('.notification').popover();
    
    // $('.notification').on('shown.bs.popover', function() {
    //     setTimeout(function() {
    //         $('.notification').popover('hide');
    //     }, 5000);
    // });

    //if clicked outside hide popover

    // $('body').on('click', function (e) {
    //     $('[data-toggle=popover]').each(function () {
    //         // hide any open popovers when the anywhere else in the body is clicked
    //         if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
    //             $(this).popover('hide');
    //         }
    //     });
    // });



    //Adding popover a custom class

    // var notify= $('.notification');

    // if (notify.length)
    // {
    // $('.notification').popover({
    //     placement: 'left',
    //     trigger: 'click'
    // }).data('bs.popover').tip().addClass('dashboard-popover animated shake');

    // }


    //Popover onclick for notification
        
    $('.notification').click(function(){

    $(this).toggleClass('generate-popover').removeClass('destroy-popover').parent().parent().siblings().children().find('.notification').toggleClass('destroy-popover').removeClass('generate-popover');

     });

    //Removing popover when click outside

    $(document).mouseup(function (e)
    {
        var element = $(".notification");

        if (!element.is(e.target) // if the target of the click isn't the container...
            && element.has(e.target).length === 0) // ... nor a descendant of the container
        {
           
            $(element).removeClass('generate-popover destroy-popover');
        }
    });



    //Orientation check if portrait or landscape

    $(window).bind("orientationchange", function(){
       
    if(window.innerHeight > window.innerWidth){
         $('body').css({
            "display": "block"
        });
    }
    else
    {
         $('body').css({
            "display": "none"
        });
         alert('Please Load in Landscape mode to view this site!');
    }

    });

    if(window.innerHeight > window.innerWidth){
        $('body').css({
            "display": "none"
        });
        alert("Please Load in Landscape mode to view this site!");
    }



});
