define ['app'], (App)->

    # Row views
    App.module 'ContentCreator.ContentBuilder.Element.Audio.Views',
    (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.AudioView extends Marionette.ItemView

            className: 'audio'

            template: '{{#audio}}
                        <audio controls>
                            <source src="{{audioUrl}}" type="audio/ogg">
                            Your browser does not support the audio element.
                        </audio>
                        {{/audio}}
                        {{#placeholder}}
                        <div class="image-placeholder"><span class="bicon icon-uniF10E"></span>Upload Audio</div>
                        {{/placeholder}}'


            # override serializeData to set holder property for the view
            mixinTemplateHelpers: (data)->
                data = super data
                data.audio = true

                data

            events:
                'click': (e)->
                    e.stopPropagation()



            onShow: ->
                @$el.find('audio').panzer
                    layout: 'big'
                    expanded: true
                    showduration: true







