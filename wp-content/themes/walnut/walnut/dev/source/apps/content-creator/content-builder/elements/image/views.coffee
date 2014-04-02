define ['app'],(App)->

	# Row views
	App.module 'ContentCreator.ContentBuilder.Element.Image.Views', (Views, App, Backbone, Marionette, $, _)->

		# Menu item view
		class Views.ImageView extends Marionette.ItemView

			className : 'image'

			template : '{{#image}}
							<img src="{{imageurl}}" alt="{{title}}" class="{{alignclass}} img-responsive"/>
							<div class="clearfix"></div>
						{{/image}}
						{{#placeholder}}
							<div class="image-placeholder"><span class="bicon icon-uniF10E"></span>Upload Image</div>
						{{/placeholder}}'

			# override serializeData to set holder property for the view
			mixinTemplateHelpers:(data)->
				data = super data

				if @model.isNew()
					data.placeholder = true
				else
					data.image = true
					data.imageurl = ->
						if @sizes['thumbnail'] then @sizes['thumbnail'].url else @sizes['full'].url

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
				height 	= @$el.height()
				src = @model.getBestFit width,height
				@$el.find('img').attr 'src',src
