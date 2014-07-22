define ['app'
        'controllers/region-controller'
        'apps/media-collection-manager/media-list/media-list-controller'
],(App,RegionController)->
    App.module 'MediaCollectionManager',(MediaCollectionManager,App)->

        class MediaCollectionManager.Controller extends RegionController

            initialize : (options = {})->

                {@mediaType,@mediaCollection} = options

                @layout = @_getLayout()

                @listenTo @layout, "show:add:new:media", =>
                    App.execute "show:media:manager:app",
                        region: @layout.addMediaRegion
                        mediaType : @mediaType

                    @listenTo App.vent, "media:manager:choosed:media", (media)=>
#                        @layout.model.set
#                            'video_id': media.get 'id'
#                            'videoUrl': media.get 'url'
#                        @layout.model.save()
#                        @layout.elementRegion.show @view
                        @mediaCollection.add media
                        @stopListening App.vent, "media:manager:choosed:media"
                        @layout.addMediaRegion.close()
                        @layout.triggerMethod "show:add:media"

                    @listenTo App.vent, "stop:listening:to:media:manager", =>
                        @stopListening App.vent, "media:manager:choosed:media"

                @listenTo @layout.mediaListRegion, "show:order:updated:msg", ->
                    @layout.triggerMethod "show:order:updated:msg"
                    Marionette.triggerMethod.call @mediaCollection,'order:updated'

                @listenTo @layout, 'show',=>
                    App.execute 'show:media:list',
                        region : @layout.mediaListRegion
                        mediaCollection : @mediaCollection


                @show @layout

            _getLayout : ->
                new OuterLayout


        class OuterLayout extends Marionette.Layout
            template : '<div class="row">
                        <div class="col-sm-7">
                            <div id="media-list-region"></div>
                        </div>
                        <div class="col-sm-5">
                            <div id="slides-info">
                                Click the button to select images to add to your slider. You can change the order of the images by dragging them up or down in the list to the left.
                            </div>
                            <div class="aj-imp-block-button add-new-media">
                                <button class="btn btn-default btn-hg"><span class="bicon icon-uniF10C"></span>&nbsp;&nbsp;Add Media</button>
                            </div>
                        </div>
                        </div>
                        <div id="add-media-region"></div>'

            regions:
                mediaListRegion: '#media-list-region'
                addMediaRegion: '#add-media-region'


            events:
                'click .add-new-media': ->
                    @$el.find('.add-new-media').hide()
                    @trigger "show:add:new:media"

            dialogOptions:
                modal_title: 'Media Collection Manager'
                modal_size: 'wide-modal'

            onShowAddMedia :->
                @$el.find('.add-new-media').show()

            # show order updated message
            onShowOrderUpdatedMsg: ->

                # remove previous alert message
                @$el.find('.alert').remove()

                @$el.prepend "<div class=\"alert alert-success\">Updated successfully</div>"


        App.commands.setHandler 'show:media:collection:manager',(options)->
            new MediaCollectionManager.Controller options