define ['app'],(App)->

	# Row views
	App.module 'ContentCreator.ContentBuilder.Element.TeacherQuestion.Views', (Views, App, Backbone, Marionette, $, _)->

		class RowView extends Marionette.ItemView
			className 	: 'teacher-question-row column'
			# tagName 	: 'div'
			template 	: '<span></span>'
			onShow 	: ->
				if @model.get('position') is 1
					@$el.find('span').text('Question')
				else
					@$el.find('span').text('Answer')
				@$el.attr 'data-position',@model.get 'position'
				
				# @$el.addClass("col-md-#{@model.get 'className'}").attr 'data-class',@model.get 'className'
				@$el.sortable 
						revert 		: 'invalid'
						items 		: '> .element-wrapper'
						connectWith : '.droppable-column, .column'
						handle 		: '.aj-imp-drag-handle'
						start 		: (e, ui)->
										ui.placeholder.height ui.item.height()
										window.dragging = true
										return
						stop 		:(e, ui)-> 
										window.dragging = false
										return
						helper 		: 'clone'
						opacity		: .65
						remove 		: (evt, ui)->
										if $(evt.target).children().length is 0
											$(evt.target).addClass 'empty-column'
						update 		: (e,ui)->
										
										$(e.target).removeClass 'empty-column'
						# receive		: (evt, ui)=> 
						# 				if ui.item.find('form').find('input[name="element"]').val() is 'Video'
						# 					App.execute "video:moved"
										# if ui.item.prop("tagName") isnt 'LI'
										# 	if _.contains ['Fib','Hotspot','Sort','BigAnswer','Mcq'],ui.item.find('input[name="element"]').val()
												# $(ui.sender).sortable('cancel')
				
				


			onClose:->
				@$el.sortable('destroy') if @$el.hasClass 'ui-sortable'
				
			onAddDefaultTextElement:->
				App.request "add:new:element", @$el, 'Text'

			
		# Menu item view
		class Views.MainView extends Marionette.CollectionView

			className : 'teacher-question'

			template : '&nbsp;'

			itemView : RowView

			initialize:(opt = {})->
				@model = opt.model
				@collection = new Backbone.Collection
				if opt.model.get('elements').length is 0
					for i in [1,2]
						@collection.add
								position 	: i
								element 	: 'TeacherQuestRow'
								elements 	: []
				else
					for row in opt.model.get('elements')
						ro = _.clone row
						delete ro.elements
						@collection.add ro

				
			onShow:(opt = {})->
				if @model.get('elements').length is 0
					@collection.each @_addTextForChild
						
				# else 
				# 	for row in @model.get('elements')
				# 		if row.elements.length is 0
				# 			model = @collection.findWhere {position:row.position}
				# 			@_addTextForChild model

			_addTextForChild:(model)=>
					console.log @children.findByModel(model)
					itemview = @children.findByModel(model)
					itemview.triggerMethod "add:default:text:element"
