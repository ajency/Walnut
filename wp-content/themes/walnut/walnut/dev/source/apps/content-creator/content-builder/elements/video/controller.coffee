define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/video/views'],
		(App,Element)->

			App.module 'ContentCreator.ContentBuilder.Element.Video',
			(Video, App, Backbone, Marionette, $, _)->

				# menu controller
				class Video.Controller extends Element.Controller

					# intializer
					initialize:(options)->

						_.defaults options.modelData,
											element  	: 'Video'
											video_id	: 0
											height		: 0
											width		: 0
											videoUrl	: 'http://video-js.zencoder.com/oceans-clip.mp4'
											

						super(options)
						
					bindEvents:->
						
						super()

					# private etmplate helper function
					# this function will get the necessary template helpers for the element
					# template helper will return an object which will later get mixed with
					# serialized data before render
					# _getTemplateHelpers:->
					# 		size 		: @layout.model.get 'size'
					# 		alignment 	: @layout.model.get 'align'

					_getVideoView:(imageModel)->
						new Video.Views.VideoView
										model : @layout.model
										# templateHelpers : @_getTemplateHelpers()
												

					# setup templates for the element
					renderElement:()=>
						@removeSpinner()
						# get logo attachment
						# imageModel = App.request "get:media:by:id",@layout.model.get 'image_id'
						
					
						view = @_getVideoView()

						#trigger media manager popup and start listening to "media:manager:choosed:media" event
						# @listenTo view, "show:media:manager", =>
						# 		App.navigate "media-manager", trigger : true
						# 		@listenTo App.vent,"media:manager:choosed:media",(media)=>
						# 			@layout.model.set 'image_id', media.get 'id'
						# 			# @layout.model.save()
						# 			@stopListening App.vent,"media:manager:choosed:media"

						# 		@listenTo App.vent,  "stop:listening:to:media:manager",=>
						# 				@stopListening App.vent, "media:manager:choosed:media"

						# @listenTo view, "image:size:selected", (size)=>
						# 	@layout.model.set 'size', size
						# 	@layout.model.save()
						# 	localStorage.setItem 'ele'+@layout.model.get('meta_id'), JSON.stringify(@layout.model.toJSON())
						# 	console.log localStorage.getItem 'ele'+@layout.model.get('meta_id')

						App.commands.setHandler "video:moved",->
							view.triggerMethod "video:moved"


						@layout.elementRegion.show view
							