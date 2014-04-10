define ['app'],(App)->

	# Row views
	App.module 'ContentCreator.ContentBuilder.Element.Text.Views', (Views, App, Backbone, Marionette, $, _)->

		# Menu item view
		class Views.TextView extends Marionette.ItemView

			tagName : 'p'

			template : ''

			className: 'text'

			# avoid and anchor tag click events
			# listen to blur event for the text element so that we can save the new edited markup
			# to server. The element will triggger a text:element:blur event on blur and pass the 
			# current markupup as argument
			events:
				'click a'	: (e)-> e.preventDefault()
				'blur'		: -> @trigger "text:element:blur", @$el.html()
						

			# initialize the CKEditor for the text element on show
			# used setData instead of showing in template. this works well
			# using template to load content add the html tags in content
			# hold the editor instance as the element property so that
			# we can destroy it on close of element
			onShow:->
				@$el.attr('contenteditable','true').attr 'id', _.uniqueId 'text-'
				# CKEDITOR.on 'instanceCreated', @configureEditor
				@editor = CKEDITOR.inline document.getElementById @$el.attr 'id'
				@editor.setData _.stripslashes @model.get 'content'


			# # set configuration for the Ckeditor
			# configureEditor: (event) =>
			# 	editor = event.editor
			# 	element = editor.element
			# 	# Customize the editor configurations on "configLoaded" event,
			# 	# which is fired after the configuration file loading and
			# 	# execution. This makes it possible to change the
			# 	# configurations before the editor initialization takes place.
			# 	editor.on "configLoaded", ->



			# 		editor.config.toolbar = [
			# 		# 			# { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
			# 					name: 'clipboard'
			# 					groups: [ 'clipboard', 'undo' ]
			# 					items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ]
			# 				,
			# 					name: 'editing'
			# 					groups: [ 'find', 'selection', 'spellchecker' ]
			# 					items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] 
			# 				,
			# 		# 			# { name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
			# 					'/'
			# 				,
			# 					name: 'basicstyles'
			# 					groups: [ 'basicstyles', 'cleanup' ]
			# 					items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ]
			# 				,
			# 					name: 'paragraph'
			# 					groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ]
			# 					items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ]
			# 				,	
			# 		# 			# { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
			# 					name: 'insert'
			# 					items: [ 'SpecialChar', 'EqnEditor' ]
			# 				,
			# 					'/'
			# 				,
			# 					name: 'styles'
			# 					items: [ 'Styles', 'Format', 'Font', 'FontSize' ] 
			# 				,
			# 					name: 'colors'
			# 					items: [ 'TextColor', 'BGColor' ] 
			# 		# 			# { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
			# 		# 			# { name: 'others', items: [ '-' ] },
			# 		# 			# { name: 'about', items: [ 'About' ] }
			# 				]



			# destroy the Ckeditor instance to avoiid memory leaks on close of element
			# this.editor will hold the reference to the editor instance
			# Ckeditor has a destroy method to remove a editor instance
			onClose:->
				@editor.destroy()