define ['app'
        'controllers/region-controller'
        'apps/media-collection-manager/media-list/media-list-views'
],(App,RegionController)->
    App.module 'MediaCollectionManager.MediaList',(MediaList,App)->

        class MediaList.Controller extends RegionController

            initialize : (options)->
                {@mediaCollection,@mediaType} = options
                @view = @_getListView()

                @listenTo @view, "itemview:remove:media", (iv, media)=>
                    @mediaCollection.remove media

                @listenTo @view, "media:order:updated", (mediaIds)=>
                    _.each mediaIds, (mediaId, index)=>
                        media = @mediaCollection.get mediaId
                        media.set('order', index + 1) if media

                    @showSuccessMessage()


                @show @view

            _getListView :->
                new MediaList.Views.MediaListView
                    collection : @mediaCollection
                    mediaType : @mediaType

            showSuccessMessage: =>
                Marionette.triggerMethod.call @region, "show:order:updated:msg"
#                @layout.triggerMethod "show:order:updated:msg"

        App.commands.setHandler 'show:media:list',(options)->
            new MediaList.Controller options