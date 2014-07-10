define ['app'
        'controllers/region-controller'
        'apps/content-preview/dialogs/hint-dialog/hint-dialog-views'
],(App,RegionController)->
    App.module 'ContentPreview.Dialogs.HintDialog', (HintDialog,App)->

        class HintDialog.Controller extends RegionController

            initialize : (options)->
                hint = options.hint

                @view = @_getHintView(hint)

                @listenTo @view, 'close:hint:dialog',->
                    @region.closeDialog()

                @show @view

            _getHintView : (hint)->
                new HintDialog.Views.HintView
                    hint : hint





        App.commands.setHandler 'show:hint:dialog',(options)->

            new HintDialog.Controller
                region : App.dialogRegion
                hint : options.hint