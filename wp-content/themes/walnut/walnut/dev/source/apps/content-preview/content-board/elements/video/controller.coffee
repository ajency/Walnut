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

			
					_getVideoView:(videoModel)->
						new Video.Views.VideoView
										model : videoModel
												

					# setup templates for the element
					renderElement:()=>

                        # get logo attachment
                        videoModel = App.request "get:media:by:id",@layout.model.get 'video_id'


                        App.execute "when:fetched", videoModel, =>

                            view = @_getVideoView videoModel

                            @layout.elementRegion.show view
							