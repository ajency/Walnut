define ['app'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/elements/image/view'],
		(App,Element)->

			App.module 'ContentPreview.ContentBoard.Element.Image',
			(Image, App, Backbone, Marionette, $, _)->

				# menu controller
				class Image.Controller extends Element.Controller

					# intializer
					initialize:(options)->

						

						super(options)
						
			

					# private etmplate helper function
					# this function will get the necessary template helpers for the element
					# template helper will return an object which will later get mixed with
					# serialized data before render
					_getTemplateHelpers:->
							size 		: @layout.model.get 'size'
							alignment 	: @layout.model.get 'align'

					_getImageView:(imageModel)->
						new Image.Views.ImageView
										model : imageModel
										templateHelpers : @_getTemplateHelpers()
												

					# setup templates for the element
					renderElement:()=>
					
						# get logo attachment
						imageModel = App.request "get:media:by:id",@layout.model.get 'image_id'

						
						App.execute "when:fetched", imageModel, =>
							
							view = @_getImageView imageModel

							
						
							@layout.elementRegion.show view
							