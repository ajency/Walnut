define ['app'], (App)->
    App.module 'SingleEditPopup.Views', (Views, App)->
        class Views.SingleEditView extends Marionette.ItemView


            template : '
                        <div class="row form-row">
                        <div class="col-md-12">
                          <input id="hintText" type="text" class="form-control" placeholder="Enter your message for {{title}}">
                        </div>
                      </div>
                                    <div class="clearfix">
                        <button type="button" class="btn btn-success hint-close">Save changes</button>
                        </div>'

            mixinTemplateHelpers : (data)->
                data = super data
                data.title = Marionette.getOption @, 'title'
                data

            events :
                'click .hint-close' : '_closeHint'
                'blur #hintText' : '_saveText'

            initialize : (options)->
                @text = options.text
                @dialogOptions =
                    modal_title : Marionette.getOption @, 'title'

            onShow : ->

                @$el.find('#hintText').val @text

            _saveText : (e)->
                @text = $(e.target).val()
                console.log @text

            _closeHint : ->
                @trigger 'close:popup',
                    text  : @text
