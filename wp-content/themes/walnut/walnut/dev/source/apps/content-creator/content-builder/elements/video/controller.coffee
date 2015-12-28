define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/video/views'],
(App, Element)->

	App.module 'ContentCreator.ContentBuilder.Element.Video', (Video, App, Backbone, Marionette, $, _)->

		# menu controller
		class Video.Controller extends Element.Controller

			# intializer
			initialize: (options)->
				_.defaults options.modelData,
					element: 'Video'
					video_ids: []
					video_id : 0
					height: 0
					width: 0
					title : []
					videoUrl : ''
					videoUrls: [] #'http://video-js.zencoder.com/oceans-clip.mp4'


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
				if not @layout.model.get('video_ids') and @layout.model.get('video_id')
					@layout.model.set 'video_ids',[@layout.model.get('video_id')]
					@layout.model.set 'videoUrls',[@layout.model.get('videoUrl')]
				_.each @layout.model.get('video_ids'),(id)->
					video_ids.push parseInt id

				@layout.model.set 'video_ids',video_ids

			# setup templates for the element
			renderElement: ()=>
				@removeSpinner()
				@_parseInt()
				# get logo attachment
	#                videoModel = App.request "get:media:by:id", @layout.model.get 'video_id'
				videoCollection = @_getVideoCollection()
				App.execute "when:fetched", videoCollection, =>

					videoCollection.each (model,index)=>
						titles= @layout.model.get 'title'
						if _.str.contains(titles[index], 'youtube.com') and not model.get 'url'
							model.set
								'title': titles[index]
								'name': titles[index]
								'url': titles[index]

					@view = @_getVideoView()

					#trigger media manager popup and start listening to "media:manager:choosed:media" event
					@listenTo @view, "show:media:manager", =>
						App.execute "show:media:collection:manager",
							region: App.dialogRegion
							mediaType: 'video'
							mediaCollection : videoCollection

					@listenTo @videoCollection, 'add remove order:updated',->
						@videoCollection.sort()
						@layout.model.set
							'video_ids': @videoCollection.pluck 'id'
							'videoUrls' : @videoCollection.pluck 'url'
							'title' : @videoCollection.pluck 'title'
							'video_id' : _.first @videoCollection.pluck 'id'
							'videoUrl' : _.first @videoCollection.pluck 'url'
						@layout.elementRegion.show @view
						@layout.model.save()

					@listenTo @view, "show show:video:properties", =>
						App.execute "show:question:properties",
						model : @layout.model

					@layout.elementRegion.show @view
