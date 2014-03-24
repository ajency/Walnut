define ['app'],(App)->

	# Row views
	App.module 'ContentCreator.ContentBuilder.Element.Row.Views', (Views, App, Backbone, Marionette, $, _)->

		class ColumnView extends Marionette.ItemView
			className 	: 'column empty-column'
			tagName 	: 'div'
			template 	: ''
			onShow 	: ->
				@$el.attr 'data-position',@model.get 'position'
				@$el.addClass("col-md-#{@model.get 'className'}").attr 'data-class',@model.get 'className'
				@$el.sortable 
						revert 		: 'invalid'
						items 		: '> .element-wrapper'
						connectWith : '.droppable-column,.column'
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


			onClose:->
				@$el.sortable('destroy') if @$el.hasClass 'ui-sortable'
				

			
		# Menu item view
		class Views.RowView extends Marionette.CollectionView

			className : 'row'

			template : '&nbsp;'

			itemView : ColumnView

			initialize:(opt = {})->
				@collection = new Backbone.Collection
				if opt.model.get('elements').length is 0
					for i in [1,2]
						@collection.add
								position 	: i
								element 	: 'Column'
								className 	: 6
								elements 	: []
				else
					for column in opt.model.get('elements')
						col = _.clone column
						delete col.elements
						@collection.add col

			onShow:()->	
				@$el.attr 'id', _.uniqueId 'row-'	
				_.delay => 
					@setColumnResizer()
				,400

			# set new classes on style change
			onStyleChanged : (newStyle, old)->
				@$el.removeClass(old) if not _(old).isEmpty()
				@$el.addClass newStyle
				@setColumnResizer()

			onColumnCountChanged:(columnCount)->
				@adjustColumnsInRow(columnCount)

			columnCount:()->
				@$el.children('.column').length

			getColumns:()->
				@$el.children('.column')

			getResizers:()->
				@$el.closest('.element-wrapper').find('.element-controls > .aj-imp-col-divider')

			getColumnAt:(index)->
				columns = @$el.children('.column')
				columns[index]

			clearResizers:()->
				for resizer in @getResizers()
					if $(resizer).hasClass 'ui-draggable'
						$(resizer).draggable('destroy') 
						$(resizer).remove()
				
			destroySortableColumns:->
				@$el.children('.column').sortable 'destroy'

			onClose:->
				@clearResizers()
				@destroySortableColumns()

			# set column resizer
			setColumnResizer:()->
				
				@clearResizers()

				#bail if only one column is present
				if @columnCount() is 1
					return

				template = '<div class="aj-imp-col-divider">
								<p title="Move">
									<span class="bicon bicon-uniF140"></span>
								</p>
							</div>'

				numberOfResizers = this.columnCount() - 1

				_.each _.range(numberOfResizers),(ele, index)=>
					column = @getColumnAt(index + 1)
					left = $(column).position().left
					resizer = $(template)
					resizer.attr('data-position', (index + 1))
					resizer.css 'left', left
					@$el.closest('.element-wrapper').children('.element-controls').append resizer
					@makeResizer resizer 


			makeResizer:(resizer) ->
				row = resizer.parent()
				snap = row.width()
				snap = snap / 12
				resizer.draggable
					axis: "x"
					containment: row
					grid: [ snap, 0 ]
					start: (event, ui)=>
						ui.helper.start = ui.originalPosition  if _.isUndefined(ui.helper.start)
					stop: (event, ui)=>
						ui.helper.start = ui.position
					drag: (event, ui)=>
						p = Math.round(ui.position.left)
						s = Math.round(ui.helper.start.left)
						if p > s
							ui.helper.start = ui.position
							position = $(event.target).attr("data-position")
							@resizeColumns "right", parseInt(position)
						else if p < s
							ui.helper.start = ui.position
							position = $(event.target).attr("data-position")
							@resizeColumns "left", parseInt(position)

				
			resizeColumns : (direction, position)->
				#get columns to adjust width depending on position value.
				#columns to adjust  = row.elements[postion - 1] and row.elements[position]
				columns = []
				columns.push @getColumnAt(position - 1)
				columns.push @getColumnAt(position)
				currentClassZero = parseInt $(columns[0]).attr 'data-class'
				currentClassOne  = parseInt $(columns[1]).attr 'data-class'

				#return if one column class is set to zero
				return  if currentClassZero - 1 is 0 or currentClassOne - 1 is 0

				#remove class
				$(columns[0]).removeClass "col-md-#{currentClassZero}"
				$(columns[1]).removeClass "col-md-#{currentClassOne}"

				switch direction
					when "right"
						currentClassZero++
						currentClassOne--
					when "left"
						currentClassZero--
						currentClassOne++
						
				$(columns[0]).attr('data-class',currentClassZero).addClass "col-md-#{currentClassZero}"
				$(columns[1]).attr('data-class',currentClassOne).addClass "col-md-#{currentClassOne}"

			# add new columns
			addNewColumn:(colClass, position)->
				@collection.add
						position 	: position
						element 	: 'Column'
						className 	: parseInt colClass
						elements 	: []


			removeColumn:($column)->
				#clear sortable
				_position = parseInt $column.attr 'data-position'
				column = @collection.findWhere position : _position					
				@collection.remove column

			# adjust columns in row
			adjustColumnsInRow :(count)=>
				requestedColumns = count
				#if same column count is clicked ignore
				return  if requestedColumns is @columnCount()

				colClass = 12 / requestedColumns
				
				if requestedColumns > @columnCount()
					extraColumns = requestedColumns - @columnCount()
					#adjust class of existing columns
					_.each @getColumns(), (column, index)=>
						currentClass = $(column).attr 'data-class'
						$(column).removeClass("col-md-#{currentClass}").addClass("col-md-#{colClass}").attr 'data-class', colClass

					count = @columnCount()
					for i in _.range(extraColumns)
						@addNewColumn colClass, (count + i + 1)
						

				else if requestedColumns < @columnCount()
					emptyColumns = []
					_.each @getColumns(), (column, index) ->
						emptyColumns.push $(column) if $(column).isEmptyColumn()

					emptyColsLen = emptyColumns.length
				
					#first check
					if emptyColsLen is 0
						alert "None of the columns are empty. Please delete elements inside columns to remove"
						return
				
					#check if current columns - requested columns > empty columns
					if @columnCount() - requestedColumns > emptyColsLen
						alert "Unable to perform this action"
						return
					
					colsToRemove = 0
				
					#check if current columns - requested columns <= empty columns
					if @columnCount() - requestedColumns <= emptyColsLen
						colsToRemove = @columnCount() - requestedColumns
					else
						colsToRemove = emptyColsLen - requestedColumns
					
					nCols = []
				
					#get columns to remove and reverse the array
					cols = @getColumns().toArray().reverse()
					
					_.each cols, (column, index)=>
						if colsToRemove is 0 or not $(column).isEmptyColumn()
							return
						@removeColumn $(column)
						colsToRemove--

					#adjust class of existing columns
					_.each @getColumns(), (column, index) ->
						currentClass = $(column).attr 'data-class'
						$(column).removeClass("col-md-#{currentClass}").addClass("col-md-#{colClass}").attr 'data-class', colClass

				@setColumnResizer()
	
