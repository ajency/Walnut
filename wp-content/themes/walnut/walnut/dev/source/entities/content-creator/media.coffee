define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.Media", (Media, App, Backbone, Marionette, $, _)->

			#Media Model
			class Media.MediaModel extends Backbone.Model
				idAttribute : 'id'

				name : 'media'

				# function to calculate the best fit for the given size
				getBestFit:(width, height)->
					mode = 'landscape'
					mode = 'portrait' if height > width
					url = 'http://dsdsdsd.com'
					switch mode 
						when 'landscape'
							url = 'landscape'
						when 'portrait'
							url = 'portrait'

					sizes = @get 'sizes'

					if sizes['thumbnail'] then sizes['thumbnail'].url else sizes['full'].url


			#Media collection
			class Media.MediaCollection extends Backbone.Collection

				filters: 
					order           : 'DESC'
					orderby         : 'date'
					paged           : 1
					posts_per_page  : 40
				
				model : Media.MediaModel

				parse:(resp)->
					return resp.data if resp.code is 'OK'
					resp

			# initialize a blank media collection
			mediaCollection = new Media.MediaCollection


			##PUBLIC API FOR ENitity
			API =
				fetchMedia: (params ={}, reset)->
					
					mediaCollection.url = "#{AJAXURL}?action=query_attachments"
					
					_.defaults params,mediaCollection.filters 

					mediaCollection.fetch
									reset : reset
									data  : params
							 
					mediaCollection

				#get a media 
				getMediaById:(mediaId)->

					return API.getPlaceHolderMedia() if 0 is parseInt mediaId 

					# check if present
					media = mediaCollection.get parseInt mediaId

					if _.isUndefined media
						media = new Media.MediaModel id : mediaId
						mediaCollection.add media
						media.fetch()

					media

				getEmptyMediaCollection:->
					new Media.MediaCollection

				# this fucntion will return a placeholder media for the requesting element
				# this will be special purpose media model.
				getPlaceHolderMedia:->
					media = new Media.MediaModel
					media

				createNewMedia:(data)->
					media = new Media.MediaModel data
					mediaCollection = App.request "get:collection", 'mediacollection'
					mediaCollection.add media


			#REQUEST HANDLERS
			App.reqres.setHandler "get:empty:media:collection",->
				API.getEmptyMediaCollection()
			
			App.reqres.setHandler "fetch:media",(shouldReset = true) ->
				API.fetchMedia shouldReset

			App.reqres.setHandler "get:media:by:id",(mediaId)->
				API.getMediaById mediaId

			App.commands.setHandler "new:media:added",(modelData)->
				API.createNewMedia modelData