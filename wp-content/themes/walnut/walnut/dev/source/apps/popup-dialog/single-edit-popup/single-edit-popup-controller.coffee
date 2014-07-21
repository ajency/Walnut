define ['app'
        'controllers/region-controller'
        'apps/popup-dialog/single-edit-popup/single-edit-popup-view'
],(App,RegionController)->
    App.module 'SingleEditPopup', (SingleEditPopup,App)->

        class SingleEditPopup.Controller extends RegionController

            initialize : (options)->
                @textArray = options.textArray
                @title = options.title

                @view = @_getHintView(options)

                @listenTo @view, 'close:popup',(opt)->
                    @textArray[@title] = opt.text

                    @region.closeDialog()

                @show @view

            _getHintView : ->
                new SingleEditPopup.Views.SingleEditView
                    text : @textArray[@title] #@message[@title]
                    title : _.humanize @title

        App.commands.setHandler 'show:single:edit:popup',(options)->

            new SingleEditPopup.Controller
                region : App.dialogRegion
                textArray : options.textArray
                title : options.title