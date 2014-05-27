define ['app'],(App)->

	# Row views
	App.module 'ContentPreview.ContentBoard.Element.TeacherQuestion.Views', 
	(Views, App, Backbone, Marionette, $, _)->

		class RowView extends Marionette.ItemView
			className 	: 'teacher-question-row column'
			# tagName 	: 'div'
			template 	: '<span></span>'
			onShow 	: ->
				if parseInt(@model.get('position')) is 1
					@$el.find('span').text('Question')
				else
					@$el.find('span').text('Answer')
					_.delay =>
						@$el.hide()
						@$el.after('<span>Answer</span><button type="button" id="show-answer"
                        class="btn btn-default btn-sm btn-small">View Answer</button>')
						@$el.nextAll('button#show-answer').on 'click',@_removeButtonAndShowAnswer
					,0

				@$el.attr 'data-position',@model.get 'position'
				
			_removeButtonAndShowAnswer:(evt)=>
				$(evt.target).hide()
				$(evt.target).prev().hide()
				@$el.show()
				


			onClose:->
				@$el.sortable('destroy') if @$el.hasClass 'ui-sortable'
				
			

			
		# Menu item view
		class Views.MainView extends Marionette.CollectionView

			className : 'teacher-question'

			template : '&nbsp;'

			itemView : RowView

			initialize:(opt = {})->
				@model = opt.model
				@collection = new Backbone.Collection
				# if opt.model.get('elements').length is 0
				# 	for i in [1,2]
				# 		@collection.add
				# 				position 	: i
				# 				element 	: 'TeacherQuestRow'
				# 				elements 	: []
				# else
				for row in opt.model.get('elements')
						ro = _.clone row
						delete ro.elements
						@collection.add ro

				
			# onShow:(opt = {})->
				# if @model.get('elements').length is 0
				# 	@collection.each @_addTextForChild
						
				# else 
				# 	for row in @model.get('elements')
				# 		if row.elements.length is 0
				# 			model = @collection.findWhere {position:row.position}
				# 			@_addTextForChild model

			# _addTextForChild:(model)=>
			# 		console.log @children.findByModel(model)
			# 		itemview = @children.findByModel(model)
			# 		itemview.triggerMethod "add:default:text:element"
