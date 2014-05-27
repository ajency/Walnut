define ['app'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/elements/video/view'],
		(App,Element)->

			App.module 'ContentPreview.ContentBoard.Element.Video',
			(Video, App, Backbone, Marionette, $, _)->

				# menu controller
				class Video.Controller extends Element.Controller

					# intializer
					initialize:(options)->						
						super(options)
						
					bindEvents:->						
						super()

			
					_getVideoView:(imageModel)->
						new Video.Views.VideoView
										model : @layout.model
												

					# setup templates for the element
					renderElement:()=>

						view = @_getVideoView()

						@layout.elementRegion.show view
							