define ['jquery', 'underscore'], ($, _)->


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

    $.fn.center = (parent) ->
        if parent
            parent = @parent()
        else
            parent = window

        @css
            position: "fixed"
            top: ((($(parent).height() - @outerHeight()) / 2) + $(parent).scrollTop() + "px")
            left: ((($(parent).width() - @outerWidth()) / 2) + $(parent).scrollLeft() + "px")

        $(window).on 'scroll',=>
            console.log @
            @css
              top: ((($(parent).height() - @outerHeight()) / 2) + $(parent).scrollTop() + "px")

        this


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


    $(window).scroll ()->
        if ($(@).scrollTop() > 100)
            $('.scrollup').fadeIn();
        else
            $('.scrollup').fadeOut();

