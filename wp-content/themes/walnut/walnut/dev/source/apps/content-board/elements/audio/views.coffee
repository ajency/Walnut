define ['app'], (App)->

    # Row views
    App.module 'ContentPreview.ContentBoard.Element.Audio.Views',
    (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.AudioView extends Marionette.ItemView

            className: 'audio'

            template: '{{#audio}}
                        <audio title="{{title}}" class="audio1" controls autoplay>
                            <source src="{{audioUrl}}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                        {{/audio}}'



            # override serializeData to set holder property for the view
            mixinTemplateHelpers: (data)->
                data = super data
                @model.set 'autoplay': _.toBool @model.get 'autoplay'
                if @model.get('audio_ids').length
#                    arrayz = ['http://html.cerchez.com/rockstar/tmp/preview1.mp3',
#                              'http://html.cerchez.com/rockstar/tmp/preview2.mp3']
#                    @model.set('audioUrls', arrayz)
                    arrays = _.zip @model.get('title'), @model.get('audioUrls')
                    audioArray = new Array()
                    _.each arrays, (array)->
                        audioArray.push _.object ['title', 'audioUrl'], array
                    data.audio = audioArray

                data



            onShow: ->
                @$el.find('audio').panzerlist
                    theme          : 'light'
                    layout         : 'big'
                    expanded       : true
                    showduration   : true
                    show_prev_next : true
                    auto_start     : @model.get 'autoplay'

#
