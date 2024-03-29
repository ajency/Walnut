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

		# initialize a blank media collection


		##PUBLIC API FOR ENitity
		API =

			fetchMedia : (params = {}, reset)->
	#
				mediaCollection = new Media.MediaCollection
				mediaCollection.url = "#{AJAXURL}?action=query_attachments"

				_.defaults params, mediaCollection.filters

				mediaCollection.filters = params

				mediaCollection.fetch
					reset : reset
					data : params

				mediaCollection

		#get a media
			getMediaById : (mediaId)->
				return API.getPlaceHolderMedia() if 0 is parseInt mediaId

				media = new Media.MediaModel id : mediaId
				media.fetch()

				media

			getEmptyMediaCollection : ->
				mediaCollection = new Media.MediaCollection
				mediaCollection

			getMediaCollectionById:(ids = [])->
				mediaCollection = new Media.MediaCollection
				mediaCollection.url = "#{AJAXURL}?action=get_media_by_ids"
				if _.size(ids) > 0
					mediaCollection.fetch
						data:
							ids : ids
							mediaType : 'video'

				mediaCollection

		# this fucntion will return a placeholder media for the requesting element
		# this will be special purpose media model.
			getPlaceHolderMedia : ->
				media = new Media.MediaModel
				media

			createNewMedia : (data)->
				media = new Media.MediaModel data
				media


		#REQUEST HANDLERS
		App.reqres.setHandler "get:empty:media:collection", ->
			API.getEmptyMediaCollection()

		App.reqres.setHandler "fetch:media", (params = {}, shouldReset = false) ->
			API.fetchMedia params, shouldReset

		App.reqres.setHandler "get:media:by:id", (mediaId)->
			API.getMediaById mediaId

		App.reqres.setHandler 'get:media:collection:by:ids',(mediaIds)->
			API.getMediaCollectionById mediaIds

		App.reqres.setHandler "new:media:added", (modelData)->
			API.createNewMedia modelData

		App.commands.setHandler "new:media:added", (modelData)->
			API.createNewMedia modelData
