define ['app'],(App)->

	App.module "ContentCreator.ContentBuilder.Element.Mcq.Views",
	(Views, App, Backbone, Marionette,$, _)->

		class Views.McqView extends Marionette.ItemView

			className : 'mcq'
			

			onShow:->
				@$el.attr 'id','mcq-container'

				# set event handler for click of mcq and stop propogation of the event
				@$el.parent().parent().on 'click',(evt)=>
						@trigger "show:this:mcq:properties"
						evt.stopPropagation()

				@trigger "create:row:structure",
						container : @$el

				@$el.find('.aj-imp-drag-handle').remove()
				@$el.find('.aj-imp-delete-btn').remove()
				@$el.find('.aj-imp-settings-btn').remove()

			onPreTickAnswers:->
				
				console.log @model.get('correct_answer')
				_.each @model.get('correct_answer'),(optionNo)=>
					console.log 'onPreTickAnswers'
					@$el.find('input:checkbox[id=option-'+optionNo+']').attr 'checked',true
					@$el.find('input:checkbox[id=option-'+optionNo+']').parent().css('background-position','0px -26px')





		class Views.McqOptionView extends Marionette.ItemView

			className : 'mcq-option'

			tagName : 'div'

			template : '<input class="mcq-option-select" id="option-{{optionNo}}" type="checkbox"  value="no">
						
						<p class="mcq-option-text"></p>'

			# avoid and anchor tag click events
			# listen to blur event for the text element so that we can save the new edited markup
			# to server. The element will triggger a text:element:blur event on blur and pass the 
			# current markupup as argument
			events:
				'click a'	: (e)-> e.preventDefault()
				'blur p'		: '_onBlur'
				'change input:checkbox' : '_onClickOfCheckbox'
							# @trigger "text:element:blur"

			# triggers :
			# 	'change input:checkbox' : '_onClickOfCheckbox'



			# initialize the CKEditor for the text element on show
			# used setData instead of showing in template. this works well
			# using template to load content add the html tags in content
			# hold the editor instance as the element property so that
			# we can destroy it on close of element
			onShow:->
				@$el.attr 'id', 'mcq-option-'+@model.get 'optionNo'
				@$el.find('p').attr('contenteditable','true').attr 'id', _.uniqueId 'text-'
				@editor = CKEDITOR.inline document.getElementById @$el.find('p').attr 'id'
				@editor.setData _.stripslashes @model.get 'text'

				# wait for CKEditor to be loaded
				_.delay =>
					$('#cke_'+@editor.name).on 'click',(evt)->
						evt.stopPropagation()

				,500

				# custom checkbox
				@$el.find('input:checkbox').screwDefaultButtons
					image: 'url("../wp-content/themes/walnut/images/csscheckbox.png")'
					width: 32
					height: 26

				@$el.parent().on "class:changed",=>
					@model.set 'class', @$el.parent().attr('data-class')
					# if e.originalEvent.attrName is 'data-class'
					# 	console.log @$el.parent().attr('data-class')

			_onBlur:->
				@model.set 'text', @$el.find('p').html()

			_onClickOfCheckbox:(evt)->

					if $(evt.target).prop 'checked'
						console.log 'checked'
						@trigger 'option:checked'
					else 
						console.log 'unchecked'
						@trigger 'option:unchecked'


			onClickCheckbox:()->

				@$el.find('input:checkbox').attr 'checked',true
				@$el.find('input:checkbox').parent().css('background-position','0px -26px')
					



			# destroy the Ckeditor instance to avoiid memory leaks on close of element
			# this.editor will hold the reference to the editor instance
			# Ckeditor has a destroy method to remove a editor instance
			onClose:->
				@editor.destroy()


		# class Views.McqView extends Marionette.CompositeView

		# 	className : 'mcq'

		# 	template : '<div class="options"></div>
		# 				<div class="clearfix"></div>'



		# 	itemView : OptionView

		# 	itemViewContainer : 'div.options'

		# 	initialize:(options)->
		# 			@mcq_model = options.mcq_model

				

		# 	# # # trigger when the no of models in collection has been changed
		# 	# # # change the default radio to checkbox if multple 
		# 	# onAfterItemAdded:->
		# 	# 		if @mcq_model.get 'multiple'
		# 	# 				@$el.find('.mcq-option input.mcq-option-select').attr 'type','checkbox'
			
		# 	# triggered on show of the view
		# 	onShow:->
		# 			# if @mcq_model.get 'multiple'
		# 			# 		@$el.find('.mcq-option input.mcq-option-select').attr 'type','checkbox'

		# 			# set event handler for click of mcq and stop propogation of the event
		# 			@$el.parent().parent().on 'click',(evt)=>
		# 					@trigger "show:this:mcq:properties"
		# 					evt.stopPropagation()

		# 			# # events handlers for change of model attributes
		# 			# @mcq_model.on 'change:multiple', @_changeMultipleAnswers

		# 	# # on change of multiple attribute in the model 
		# 	# # change the input type
		# 	# _changeMultipleAnswers:(model,multiple)=>
		# 	# 	if multiple
		# 	# 		@$el.find('.mcq-option input.mcq-option-select').attr 'type','checkbox'
		# 	# 	else
		# 	# 		@$el.find('.mcq-option input.mcq-option-select').attr 'type','radio'

			



