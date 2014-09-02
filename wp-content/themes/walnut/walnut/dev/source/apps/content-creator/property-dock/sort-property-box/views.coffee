define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.SortPropertyBox.Views",
	(Views,App,Backbone,Marionette,$,_)->

		class Views.PropertyView extends Marionette.ItemView

			template : '<div class="tile-more-content no-padding">
								<div class="tiles blue">
									<div class="tile-footer drag">
										Sort <i class="fa fa-chevron-right"></i> <span class="semi-bold">Sort Properties</span>
									</div>
									<div class="docket-body">

										<div>
											Options
											<select id="options-num">
												<option value="2">2</option>
												<option value="3">3</option>
												<option value="4">4</option>
												<option value="5">5</option>
												<option value="6">6</option>
												<option value="7">7</option>
												<option value="8">8</option>
											</select>
										</div>

										<div class="m-b-10">
											Marks
											<input id="marks" type="text" value="{{marks}}" class="form-control" >
										</div>

										<div class=" inline colors">
											Background Color
											<input type="hidden" id="bg-color" data-opacity="{{bg_opacity}}" class="color-picker" value={{bg_color}}>
										</div>

										<div class="textProp slider success">
												Height 
												<input type="text" id="sort-height" class="height" data-slider-max="100" data-slider-min="40" data-slider-step="5" data-slider-value="{{height}}" data-slider-orientation="horizontal" data-slider-selection="before" style="width:85%">

										</div>


									</div>
								</div>
							</div>' 



			# view events
			events :
				'change select#options-num': '_changeOptionNumber'
				'blur input#marks' : '_changeMarks'


			onShow:->
				#initialize dropdowns
				@$el.find('select#options-num').select2
							minimumResultsForSearch: -1
				@$el.find('select#options-num').select2 'val', @model.get 'optioncount'
				

			

				# initialize colorpicker for background color and set the on change event
				@$el.find('#bg-color.color-picker').minicolors
						animationSpeed: 200
						animationEasing: 'swing'
						control: 'hue'
						position: 'top right'
						showSpeed: 200
						opacity :true
						change :(hex,opacity)=>
								@model.set 'bg_color', hex
								@model.set 'bg_opacity', opacity


				# initialize sort height to use slider plugin
					@$el.find('#sort-height.height').slider()
					# listen to slide event of slider
					# on slide change the model
					@$el.find('#sort-height.height').slider().on 'slide',=>
							# on click of slider , value set to null
							# resolved with this
							height = @model.get 'height'
							@model.set 'height', @$el.find('#sort-height.height').slider('getValue').val()||height
		


			# function for changing model on change of marks dropbox
			_changeMarks:(evt)->
				if not isNaN $(evt.target).val()
					@model.set 'marks', parseInt $(evt.target).val()
	

			_changeOptionNumber:(evt)->
					@model.set 'optioncount',parseInt $(evt.target).val()





				