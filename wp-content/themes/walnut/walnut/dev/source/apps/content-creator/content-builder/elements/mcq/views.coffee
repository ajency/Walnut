define ['app'],(App)->

	App.module "ContentCreator.ContentBuilder.Element.Mcq.Views",
	(Views, App, Backbone, Marionette,$, _)->

		mcqID = 0
		

		class OptionView extends Marionette.ItemView

			className : 'mcq-option'

			tagName : 'div'

			template : '<span>{{optionNo}}</span>
						<input class="mcq-option-select" id="option-{{optionNo}}" type="radio"  value="no">
						
						<p class="mcq-option-text"></p>'

			# avoid and anchor tag click events
			# listen to blur event for the text element so that we can save the new edited markup
			# to server. The element will triggger a text:element:blur event on blur and pass the 
			# current markupup as argument
			events:
				'click a'	: (e)-> e.preventDefault()
				'blur p'		: -> @model.set 'text', @$el.find('p').html()
							# @trigger "text:element:blur"



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

				_.delay ->
					$('div.cke').on 'mouseenter',->
						App.ContentCreator.closequestioneproperty = false

					$('div.cke').on 'mouseleave',->
						App.ContentCreator.closequestioneproperty = true
				,3000



			# destroy the Ckeditor instance to avoiid memory leaks on close of element
			# this.editor will hold the reference to the editor instance
			# Ckeditor has a destroy method to remove a editor instance
			onClose:->
				@editor.destroy()


		class Views.McqView extends Marionette.CompositeView

			className : 'mcq'

			template : '<div class="options"></div>
						<div class="clearfix"></div>'



			itemView : OptionView

			itemViewContainer : 'div.options'

			initialize:(options)->
				mcqID = options.meta
				console.log mcqID

			# # trigger whrn the no of options has been changed
			# # change the default radio to checkbox if multple 
			onAfterItemAdded:->
				@$el.find('input').attr 'name','mcq-'+mcqID
				@trigger "change:radio:to:checkbox"
			
			onShow:->
				@$el.attr 'id', 'mcq-'+mcqID
				@$el.find('input').attr 'name','mcq-'+mcqID

				@trigger "change:radio:to:checkbox"

				@_setActiveHandler()

			_setActiveHandler:->

				@$el.parent().parent().on 'click',(evt)=>
					@trigger "show:this:mcq:properties"
					evt.stopPropagation()

				# showMcqPropertyFlag = false

				# @$el.parent().parent().on 'mouseenter',->
				# 	showMcqPropertyFlag = true

				# @$el.parent().parent().on 'mouseleave',->
				# 	showMcqPropertyFlag = false

				# @$el.parent().parent().on 'mouseenter',->
				# 	App.ContentCreator.closequestioneproperty = false

				# @$el.parent().parent().on 'mouseleave',->
				# 	App.ContentCreator.closequestioneproperty = true

				# $('body').on 'click',=>
				# 	# if showMcqPropertyFlag
				# 		# @trigger "show:this:mcq:properties"

				# 	if App.ContentCreator.closequestioneproperty
				# 		console.log App.ContentCreator.closequestioneproperty
				# 		@trigger "hide:this:mcq:properties"



