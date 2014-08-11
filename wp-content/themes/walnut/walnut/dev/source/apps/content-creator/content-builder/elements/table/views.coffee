define ['app'
		'bootbox'
], (App,bootbox)->

	# Row views
	App.module 'ContentCreator.ContentBuilder.Element.Table.Views', (Views, App, Backbone, Marionette, $, _)->

		# Menu item view
		class Views.TableView extends Marionette.ItemView

			className : 'imp-table'

			template : '<div class="table-settings-bar">
						 <div class="form-inline">
							<div class="control-group">
								<label for="spinner-01">Columns: </label>
							  	<div class="input-group spinner column-spinner">
									<input type="text" class="form-control" value="{{column}}">
									<div class="input-group-btn-vertical">
										<button class="btn btn-default"><i class="glyphicon glyphicon-chevron-up"></i></button>
										<button class="btn btn-default"><i class="glyphicon glyphicon-chevron-down"></i></button>
									</div>
								</div>
							</div>
							<div class="control-group">
								<label for="spinner-02">Rows: </label>
							  	<div class="input-group spinner row-spinner">
									<input type="text" class="form-control" value="{{row}}">
									<div class="input-group-btn-vertical">
										<button class="btn btn-default"><i class="glyphicon glyphicon-chevron-up"></i></button>
										<button class="btn btn-default"><i class="glyphicon glyphicon-chevron-down"></i></button>
									</div>
								</div>
							</div>
							<div class="control-group check-props">
								<label for="properties">Properties: </label>
							  	<div class="props">
							  		<label class="checkbox" for="checkbox-bordered">
										<input type="checkbox" value="" id="checkbox-bordered" data-toggle="checkbox">
										Bordered
									</label>
									<label class="checkbox" for="checkbox-striped">
										<input type="checkbox" value="" id="checkbox-striped" data-toggle="checkbox">
										Striped
									</label>
							  	</div>
							</div>
							<div class="control-group styles">
								<label for="style">Style: </label>
							  	<select id="table-style">
							  		<option value="style-1">Style 1</option>
							  		<option value="style-2">Style 2</option>
							  	</select>
							</div>
						</div>
					</div>
					<div class="table-holder"></div>'

			ui:
				editableData: 'table td '
				editableHead : 'table th '

			events : 
				'click @ui.editableData,@ui.editableHead' : 'showEditor'
				'click .cke_editable' : (e)->
					e.stopPropagation()

				'click a': (e)->
                    e.preventDefault()

				'click .table-holder' : 'destroyEditor'

				'click .spinner .btn:first-of-type' : 'increaseCount'
				'click .spinner .btn:last-of-type' : 'decreaseCount'


				'column:resize:stop.rc table' : 'saveTableMarkup'

				'change #checkbox-bordered' : 'changeBordered'
				'change #checkbox-striped' : 'changeStriped'
				'change #table-style' : 'changeStyle'



			onShow :->
				@$el.find('.table-holder').html _.stripslashes @model.get 'content'
				@$el.find('#checkbox-bordered').prop 'checked', true if @$el.find('table').hasClass 'table-bordered'
				@$el.find('#checkbox-striped').prop 'checked', true if @$el.find('table').hasClass 'table-striped'
				@$el.find('#table-style').val @model.get 'style' 
				@$el.find('table').resizableColumns()
				# @$el.find('select').selectpicker()
				@$el.find('[data-toggle="checkbox"]').checkbox() 


			increaseCount : (evt)->
				evt.stopPropagation()
				$(evt.target).closest('.spinner').find('input').val parseInt($(evt.target).closest('.spinner').find('input').val(),10)+1
				@columnChanged parseInt $(evt.target).closest('.spinner').find('input').val() if $(evt.target).closest('.spinner').hasClass 'column-spinner'
				@rowChanged parseInt $(evt.target).closest('.spinner').find('input').val() if $(evt.target).closest('.spinner').hasClass 'row-spinner'


			decreaseCount : (evt)->
				evt.stopPropagation()
				$(evt.target).closest('.spinner').find('input').val parseInt($(evt.target).closest('.spinner').find('input').val(),10)-1
				@columnChanged parseInt $(evt.target).closest('.spinner').find('input').val() if $(evt.target).closest('.spinner').hasClass 'column-spinner'
				@rowChanged parseInt $(evt.target).closest('.spinner').find('input').val() if $(evt.target).closest('.spinner').hasClass 'row-spinner'


			rowChanged:(row)->
				if row > @model.get 'row'
					@model.set 'row', row
					html = '<tr>'
					for index in [1..@model.get('column')]
						html += '<td><div>demo</div></td>'
					html += '</tr>'
					@$el.find('tbody').append html
					@saveTableMarkup()
				else
					bootbox.confirm 'Removing a ROW might cause a loss of data.
					 	Do you want to continue?',(result)=>
						if result
							@model.set 'row', row
							@$el.find('tbody tr:last-of-type').remove()
							@saveTableMarkup()
						else 
							# model.set 'row', row+1
							@$el.find('.row-spinner input').val @model.get 'row'
				

			columnChanged : (column)->
				if column > @model.get 'column'
					@model.set 'column',column
					@$el.find('thead tr').append '<th><div>demo</div></th>'
					tableRows = @$el.find('tbody tr')
					_.each tableRows,(row,index)->
						$(row).append '<td><div>demo</div></td>'

					@$el.find('table').resizableColumns('destroy')
					@$el.find('table').resizableColumns()
					@saveTableMarkup()
				else 
					bootbox.confirm 'Removing a COLUMN might cause a loss of data.
					 	Do you want to continue?',(result)=>
						if result
						 	@model.set 'column',column
						 	@$el.find('thead tr th:last-of-type').remove()
						 	tableRows = @$el.find('tbody tr td:last-of-type').remove()
						 	@saveTableMarkup()
						else
							# model.set 'column', column+1
							# console.log column+1
							@$el.find('.column-spinner input').val @model.get 'column'

				




			showEditor :(evt)->
				evt.stopPropagation()
				if @editor
					@editor.destroy()
					@$el.find('td div, th div').removeAttr('contenteditable').removeAttr('style').removeAttr 'id'

					@saveTableMarkup()	
				
				console.log 'showEditor'
				id = _.uniqueId 'text-'
				$(evt.target).closest('td,th').find('div').attr('contenteditable', 'true').attr 'id', id
				CKEDITOR.on 'instanceCreated', @configureEditor
				@editor = CKEDITOR.inline document.getElementById id
				@editor.config.placeholder = 'Click to enter text.'
				# @editor.setData _.stripslashes @model.get 'content'

			configureEditor : (event) =>
                editor = event.editor
                element = editor.element

                if element.getAttribute('id') is @$el.attr 'id'
                    editor.on 'configLoaded', ->
                        editor.config.placeholder = 'Enter Data'

			destroyEditor :(evt)=>
				evt.stopPropagation()

				if @editor
					@editor.destroy()
					@editor = null
					console.log 'editor destroyed'
					@$el.find('td div, th div').removeAttr('contenteditable').removeAttr('style').removeAttr 'id'
					# $(evt.target).closest('div').attr('contenteditable', 'false').removeAttr 'id'
					@$el.find('table').resizableColumns('destroy')
					@$el.find('table').resizableColumns()
					@saveTableMarkup()				

			saveTableMarkup:->
				console.log 'save table'
				@trigger 'save:table',@$el.find('.table-holder')


			changeBordered : (e)->
				if $(e.target).prop 'checked'
					@$el.find('table').addClass 'table-bordered'

				else
					@$el.find('table').removeClass 'table-bordered'

				@saveTableMarkup()


			changeStriped :(e)->
				if $(e.target).prop 'checked'
					@$el.find('table').addClass 'table-striped'

				else
					@$el.find('table').removeClass 'table-striped'

				@saveTableMarkup()

			changeStyle : (e)->
				@$el.find('table').removeClass('style-1 style-2').addClass _.slugify $(e.target).val()
				@model.set 'style', _.slugify $(e.target).val()

				@saveTableMarkup()