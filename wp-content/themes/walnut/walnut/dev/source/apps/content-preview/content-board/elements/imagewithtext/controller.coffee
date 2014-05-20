define ['app'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/elements/imagewithtext/view'],
		(App,Element)->

			App.module 'ContentPreview.ContentBoard.Element.ImageWithText',
			(ImageWithText, App, Backbone, Marionette, $, _)->

				# menu controller
				class ImageWithText.Controller extends Element.Controller

					# intializer
					initialize:(options)->

						
						super(options)
						
					

					# private etmplate helper function
					# this function will get the necessary template helpers for the element
					# template helper will return an object which will later get mixed with
					# serialized data before render
					_getTemplateHelpers:->
							size 		: @layout.model.get 'size'
							align 		: @layout.model.get 'align'
							content 	: @layout.model.get 'content'

					_getImageWithTextView:(imageModel)->
						new ImageWithText.Views.ImageWithTextView
										model : imageModel
										templateHelpers : @_getTemplateHelpers()
										# style : style

					# changeElementStyle:(model)->
					# 	prevStyle = _.slugify model.previous 'style'
					# 	newStyle  = _.slugify model.get 'style' 
					# 	@layout.elementRegion.currentView.triggerMethod "style:upadted", newStyle, prevStyle					

					# setup templates for the element
					renderElement:()=>
						
						# get logo attachment
						imageModel = App.request "get:media:by:id",@layout.model.get('image_id')
						App.execute "when:fetched", imageModel, =>
							
							view = @_getImageWithTextView imageModel #,@layout.model.get('style')


							@layout.elementRegion.show view
