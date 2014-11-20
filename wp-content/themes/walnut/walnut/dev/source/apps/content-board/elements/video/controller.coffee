define ['app'
		'apps/content-board/element/controller'
		'apps/content-board/elements/video/view'
],(App,Element)->

	App.module 'ContentPreview.ContentBoard.Element.Video',
	(Video, App, Backbone, Marionette, $, _)->

		# menu controller
		class Video.Controller extends Element.Controller

			# intializer
			initialize:(options)=>
				{@decryptedMedia} = options
				super(options)

			bindEvents:->
				super()


			_getVideoView:(videoModel)->
				new Video.Views.VideoView
								model : @layout.model

			_getVideoCollection: =>
				videoData = new Array()
				if not @videoCollection
					if @layout.model.get('video_ids').length
						if _.platform() is 'BROWSER'
							@videoCollection = App.request "get:media:collection:by:ids", @layout.model.get 'video_ids'
						else
							videoIds = @layout.model.get 'video_ids'
							@videoCollection = App.request "get:empty:media:collection"
							_.each videoIds, (videoId, index)=>
								
								videoData[index] = _.findWhere(@decryptedMedia, {'vId':JSON.stringify(videoId)})

							@videoCollection.reset videoData
					else
						@videoCollection = App.request "get:empty:media:collection"
				
				@videoCollection.comparator = 'order'


				@videoCollection

			_parseInt:->
				video_ids = new Array()
				if not @layout.model.get('video_ids') and @layout.model.get('video_id') isnt ''
					@layout.model.set 'video_ids',[@layout.model.get('video_id')]
					@layout.model.set 'videoUrls',[@layout.model.get('videoUrl')]
				_.each @layout.model.get('video_ids'),(id)->
					video_ids.push parseInt id

				@layout.model.set 'video_ids',video_ids



			# setup templates for the element
			renderElement:()=>

				@_parseInt()

				videoCollection = @_getVideoCollection()

				App.execute "when:fetched", videoCollection, =>

					@layout.model.set 'videoUrl' : _.first videoCollection.pluck 'url'
					@layout.model.set 'videoUrls' : videoCollection.pluck 'url'
					view = @_getVideoView()

					@layout.elementRegion.show view
