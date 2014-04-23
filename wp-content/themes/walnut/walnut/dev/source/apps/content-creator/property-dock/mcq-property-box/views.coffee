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

										<div class="inline">
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

										<div class="inline">
											Marks
											<select id="marks">
												<option value="1">1</option>
												<option value="2">2</option>	
											</select>
										</div>

										<div>
											<input id="check-ind-marks" type="checkbox" name="check-ind-marks"> set marks to individual options
										</div>

										<div id="individual-marks-region"></div>
									
									</div>
								</div>
							</div>' 

			# defining regions of the layout view
			regions : 
				'individualMarksRegion' : '#individual-marks-region'


			# view events
			events :
				'change select#options-num': '_changeOptionNumber'
				'change input#check-ind-marks': '_enableIndividualMarks'
				'change select#marks' : '_changeMarks'
				'change #multiple-answer.radio'  : '_multipleCorrectAnswers'

			# # events of the views model
			# modelEvents : 
			# 	'change:multiple' : '_changeMultipleAllowed'

			onShow:->
				#initialize dropdowns
				@$el.find('select#options-num, select#marks').select2
							minimumResultsForSearch: -1
				@$el.find('select#options-num').select2 'val', @model.get 'optioncount'
				@$el.find('select#marks').select2 'val', @model.get 'marks'

				# initialize the dropdown to use select2 plugin for marks
				@$el.find('#marks').select2
						minimumResultsForSearch: -1
				# initialize font dropdown based on model
				@$el.find('#marks').select2 'val',@model.get 'marks'
			

				if @model.get 'individual_marks'
					@$el.find('#check-ind-marks').prop 'checked',true
					@trigger "show:individual:marks:table"

				# Multiple ANSWER
				if @model.get 'multiple'
					@$el.find("#multiple-answer.radio input#yes").prop 'checked',true
				else
					@$el.find("#multiple-answer.radio input#no").prop 'checked',true





			_changeMultipleAllowed:(model,multiple)->
					meta = @model.get 'meta_id'
					if multiple
						$('.mcq#mcq-'+meta+' .mcq-option input.mcq-option-select').attr 'type','checkbox'

					else
						$('.mcq#mcq-'+meta+' .mcq-option input.mcq-option-select').attr 'type','radio'


			_multipleCorrectAnswers:=>
				@model.set 'multiple', @$el.find('#multiple-answer.radio input:checked').val()=="yes" ? true : false


			_enableIndividualMarks:(evt)->
				if $(evt.target).prop 'checked'
					@model.set 'individual_marks', true
					@trigger "show:individual:marks:table"

				else
					@model.set 'individual_marks',false
					@trigger "hide:individual:marks:table"

			# function for changing model on change of marks dropbox
			_changeMarks:(evt)->
					@model.set 'marks', $(evt.target).val()

			_changeOptionNumber:(evt)->
					@model.set 'optioncount',parseInt $(evt.target).val()





				