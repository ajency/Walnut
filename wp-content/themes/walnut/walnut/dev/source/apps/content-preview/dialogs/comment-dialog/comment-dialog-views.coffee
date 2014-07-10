define ['app'], (App)->
    App.module 'ContentPreview.Dialogs.CommentDialog.Views', (Views, App)->
        class Views.CommentView extends Marionette.ItemView


            template : '<div>
                                        <span id="commentText"></span>
                                                 </div>
                                    <div class="clearfix">
                                      <button class="btn btn-primary comment-close">Close</button>
                                    </div>'

            dialogOptions :
                modal_title : 'Comment'

            events :
                'click .comment-close' : '_closeComment'

            onShow : ->
                comment = Marionette.getOption @, 'comment'
                @$el.find('#commentText').text comment

            _closeComment : ->
                @trigger 'close:comment:dialog'
