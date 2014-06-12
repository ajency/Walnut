define ["app", 'backbone'], (App, Backbone) ->
    App.module "Entities.Media", (Media, App, Backbone, Marionette, $, _)->

        #Media Model
        class Media.MediaModel extends Backbone.Model
            idAttribute : 'id'

            name : 'media'

            # function to calculate the best fit for the given size
            getBestFit : (width)->
                sizes = @get 'sizes'

                closest = null
                # get closest size
                smallest = 99999
                _.each sizes, (size, key)->
                    val = size.width - width
                    val = if val < 0 then (-1 * val) else val
                    if val <= smallest
                        closest =
                            url : size.url
                            size : key
                        smallest = val

                closest = sizes['full'] if _.isNull closest
                console.log closest

                closest
        # mode = 'landscape'
        # mode = 'portrait' if height > width
        # url = 'http://dsdsdsd.com'
        # switch mode
        # 	when 'landscape'
        # 		url = 'landscape'
        # 	when 'portrait'
        # 		url = 'portrait'

        # sizes = @get 'sizes'

        # if sizes['thumbnail'] then sizes['thumbnail'].url else sizes['full'].url


        #Media collection
        class Media.MediaCollection extends Backbone.Collection

            filters :
                order : 'DESC'
                orderby : 'date'
                paged : 1
                posts_per_page : 40
                searchStr: ''

            model : Media.MediaModel

            parse : (resp)->
                return resp.data if resp.code is 'OK'
                resp

        mediaCollection = new Media.MediaCollection
        # initialize a blank media collection


        ##PUBLIC API FOR ENitity
        API =
            fetchMedia : (params = {}, reset)->
#
                mediaCollection.url = "#{AJAXURL}?action=query_attachments"

                _.defaults params, mediaCollection.filters

                mediaCollection.fetch
                    reset : reset
                    data : params

                mediaCollection

        #get a media
            getMediaById : (mediaId)->
                return API.getPlaceHolderMedia() if 0 is parseInt mediaId

                # check if present
                media = mediaCollection.get parseInt mediaId

                if _.isUndefined media
                    media = new Media.MediaModel id : mediaId
                    mediaCollection.add media
                    media.fetch()

                media

            getEmptyMediaCollection : ->
                mediaCollection

        # this fucntion will return a placeholder media for the requesting element
        # this will be special purpose media model.
            getPlaceHolderMedia : ->
                media = new Media.MediaModel
                media

            createNewMedia : (data)->
                media = new Media.MediaModel data
                mediaCollection.add media
                media


        #REQUEST HANDLERS
        App.reqres.setHandler "get:empty:media:collection", ->
            API.getEmptyMediaCollection()

        App.reqres.setHandler "fetch:media", (params = {}, shouldReset = true) ->
            API.fetchMedia params, shouldReset

        App.reqres.setHandler "get:media:by:id", (mediaId)->
            API.getMediaById mediaId

        App.commands.setHandler "new:media:added", (modelData)->
            API.createNewMedia modelData
