define ['marionette'], (Marionette) ->
    class Marionette.Region.Settings extends Marionette.Region



        #initiate modal on show
        onShow: (view)->
            $(window).on 'click', @_closeViewWhenClickedOutside
            @$el.draggable()

        onClose: ->
            @$el.draggable 'destroy'
            $(window).off 'click', @_closeViewWhenClickedOutside


        _closeViewWhenClickedOutside: =>
            @close()


