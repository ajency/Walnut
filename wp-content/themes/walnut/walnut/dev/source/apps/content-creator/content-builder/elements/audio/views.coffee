define ['app'], (App)->

    # Row views
    App.module 'ContentCreator.ContentBuilder.Element.Audio.Views',
    (Views, App, Backbone, Marionette, $, _)->


        # Menu item view
        class Views.AudioView extends Marionette.ItemView

            className : 'audio'

            template : '{{#audio}}
                        <audio title="{{title}}" class="audio1" controls>
                            <source src="{{audioUrl}}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                        {{/audio}}
                        {{#placeholder}}
                        <div class="audio-placeholder"><span class="bicon icon-uniF100"></span>Upload Audio</div>
                        {{/placeholder}}'


            # override serializeData to set holder property for the view
            mixinTemplateHelpers : (data)->
                data = super data

                if not @model.get('audio_ids').length
                    data.placeholder = true
                else
#                    arrayz = ['http://html.cerchez.com/rockstar/tmp/preview1.mp3',
#                              'http://html.cerchez.com/rockstar/tmp/preview2.mp3']
#                    @model.set('audioUrls', arrayz)
                    arrays = _.zip @model.get('title'), @model.get('audioUrls')
                    audioArray = new Array()
                    _.each arrays, (array)->
                        audioArray.push _.object ['title', 'audioUrl'], array
                    data.audio = audioArray

                data

            events :
                'click' : (e)->
                    e.stopPropagation()
                    @trigger "show:media:manager"

                'click .panzerlist .controls' : '_stopPropagating'

                'click .panzerlist .list' : '_stopPropagating'

            _stopPropagating : (e)->
                e.stopPropagation()

            onShow : ->
                @$el.find('audio.audio1').panzerlist
                    theme : 'light'
                    layout : 'big'
                    expanded : true
                    showduration : true
                    show_prev_next : true







