define ['app'], (App)->
    App.module 'ContentPreview.Dialogs.HintDialog.Views', (Views, App)->
        class Views.HintView extends Marionette.ItemView


            template : '<div>
                            <span id="hintText"></span>
                                     </div>
                        <div class="clearfix">
                          <button class="btn btn-primary hint-close">Close</button>
                        </div>'

            dialogOptions :
                modal_title : 'Hint'

            events :
                'click .hint-close' : '_closeHint'

            onShow : ->
                hint = Marionette.getOption @, 'hint'
                @$el.find('#hintText').text hint

            _closeHint : ->
                @trigger 'close:hint:dialog'
