define ['app'],(App)->

	# Row views
	App.module 'ContentCreator.ContentBuilder.Element.ImageWithText.Views',
	(Views, App, Backbone, Marionette, $, _)->

		# Menu item view
		class Views.ImageWithTextView extends Marionette.ItemView

			className : 'imagewithtext'

			template : '{{#image}}
							<img src="{{imageurl}}" alt="{{title}}" class="{{alignclass}} img-responsive"/>
						{{/image}}
						{{#placeholder}}
							<div class="image-placeholder"><span class="bicon icon-uniF10E"></span>Upload Image</div>
						{{/placeholder}}
						<div class="editor"></div>
						<div class="clearfix"></div>'

			# override serializeData to set holder property for the view
			mixinTemplateHelpers:(data)->
				data = super data
				data.holder = ''
				if @model.isNew()
					data.placeholder = true
				else
					data.image = true
					data.imageurl = ->
						if @sizes['thumbnail'] then @sizes['thumbnail'].url else @sizes['full'].url

				data.alignclass = ->
					switch @align
						when 'left' 
							return 'pull-left'
						when 'right'
							return 'pull-right'

				data

			events:
				'click img,.image-placeholder': (e)->
							#e.stopPropagation()
							@trigger "show:media:manager"

				'blur .editor' : (e)-> @trigger "text:element:blur", @$el.children('.editor').html()

			onStyleUpadted:(newStyle, prevStyle)->
				@$el.removeClass prevStyle
					.addClass newStyle

			onRender:->
				style = Marionette.getOption this, 'style'
				@onStyleUpadted _.slugify(style), ''


			# set the height of the parent of img in case float value is set
			# check if a valid image_id is set for the element
			# if present ignore else run the Holder.js to show a placeholder
			# after run remove the data-src attribute of the image to avoid
			# reloading placeholder image again
			onShow:->
				#run ckeditor
				@$el.children('.editor').attr('contenteditable','true').attr 'id', _.uniqueId 'text-'
				@editor = CKEDITOR.inline document.getElementById @$el.children('.editor').attr 'id'
				content = Marionette.getOption(this, 'templateHelpers').content
				@editor.setData _.stripslashes content


		