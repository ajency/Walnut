define ['app'],(App)->

	# Row views
	App.module 'ContentPreview.ContentBoard.Element.Row.Views', (Views, App, Backbone, Marionette, $, _)->

		class ColumnView extends Marionette.ItemView
			className 	: 'column empty-column'
			tagName 	: 'div'
			template 	: ''
			onShow 	: ->
				@$el.attr 'data-position',@model.get 'position'
				@$el.addClass("col-md-#{@model.get 'className'}").attr 'data-class',@model.get 'className'
				# @$el.sortable 
				# 		revert 		: 'invalid'
				# 		items 		: '> .element-wrapper'
				# 		connectWith : '.droppable-column,.column'
				# 		handle 		: '.aj-imp-drag-handle'
				# 		start 		: (e, ui)->
				# 						ui.placeholder.height ui.item.height()
				# 						window.dragging = true
				# 						return
				# 		stop 		:(e, ui)-> 
				# 						window.dragging = false
				# 						return
				# 		helper 		: 'clone'
				# 		opacity		: .65
				# 		remove 		: (evt, ui)->
				# 						if $(evt.target).children().length is 0
				# 							$(evt.target).addClass 'empty-column'
				# 		update 		: (e,ui)->
				# 						$(e.target).removeClass 'empty-column'


			onClose:->
				@$el.sortable('destroy') if @$el.hasClass 'ui-sortable'
				

			
		# Menu item view
		class Views.RowView extends Marionette.CollectionView

			className : 'row'

			template : '&nbsp;'

			itemView : ColumnView

			initialize:(opt = {})->
				@collection = new Backbone.Collection
				
				for column in opt.model.get('elements')
						col = _.clone column
						delete col.elements
						@collection.add col

			onShow:()->	
				@$el.attr 'id', _.uniqueId 'row-'	
				



			columnCount:()->
				@$el.children('.column').length

			getColumns:()->
				@$el.children('.column')


			getColumnAt:(index)->
				columns = @$el.children('.column')
				columns[index]


				
			destroySortableColumns:->
				@$el.children('.column').sortable 'destroy'

			onClose:->
			
				@destroySortableColumns()

			
			# add new columns
			addNewColumn:(colClass, position)->
				@collection.add
						position 	: position
						element 	: 'Column'
						className 	: parseInt colClass
						elements 	: []


			

			

