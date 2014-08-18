define ['app'],(App)->
	App.module 'ContentCreator.PropertyDock.TablePropertyBox.Views',(Views,App)->

		class Views.PropertyView extends Marionette.ItemView

			template : '<div class="tile-more-content no-padding">
							<div class="tiles green">
								<div class="tile-footer drag">
									Sort <i class="fa fa-chevron-right"></i> <span class="semi-bold">Sort Properties</span>
								</div>
								<div class="docket-body">
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
									<div class="control-group ">
										<label for="properties">Properties: </label>
										<div class="checkbox check-success">
											<input type="checkbox" value="" id="checkbox-bordered" data-toggle="checkbox">
											<label class="checkbox" for="checkbox-bordered">
												
												Bordered
											</label>
											<input type="checkbox" value="" id="checkbox-striped" data-toggle="checkbox">
											<label class="checkbox" for="checkbox-striped">
												
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
						</div>'

			events : 
				'click .spinner .btn:first-of-type' : 'increaseCount'
				'click .spinner .btn:last-of-type' : 'decreaseCount'
				'change #checkbox-bordered' : 'changeBordered'
				'change #checkbox-striped' : 'changeStriped'
				'change #table-style' : 'changeStyle'

			modelEvents : 
				'change:row' : 'changeRowCount'
				'change:column' : 'changeColCount'

			onShow:->
				@$el.find('#checkbox-bordered').prop 'checked', @model.get('bordered')
				@$el.find('#checkbox-striped').prop 'checked', @model.get('striped')
				@$el.find('#table-style').val @model.get 'style' 
				# @$el.find('[data-toggle="checkbox"]').checkbox() 


			increaseCount : (evt)->
				evt.stopPropagation()
				$(evt.target).closest('.spinner').find('input').val parseInt($(evt.target).closest('.spinner').find('input').val(),10)+1
				@model.set 'column', parseInt $(evt.target).closest('.spinner').find('input').val() if $(evt.target).closest('.spinner').hasClass 'column-spinner'
				@model.set 'row', parseInt $(evt.target).closest('.spinner').find('input').val() if $(evt.target).closest('.spinner').hasClass 'row-spinner'


			decreaseCount : (evt)->
				evt.stopPropagation()
				$(evt.target).closest('.spinner').find('input').val parseInt($(evt.target).closest('.spinner').find('input').val(),10)-1
				@model.set 'column', parseInt $(evt.target).closest('.spinner').find('input').val() if $(evt.target).closest('.spinner').hasClass 'column-spinner'
				@model.set 'row', parseInt $(evt.target).closest('.spinner').find('input').val() if $(evt.target).closest('.spinner').hasClass 'row-spinner'

			changeRowCount :(model,row)->
				@$el.find('.row-spinner input').val row

			changeColCount : (model,column)->
				@$el.find('.column-spinner input').val column

			changeBordered : (e)->
				if $(e.target).prop 'checked'
					@model.set 'bordered',true
				else
					@model.set 'bordered',false

			changeStriped : (e)->
				if $(e.target).prop 'checked'
					@model.set 'striped',true
				else
					@model.set 'striped',false

			changeStyle : (e)->
				@model.set 'style', _.slugify $(e.target).val()




