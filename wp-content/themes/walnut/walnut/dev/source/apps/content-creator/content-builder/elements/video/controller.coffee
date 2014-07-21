define ['app'
        'apps/content-creator/content-builder/element/controller'
        'apps/content-creator/content-builder/elements/video/views'],
(App, Element)->
    App.module 'ContentCreator.ContentBuilder.Element.Video',
    (Video, App, Backbone, Marionette, $, _)->

        # menu controller
        class Video.Controller extends Element.Controller

            # intializer
            initialize: (options)->
                _.defaults options.modelData,
                    element: 'Video'
                    video_ids: []
                    height: 0
                    width: 0
                    title : []
                    videoUrl: [] #'http://video-js.zencoder.com/oceans-clip.mp4'


                super(options)

            bindEvents: ->
                super()



            _getVideoView: ->
                new Video.Views.VideoView
                    model: @layout.model


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
                if @layout.model.get('video_id')
                    @layout.model.set 'video_ids',[@layout.model.get('video_id')]
                    @layout.model.unset('video_id')
                    @layout.model.set 'videoUrl',[@layout.model.get('videoUrl')]
                _.each @layout.model.get('video_ids'),(id)->
                    video_ids.push parseInt id

                @layout.model.set 'video_ids',video_ids



            # setup templates for the element
            renderElement: ()=>
                @removeSpinner()
                @_parseInt()
                # get logo attachment
#                videoModel = App.request "get:media:by:id", @layout.model.get 'video_id'
                viedoCollection = @_getVideoCollection()
                App.execute "when:fetched", viedoCollection, =>
                    @view = @_getVideoView()

                    #trigger media manager popup and start listening to "media:manager:choosed:media" event
                    @listenTo @view, "show:media:manager", =>

                        App.execute "show:media:collection:manager",
                            region: App.dialogRegion
                            mediaType: 'video'
                            mediaCollection : viedoCollection

                    @listenTo @videoCollection, 'add remove order:updated',->
                        @videoCollection.sort()
                        @layout.model.set
                            'video_ids': @videoCollection.pluck 'id'
                            'videoUrl' : @videoCollection.pluck 'url'
                            'title' : @videoCollection.pluck 'title'
                        @layout.elementRegion.show @view
                        @layout.model.save()



                    App.commands.setHandler "video:moved", ->
                        @view.triggerMethod "video:moved"

                    @layout.elementRegion.show @view





#                        App.execute "show:media:manager:app",
#                            region: App.dialogRegion
#                            mediaType: 'video'
#
#                        @listenTo App.vent, "media:manager:choosed:media", (media)=>
#                            @layout.model.set
#                                'video_id': media.get 'id'
#                                'videoUrl': media.get 'url'
#                            @layout.model.save()
#                            @layout.elementRegion.show @view
#                            @stopListening App.vent, "media:manager:choosed:media"
#
#                        @listenTo App.vent, "stop:listening:to:media:manager", =>
#                            @stopListening App.vent, "media:manager:choosed:media"


							