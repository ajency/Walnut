define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.McqPropertyBox.Views",
	(Views,App,Backbone,Marionette,$,_)->

		class Views.PropertyView extends Marionette.Layout

			template : '<div class="tile-more-content no-padding">
								<div class="tiles green">
									<div class="tile-footer drag">
										MCQ <i class="fa fa-chevron-right"></i> <span class="semi-bold">Multiple Choice Question Properties</span>
									</div>
									<div class="docket-body">

										<div id="multiple-answer" class="radio radio-success">Multiple right answers allowed?
											<input id="yes" type="radio" name="optionyes" value="yes">
											<label for="yes">Yes</label>
											<input id="no" type="radio" name="optionyes" value="no" checked="checked">
											<label for="no">No</label>
										</div>

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

										<div>
											Marks
											<select id="marks">
												<option value="1">1</option>
												<option value="2">2</option>	
											</select>
										</div>

										<div>
											<input id="check-ind-marks" type="checkbox" name="check-ind-marks"> set marks to individula options
										</div>

										<div id="individual-marks-region"></div>
									
									</div>
								</div>
							</div>' 

			regions : 
				'individualMarksRegion' : '#individual-marks-region'


			onShow:->
				#initialize dropdowns
				@$el.find('select#options-num, select#marks').selectpicker()
				@$el.find('select#options-num').selectpicker @model.get 'optioncount'
				@$el.find('select#marks').selectpicker @model.get 'marks'

				console.log @model

				# Multiple ANSWER
				if @model.get 'multiple'
					$("#multiple-answer.radio input#yes").prop 'checked',true
				else
					$("#multiple-answer.radio input#no").prop 'checked',true

				$('#multiple-answer.radio input').on 'change',@_multipleCorrectAnswers

				# @listenTo @model, 'change:multiple', @_changeMultipleAllowed #(model,multiple)=>
						# meta = @model.get 'meta_id'
						# console.log $('.mcq#mcq-'+meta+' .mcq-option input.mcq-option-select').attr 'type','checkbox'


				# individual marks


			events :
				'change select#options-num':(evt)->@trigger "change:option:number",$(evt.target).val()
				'change input#check-ind-marks': @_enableIndividualMarks

			modelEvents : 
				'change:multiple' : '_changeMultipleAllowed'

			_changeMultipleAllowed:(model,multiple)->
					meta = @model.get 'meta_id'
					console.log $('.mcq#mcq-'+meta+' .mcq-option input.mcq-option-select').attr 'type','checkbox'


			_multipleCorrectAnswers:=>
				@model.set 'multiple', $('#multiple-answer.radio input:checked').val()=="yes" ? true : false


			_enableIndividualMarks:(evt)->

				if $(evt.target).prop 'checked'

					@trigger "show:individual:marks:table"

				else
					@trigger "hide:individual:marks:table"





				