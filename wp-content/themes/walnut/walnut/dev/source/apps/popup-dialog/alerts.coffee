define ['app'
        'controllers/region-controller'
],(App,RegionController)->
    App.module 'AlertBox', (AlertBox,App)->

        class AlertBox.Controller extends RegionController

            initialize : (options)->
                #message_type is a identifier to know what the message for listeners
                #alert_type may be alert or confirm
                #alert_type: alert is a normal alert with text and an OK button
                #alert_type: confirm is a confirm alert box with yes/no buttons. on click of yes an event is triggered

                {@message_content,@message_type,@alert_type} = options

                @view = @_getAlertBoxView()

                @listenTo @view, 'close:popup:dialog',->
                    @region.closeDialog()


                @listenTo @view, 'confirm:yes', => @region.trigger "clicked:confirm:yes", @message_type
                @listenTo @view, 'alert:ok', => @region.trigger "clicked:alert:ok", @message_type

                @show @view

            _getAlertBoxView :=>
                new AlertBoxView
                    message_content : @message_content
                    alert_type: @alert_type


        class AlertBoxView extends Marionette.ItemView

            template : '{{message_content}}
                        <div class="clearfix">
                            {{#confirm}}
                            <button class="btn btn-primary comment-close">No</button>
                            <button id="confirm-yes" class="btn btn-info comment-close m-r-10">Yes</button>
                            {{/confirm}}
                            {{#alert}}
                            <button id="alert-ok" class="btn btn-info comment-close m-r-10">Ok</button>
                            {{/alert}}
                        </div>'

            events :
                'click #confirm-yes'    :-> @trigger 'confirm:yes'
                'click #alert-ok'    :-> @trigger 'alert:ok'
                'click .comment-close'  : '_closeComment'

            mixinTemplateHelpers :(data) ->
                message_content = Marionette.getOption @, 'message_content'
                alert_type = Marionette.getOption @, 'alert_type'

                data.message_content=message_content
                data.alert=true if alert_type is 'alert'
                data.confirm=true if alert_type is 'confirm'

                data

            onShow:->
                @$el.closest '.modal-dialog'
                .find '.modal-header h4'
                .html _.humanize Marionette.getOption @, 'alert_type'

            _closeComment : ->
                @trigger 'close:popup:dialog'




        App.commands.setHandler 'show:alert:popup',(options)->

            new AlertBox.Controller options
