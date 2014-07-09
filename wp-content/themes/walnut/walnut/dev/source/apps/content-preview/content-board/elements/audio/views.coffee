define ['app'], (App)->

    # Row views
    App.module 'ContentPreview.ContentBoard.Element.Audio.Views',
    (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.AudioView extends Marionette.ItemView

            className: 'audio'

            template: '
                            <audio controls>
                                <source src="{{audioUrl}}" type="audio/ogg">
                                Your browser does not support the audio element.
                            </audio>'



            # override serializeData to set holder property for the view
            mixinTemplateHelpers: (data)->
                data = super data
                #if _.platform() is 'DEVICE' then the source of audio is taken from the localpath of device
                if _.platform() is 'DEVICE'
                    audioPath = data.audioUrl.substr(data.audioUrl.indexOf("uploads/"))
                    audioPath = audioPath.replace("media-web/audio-web", "audios")
                    localAudioPath = _.getSynapseMediaDirectoryPath() + audioPath
                    data.audioUrl = localAudioPath

                data

            events:
                'click': (e)->
                    e.stopPropagation()

            onShow: ->
                @$el.find('audio').panzer
                    theme: 'light'
                    layout: 'big'
                    expanded: true
                    showduration: true







