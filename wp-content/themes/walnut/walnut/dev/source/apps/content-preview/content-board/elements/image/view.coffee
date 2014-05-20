define ['app'],(App)->

	# Row views
	App.module 'ContentPreview.ContentBoard.Element.Image.Views',
	(Views, App, Backbone, Marionette, $, _)->

		# Menu item view
		class Views.ImageView extends Marionette.ItemView

			className : 'image'

			template : '<img src="{{imageurl}}" alt="{{title}}" class="img-responsive" width="100%"/>
						<div class="clearfix"></div>
						'
						


			# override serializeData to set holder property for the view
			mixinTemplateHelpers:(data)->
				data = super data

				data.imageurl = ''
				
			
				data


			# check if a valid image_id is set for the element
			# if present ignore else run the Holder.js to show a placeholder
			# after run remove the data-src attribute of the image to avoid
			# reloading placeholder image again
			onShow:->

				
				width 	= @$el.width()
				
				#height 	= @$el.height()
				image = @model.getBestFit width
				@$el.find('img').attr 'src',image.url

				@trigger "image:size:selected", image.size

