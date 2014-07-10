define ['app'
        'controllers/region-controller'
        'apps/content-preview/dialogs/comment-dialog/comment-dialog-views'
],(App,RegionController)->
    App.module 'ContentPreview.Dialogs.CommentDialog', (CommentDialog,App)->

        class CommentDialog.Controller extends RegionController

            initialize : (options)->
                comment = options.comment

                @view = @_getCommentView(comment)

                @listenTo @view, 'close:comment:dialog',->
                    @region.closeDialog()

                @show @view

            _getCommentView : (comment)->
                new CommentDialog.Views.CommentView
                    comment : comment





        App.commands.setHandler 'show:comment:dialog',(options)->

            new CommentDialog.Controller
                region : App.dialogRegion
                comment : options.comment