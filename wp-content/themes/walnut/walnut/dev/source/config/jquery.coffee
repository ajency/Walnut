define ['jquery', 'underscore'], ($, _)->

    $( document ).on  "click", '.grid .tools .collapse, .grid .tools .expand, .grid-body-toggle', (e)->

        el = $(e.target).parents(".grid").children(".grid-body");
        el.slideToggle(200);

        icon = $(e.target).parents(".grid").find(".tools a");

        if ($(icon).hasClass("collapse")) 
            $(icon).removeClass("collapse").addClass("expand");

        else
            $(icon).removeClass("expand").addClass("collapse");
    
    $( document ).on "click", '.goto-prev-page', ->
        window.history.back()        

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

    $.showHeaderAndLeftNav = ->
        if _.isEmpty App.headerRegion.$el 
            App.execute "show:headerapp", region : App.headerRegion

        if _.isEmpty App.leftNavRegion.$el 
            App.execute "show:leftnavapp", region : App.leftNavRegion

        $('.page-content').removeClass 'expand-page'

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

    ##
    # --SELECT ALL CHECKBOX FUNCTIONS START--
    # select/ unselect all checkboxes in a table/div
    # element = DOM element that holds all the checkboxes eg. @$el.find('#take-class-modules')
    # exclude = array of checkbox ids to be excluded from selection
    $.toggleCheckAll = (element,exclude=[])->

        if element.find '#check_all'
        .is ':checked'
            checkboxes= element.find '.tab_checkbox'
            for checkbox in checkboxes
                if parseInt(checkbox.value) not in exclude
                    $(checkbox).trigger 'click'
                    .prop 'checked', true

        else
            element.find '.tab_checkbox'
            .removeAttr 'checked'

    # get all checked values in a table/div
    # element = DOM element that holds all the checkboxes eg. @$el.find('#take-class-modules')
    $.getCheckedItems = (element)->

        items= _.chain element.find('.tab_checkbox')
                    .map (checkbox)->
                        if $(checkbox).is ':checked'
                            $(checkbox).val()
                    .compact()
                    .value()

        items

    # --SELECT ALL CHECKBOX FUNCTIONS END --

    $.allowRoute = (route)->
        # return true

        user= App.request "get:user:model"

        if route in ['textbooks','content-pieces','add-module',
            'edit-module', 'view-module','module-list','dummy-module',
            'view-quiz', 'create-quiz', 'edit-quiz', 'quiz-list', 'dummy-quiz',
            'quiz-report','dashboard'
        ]
            if user.get 'ID'
                return true 
            else
                App.navigate "login", true
                return false

        else
            switch route
                when 'login'
                    return true if not user.get 'ID'

                when 'admin/view-all-modules'
                    return true if user.current_user_can('administrator') or user.current_user_can('school-admin')





