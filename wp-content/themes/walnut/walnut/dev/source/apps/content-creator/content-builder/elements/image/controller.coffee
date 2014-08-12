define ['app'
        'apps/content-creator/content-builder/element/controller'
        'apps/content-creator/content-builder/elements/image/views'
        'apps/content-creator/content-builder/elements/image/settings/controller'],
(App, Element)->
    App.module 'ContentCreator.ContentBuilder.Element.Image',
    (Image, App, Backbone, Marionette, $, _)->

        # menu controller
        class Image.Controller extends Element.Controller

            # intializer
            initialize: (options)->
                _.defaults options.modelData,
                    element: 'Image'
                    image_id: 0
                    size: 'thumbnail'
                    align: 'left'
                    heightRatio : 'auto'
                    topRatio : 0

                super(options)

            bindEvents: ->
                # start listening to model events
                @listenTo @layout.model, "change:image_id", @renderElement
#                @listenTo @layout.model, "change:size", @renderElement
#                @listenTo @layout.model, "change:align", @renderElement
                super()

            # private etmplate helper function
            # this function will get the necessary template helpers for the element
            # template helper will return an object which will later get mixed with
            # serialized data before render
            _getTemplateHelpers: ->
                size: @layout.model.get 'size'
                alignment: @layout.model.get 'align'

            _getImageView: (imageModel)->
                if @layout.model.get('heightRatio') isnt 'auto'
                    @layout.model.get 'heightRatio', parseFloat @layout.model.get 'heightRatio'
                new Image.Views.ImageView
                    model: imageModel
                    imageHeightRatio : @layout.model.get 'heightRatio'
                    positionTopRatio : parseFloat @layout.model.get 'topRatio'
                    templateHelpers: @_getTemplateHelpers()


            # setup templates for the element
            renderElement: ()=>
                @removeSpinner()
                # get logo attachment
                imageModel = App.request "get:media:by:id", @layout.model.get 'image_id'


                App.execute "when:fetched", imageModel, =>
                    view = @_getImageView imageModel

                    #trigger media manager popup and start listening to "media:manager:choosed:media" event
                    @listenTo view, "show:media:manager", (ratio = false)=>

                        App.currentImageRatio = ratio

                        App.execute "show:media:manager:app",
                            region: App.dialogRegion
                            mediaType: 'image'

                        @listenTo App.vent, "media:manager:choosed:media", (media)=>
                            @layout.model.set 'image_id', media.get 'id'
                            # @layout.model.save()
                            App.currentImageRatio = false
                            @stopListening App.vent, "media:manager:choosed:media"

                        @listenTo App.vent, "stop:listening:to:media:manager", =>
                            App.currentImageRatio = false
                            @stopListening App.vent, "media:manager:choosed:media"

                    @listenTo view, "image:size:selected", (size)=>
                        @layout.model.set 'size', size
                        @layout.model.save()

                    @listenTo view, 'set:image:height',(height,width)=>
                        @layout.model.set 'height', height
                        if height is 'auto'
                            @layout.model.set 'heightRatio','auto'
                        else
                            @layout.model.set 'heightRatio',height/width
                        @layout.model.save()

                    @listenTo view, 'set:image:top:position',(width,top)=>
                        @layout.model.set 'top',top
                        @layout.model.set 'topRatio',top/width
                        @layout.model.save()

                    @layout.elementRegion.show view
							