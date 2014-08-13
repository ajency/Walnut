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
						_.defaults options.modelData,
							image_id: 0
							size: 'thumbnail'
							align: 'left'
							heightRatio : 'auto'
							topRatio : 0

						options.modelData.heightRatio = parseFloat options.modelData.heightRatio if options.modelData.heightRatio isnt 'auto'

						options.modelData.topRatio = 0 if _.isNaN options.modelData.topRatio
							

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
								imageHeightRatio : @layout.model.get 'heightRatio'
								positionTopRatio : parseFloat @layout.model.get 'topRatio'
								templateHelpers : @_getTemplateHelpers()
												

					# setup templates for the element
					renderElement:()=>
					
						# get logo attachment
						imageModel = App.request "get:media:by:id",@layout.model.get 'image_id'

						
						App.execute "when:fetched", imageModel, =>
							
							view = @_getImageView imageModel

							@layout.elementRegion.show view