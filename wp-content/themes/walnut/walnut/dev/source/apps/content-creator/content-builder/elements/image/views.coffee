define ['app'],(App)->

	# Row views
	App.module 'ContentCreator.ContentBuilder.Element.Image.Views', (Views, App, Backbone, Marionette, $, _)->

		# Menu item view
		class Views.ImageView extends Marionette.ItemView

			className : 'image'

			template : '{{#image}}
							<img src="{{imageurl}}" alt="{{title}}" class="{{alignclass}} img-responsive" width="100%"/>
							<div class="clearfix"></div>
						{{/image}}
						{{#placeholder}}
							<div class="image-placeholder"><span class="bicon icon-uniF10E"></span>Upload Image</div>
						{{/placeholder}}'


			# override serializeData to set holder property for the view
			mixinTemplateHelpers:(data)->
				data = super data

				console.log data
				console.log @model.id
			
				if @model.isNew()
					console.log @model.id
					data.placeholder = true
				else

					data.image = true
					data.imageurl = ''
						# if @sizes['thumbnail'] then @sizes['thumbnail'].url else @sizes['full'].url
						# @sizes['full'].url

					data.alignclass = ->
						switch @alignment
							when 'left' 
								return 'pull-left'
							when 'right'
								return 'pull-right'

				data

			events:
				'click'	: (e)->
							e.stopPropagation()
							@trigger "show:media:manager"

			# check if a valid image_id is set for the element
			# if present ignore else run the Holder.js to show a placeholder
			# after run remove the data-src attribute of the image to avoid
			# reloading placeholder image again
			onShow:->

				return if @model.isNew()

					# set the URL of the image depending on the available size
				width 	= @$el.width()
				
				#height 	= @$el.height()
				image = @model.getBestFit width
				@$el.find('img').attr 'src',image.url

				@trigger "image:size:selected", image.size


				# set the URL of the image depending on the available size
				# width 	= @$el.width()
				# height 	= @$el.height()
				# src = @model.getBestFit width,height
				# src = @model.toJSON().sizes['full'].url
				# @$el.find('img').attr 'src',src
				# el = @$el
				# imageResize= @ui.imageResize

				# img = new Image()
				# img.src = @$el.find('img').attr 'src'

				# width = img.width
				# height= img.height
				# # console.log @ui.imageResize.width()
			


				# @ui.imageResize.resizable
				# 		handles: "s" 
				# 		maxHeight: height*@ui.imageResize.width()/width
				# 		resize:(event, ui)->
				# 			$(@).resizable "option", "maxHeight", height*$(@).width()/width 
				# 			$(@).find('img').css "height",ui.size.height


				# @ui.imageResize.resize ->
				# 		setTimeout ->

				# 			if imageResize.height()>height*imageResize.width()/width and imageResize.width()>0
				# 				console.log imageResize.width()
				# 			# 	console.log height*imageResize.width()/width
				# 				imageResize.find('img').height height*imageResize.find('img').width()/width
				# 				imageResize.height height*imageResize.find('img').width()/width
				# 		,100
							