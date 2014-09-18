define ['jquery', 'underscore'], ($, _)->

    $( document ).on  "click", '.grid .tools .collapse, .grid .tools .expand', (e)->

        el = $(e.target).parents(".grid").children(".grid-body");

        if ($(e.target).hasClass("collapse")) 
            $(e.target).removeClass("collapse").addClass("expand");
            el.slideUp(200);

        else
            $(e.target).removeClass("expand").addClass("collapse");
            el.slideDown(200);
        

    # define helper functions
    $.fn.isEmptyColumn = (params = {})->
        @children('.element-wrapper').length is 0

    # check if a row is empty and can be deleted
    $.fn.canBeDeleted = ()->
        columns = @children('.column')
        empty = true
        _.each columns, (column, index)=>
            if not $(column).isEmptyColumn()
                empty = false

        empty


    # remove all attributes of the tag
    $.fn.removeAllAttr = ->
      attrs = ['class','tabindex','contenteditable','id','spellcheck','role','aria-label','title','aria-describedby','style']
      _.each @ ,(div)->
        # console.log div.attributes
        _.each attrs ,(attr)->
          $(div).removeAttr attr



    $.fn.center = (parent) ->
        if parent
            parent = @parent()
        else
            parent = window



        @css
            position: "fixed"
            top: ((($(parent).height() - @outerHeight()) / 2) + $(parent).scrollTop() + "px")
            left: ((($(parent).width() - @outerWidth()) / 2) + $(parent).scrollLeft() + "px")


        $(window).on 'scroll', =>
            @css
                top: ((($(parent).height() - @outerHeight()) / 2) + $(parent).scrollTop() + "px")

        this

    $.timeMinSecs = (timeInSeconds)->
        hours = 0
        time = timeInSeconds
        mins = parseInt timeInSeconds / 60
        if mins > 59
            hours = parseInt mins / 60
            mins = parseInt mins % 60
        seconds = parseInt time % 60
        display_time = ''

        if hours > 0
            display_time = hours + 'h '

        display_time += mins + 'm ' + seconds + 's'


    $( document ).on  "keyup", ".autogrow", (e)=>

        ele= $ e.target

        if $(ele).prop('clientHeight') < $(ele).prop('scrollHeight')
            $(ele).css 'height' : $(ele).prop('scrollHeight') + "px";

        if $(ele).prop('clientHeight') < $(ele).prop('scrollHeight')
            $(ele).css 'height' : ($(ele).prop('scrollHeight') * 2 - $(ele).prop('clientHeight')) + "px"

    #programatically select elements
    $.fn.selectSelectableElements = (elementsToSelect)->
        # remove the class ui-selected for the ones not selected
        $(".ui-selected", @).not(elementsToSelect).
        removeClass("ui-selected")
        # add ui-selected class to the elements to select
        $(elementsToSelect).not(".ui-selected").addClass("ui-selected")


    #    # scroll to top
    #    $.scrollTop = ->
    #        $('html, body').animate
    #            scrollTop: 0
    #        , 1000

    # adjust the dimesion of upper content and also the left section and right section
    # Uses jquery to get window dimensions and sets min-height css property so that if height
    # is greater it will not hide the content
    # @uses underscore's _.debounce to avoid repeated function calls on window resize
    adjustPageDim = _.debounce ()->
        height = $(window).height()

        minHeight = height - 40

        $('.aj-upper-content').css 'min-height', minHeight

        $('.aj-upper-content').children().css 'min-height', minHeight

    , 30

    #setup page initial dimesions
    $(document).ready ()->
        adjustPageDim()

    #adjust the page size and dimensions on resize
    $(window).resize adjustPageDim

    # # Setup Polyglot
    # window.pt = new Polyglot
    # 					phrases : {}

    # window.__ = (key, opt = {})->

    # 	pt.t(key, opt)


    # $(window).scroll ()->
    #     if ($(@).scrollTop() > 100)
    #         $('.scrollup').fadeIn();
    #     else
    #         $('.scrollup').fadeOut();

