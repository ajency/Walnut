define ['app'],(App)->

	# Row views
	App.module 'ContentCreator.ContentBuilder.Element.Image.Views', (Views, App, Backbone, Marionette, $, _)->

		# Menu item view
		class Views.ImageView extends Marionette.ItemView

			className : 'image'

			template : '{{#image}}
							<div id="image-holder" class="resize">
							<img src="{{imageurl}}" alt="{{title}}" class="{{alignclass}} img-responsive"/>
							<div class="clearfix"></div>
							</div>
						{{/image}}
						{{#placeholder}}
							<div class="image-placeholder"><span class="bicon icon-uniF10E"></span>Upload Image</div>
						{{/placeholder}}'

			ui :
				imageResize : '#image-holder.resize'

			# override serializeData to set holder property for the view
			mixinTemplateHelpers:(data)->
				console.log 'data  '
				console.log JSON.stringify(data)
				data = super data
				console.log ' super data  '
				console.log data

				console.log @model

				if @model.isNew()
					data.placeholder = true
				else
					data.image = true
					data.imageurl = ->
						if @sizes['thumbnail'] then @sizes['thumbnail'].url else @sizes['full'].url
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
				# width 	= @$el.width()
				# height 	= @$el.height()
				# src = @model.getBestFit width,height
				src = @model.toJSON().sizes['full'].url
				@$el.find('img').attr 'src',src
				el = @$el
				imageResize= @ui.imageResize

				img = new Image()
				img.src = @$el.find('img').attr 'src'

				width = img.width
				height= img.height
				# console.log @ui.imageResize.width()
			


				@ui.imageResize.resizable
						handles: "s" 
						maxHeight: height*@ui.imageResize.width()/width
						resize:(event, ui)->
							$(@).resizable "option", "maxHeight", height*$(@).width()/width 
							$(@).find('img').css "height",ui.size.height


				@ui.imageResize.resize ->
						setTimeout ->

							if imageResize.height()>height*imageResize.width()/width and imageResize.width()>0
								console.log imageResize.width()
							# 	console.log height*imageResize.width()/width
								imageResize.find('img').height height*imageResize.find('img').width()/width
								imageResize.height height*imageResize.find('img').width()/width
						,100
							# console.log el.width()
							# $(@).height height*$(@).find('img').width()/width
