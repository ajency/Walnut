define ['app'
        'apps/content-creator/content-builder/element/controller'
        'apps/content-creator/content-builder/elements/audio/views'
], (App, Element)->
    App.module 'ContentCreator.ContentBuilder.Element.Audio',
    (Audio, App, Backbone, Marionette, $, _)->

        # menu controller
        class Audio.Controller extends Element.Controller

            # intializer
            initialize: (options)->
                _.defaults options.modelData,
                    element: 'Audio'
                    audio_id: 0
                    height: 0
                    width: 0
                    audioUrl:''# 'http://www.jplayer.org/audio/ogg/Miaow-04-Lismore.ogg'


                super(options)

            bindEvents: ->
                super()


            _getAudioView: ->
                new Audio.Views.AudioView
                    model: @layout.model


            # setup templates for the element
            renderElement: =>
                @removeSpinner()
                # get logo attachment
                # imageModel = App.request "get:media:by:id",@layout.model.get 'image_id'


                view =@view = @_getAudioView()


                #                App.commands.setHandler "audio:moved",->
                #                    view.triggerMethod "audio:moved"


                @layout.elementRegion.show view

                audioModel = App.request "get:media:by:id", @layout.model.get 'audio_id'
                App.execute "when:fetched", audioModel, =>
                    view = @view = @_getAudioView audioModel

                    #trigger media manager popup and start listening to "media:manager:choosed:media" event
                    @listenTo view, "show:media:manager", =>
                        App.execute "show:media:manager:app",
                            region: App.dialogRegion
                            mediaType: 'audio'

                        @listenTo App.vent, "media:manager:choosed:media", (media)=>
                            @layout.model.set
                                'audio_id': media.get 'id'
                                'audioUrl': media.get 'url'
                            @layout.model.save()
                            @layout.elementRegion.show @view
                            @stopListening App.vent, "media:manager:choosed:media"

                        @listenTo App.vent, "stop:listening:to:media:manager", =>
                            @stopListening App.vent, "media:manager:choosed:media"

                    @layout.elementRegion.show @view
