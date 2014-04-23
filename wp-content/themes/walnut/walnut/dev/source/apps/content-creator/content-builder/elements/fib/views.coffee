define ['app'],(App)->

	App.module "ContentCreator.ContentBuilder.Element.Fib.Views",
	(Views, App, Backbone, Marionette,$, _)->

		class Views.FibView extends Marionette.ItemView

			template : '<p class="fib-text" ></p>'
						# <input  type="text"
						#  maxlength="{{maxlength}}" size="{{maxlength}}" placeholder="Answer" style="
					 #    font-family: {{font}}; font-size: {{font_size}}px; color: {{color}}; 
					 #      height: 100%; line-height : inherit; border-width : 5px;
					 #     border-style: none; float:left">

			# listen to the model events 
			modelEvents : 
					# 'change:maxlength'  : '_changeMaxLength'
					'change:font' : (model,font)-> @_changeFont font
					'change:font_size' : (model,size)->@_changeSize size
					'change:color' : (model,color)->@_changeColor color
					'change:bg_color' : (model,bg_color)->@_changeBGColor model
					'change:bg_opacity' : (model,bg_opacity)->@_changeBGColor model
					'change:style' : (model,style)->@_changeFibStyle style

			# avoid and anchor tag click events
			# listen to blur event for the text element so that we can save the new edited markup
			# to server. The element will triggger a text:element:blur event on blur and pass the 
			# current markupup as argument
			events:
				'click a'	: (e)-> e.preventDefault()
				'blur p'	: '_textBlur' 
				'DOMSubtreeModified p'	: '_updateInputProperties'

			initialize:(options)->
				@blanksCollection = @model.get 'blanksArray'

			onShow : ->

				# setting of on click handler for showing of the property box for fib element
				@$el.parent().parent().on 'click',(evt)=>
					@trigger "show:this:fib:properties"
					@trigger "close:hotspot:element:properties"
					# stop propogation of click event
					evt.stopPropagation()


				@$el.find('p').attr('contenteditable','true').attr 'id', _.uniqueId 'text-'
				# CKEDITOR.on 'instanceCreated', @configureEditor
				@editor = CKEDITOR.inline document.getElementById @$el.find('p').attr 'id'
				@editor.setData _.stripslashes @model.get 'text'

				# wait for CKEditor to be loaded
				_.delay =>
					$('#cke_'+@editor.name).on 'click',(evt)->
						evt.stopPropagation()

				,500
				

			# set configuration for the Ckeditor
			# configureEditor: (event) =>
			# 	editor = event.editor
			# 	element = editor.element
			# 	# Customize the editor configurations on "configLoaded" event,
			# 	# which is fired after the configuration file loading and
			# 	# execution. This makes it possible to change the
			# 	# configurations before the editor initialization takes place.
			# 	editor.on "configLoaded", ->

			# 		# Rearrange the layout of the toolbar.
			# 		console.log editor.config.toolbar
			# 		editor.config.toolbar.splice 2,0,
			# 					name: 'forms'
			# 					items: [ 'TextField'] 
							
			
			# on change of font property
			_changeFont:(font)->
					@$el.find('input').css 'font-family',font


			# on change of font_size property
			_changeSize:(size)->
					@$el.find('input').css 'font-size',size+"px"

			# on change of color property
			_changeColor:(color)->
					@$el.find('input').css 'color', color

			# on change of bg_color property
			_changeBGColor:(model)->
					@$el.find('input').css 'background-color', _.convertHex @model.get('bg_color'),@model.get('bg_opacity')

			# on change of style property
			_changeFibStyle:(style)->
					# if underline
					if style is 'uline'
						@$el.find('input').removeClass("border").addClass "underline"
					# if box
					else if style is 'box'
						@$el.find('input').removeClass("underline").addClass "border"
					# if blank
					else 
						 @$el.find('input').removeClass "underline border"


			# save the text field on blur
			_textBlur:->
				@model.set 'text', @$el.find('p').html()

				console.log @model

			# on modification of dom structure modification of p
			_updateInputProperties:->
				# iterate thru all input tags in current view
				_.each @$el.find('input') ,(blank)=>
					# if any input tag is without 'data-id' attr
					if  _.isUndefined $(blank).attr('data-id')
						# a  random unique id to the input
						$(blank).attr 'data-id',_.uniqueId 'input-'
						# wait for ckeditor to finish adding the input
						_.delay ->
							$(blank).prop 'maxLength',parseInt 12
						,100
						
						# create a model and add to collection
						@trigger "create:new:fib:element", $(blank).attr 'data-id'

					_.delay =>
						# get a reference to the model
						blanksModel = @blanksCollection.get $(blank).attr 'data-id'
						
						# remove the event handler and add it again to prevent multiple event listeners
						blanksModel.off('change:maxlength')
						blanksModel.on 'change:maxlength',(model,maxlength)=>
							@$el.find('input[data-id='+model.get('id')+']').prop 'maxLength',maxlength
						
						# remove all events
						# on click of input show properties for it
						$(blank).off()
						$(blank).on 'click',(e)=>
							console.log blanksModel
							App.execute "show:fib:element:properties",
								model : blanksModel
							@trigger "show:this:fib:properties"
							e.stopPropagation()
					,10

				# delay for .1 sec for everything to get initialized
				# loop thru the array, if 'input not found for it remove it from the array'
				_.delay =>
					if @blanksCollection.length > 0

						@blanksCollection.each (blank)=>
							# console.log blank
							blankFound = _.find @$el.find('input') ,(blankUI)=>
												blank.get('id') is $(blankUI).attr 'data-id' 

							if _.isUndefined blankFound
								# console.log  ' in remove'
								@blanksCollection.remove blank
				,1000

				# add style for the blanks
				@_changeFont @model.get 'font'
				@_changeSize @model.get 'font_size'
				@_changeColor @model.get 'color'
				@_changeBGColor @model
				@_changeFibStyle @model.get 'style'


			# destroy the Ckeditor instance to avoiid memory leaks on close of element
			# this.editor will hold the reference to the editor instance
			# Ckeditor has a destroy method to remove a editor instance
			onClose:->
				@editor.destroy()
		
			    

