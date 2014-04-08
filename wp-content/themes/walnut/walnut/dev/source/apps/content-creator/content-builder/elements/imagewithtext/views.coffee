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
						<p class="editor"></p>
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

				'blur p.editor' : (e)-> @trigger "text:element:blur", @$el.children('p.editor').html()

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
				@$el.children('p.editor').attr('contenteditable','true').attr 'id', _.uniqueId 'text-'
				CKEDITOR.on 'instanceCreated', @configureEditor
				@editor = CKEDITOR.inline document.getElementById @$el.children('p.editor').attr 'id'
				content = Marionette.getOption(this, 'templateHelpers').content
				@editor.setData _.stripslashes content


			# set configuration for the Ckeditor
			configureEditor: (event) =>
				editor = event.editor
				element = editor.element
				
				editor.on "configLoaded", ->

					editor.config.toolbar = [
								name: 'clipboard'
								groups: [ 'clipboard', 'undo' ]
								items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ]
							,
								name: 'editing'
								groups: [ 'find', 'selection', 'spellchecker' ]
								items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] 
							,
								'/'
							,
								name: 'basicstyles'
								groups: [ 'basicstyles', 'cleanup' ]
								items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ]
							,
								name: 'paragraph'
								groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ]
								items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ]
							,	
								name: 'insert'
								items: [ 'SpecialChar', 'EqnEditor' ]
							,
								'/'
							,
								name: 'styles'
								items: [ 'Styles', 'Format', 'Font', 'FontSize' ] 
							,
								name: 'colors'
								items: [ 'TextColor', 'BGColor' ] 
							]

