define ['app'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/elements/video/view'
],(App,Element)->

    App.module 'ContentPreview.ContentBoard.Element.Video',
    (Video, App, Backbone, Marionette, $, _)->

        # menu controller
        class Video.Controller extends Element.Controller

            # intializer
            initialize:(options)->
                super(options)

            bindEvents:->
                super()


            _getVideoView:(videoModel)->
                new Video.Views.VideoView
                                model : @layout.model

            _getVideoCollection: ->
                if not @videoCollection
                    if @layout.model.get('video_ids').length
                      @videoCollection = App.request "get:media:collection:by:ids", @layout.model.get 'video_ids'
                    else
                      @videoCollection = App.request "get:empty:media:collection"

                @videoCollection.comparator = 'order'


                @videoCollection

            _parseInt:->
                video_ids = new Array()
                _.each @layout.model.get('video_ids'),(id)->
                    video_ids.push parseInt id

                @layout.model.set 'video_ids',video_ids



            # setup templates for the element
            renderElement:()=>

                # get logo attachment
#                        videoModel = App.request "get:media:by:id",@layout.model.get 'video_id'
#
                @_parseInt()

                videoCollection = @_getVideoCollection()

                App.execute "when:fetched", videoCollection, =>

                    view = @_getVideoView()

                    @layout.elementRegion.show view
