define ['app'
        'apps/content-preview/content-board/element/controller'
        'apps/content-preview/content-board/elements/audio/views'
        ],(App, Element)->
            App.module 'ContentPreview.ContentBoard.Element.Audio',
            (Audio, App, Backbone, Marionette, $, _)->

                # menu controller
                class Audio.Controller extends Element.Controller

                    # intializer
                    initialize: (options)->

                        super(options)

                    bindEvents: ->
                        super()


                    _getAudioView: ->
                        new Audio.Views.AudioView
                            model: @layout.model


                    # setup templates for the element
                    renderElement: =>

                        view = @_getAudioView()


                        @layout.elementRegion.show view
