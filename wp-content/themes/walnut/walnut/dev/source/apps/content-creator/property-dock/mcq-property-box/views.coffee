define ['app'
		'text!apps/content-creator/property-dock/mcq-property-box/templates/mcqpropview.html'],(App,Template)->

	App.module "ContentCreator.PropertyDock.McqPropertyBox.Views",
	(Views,App,Backbone,Marionette,$,_)->

		class Views.PropertyView extends Marionette.Layout

			template : 	Template

			ui : 
				# individualMarksCheckbox : 'input#check-ind-marks'
				numberOfColumnsDropdown : 'select#column-num'
				numberOfOptionsDropdown : 'select#options-num'
				enableMultipleAnswersRadio : '#multiple-answer.radio'
				marksTextbox : 'input#marks'

			# defining regions of the layout view
			regions : 
				'individualMarksRegion' : '#individual-marks-region'


			# view events
			events :
				'change @ui.numberOfOptionsDropdown': '_changeOptionNumber'
				'change @ui.numberOfColumnsDropdown': '_changeColumnNumber'
				# 'change @ui.individualMarksCheckbox': '_changeIndividualMarks'
				'change @ui.marksTextbox' : '_changeMarks'
				'change @ui.enableMultipleAnswersRadio'  : '_changeMultipleCorrectAnswers'

			

			onShow:->
				#initialize dropdowns to not show search 
				@ui.numberOfOptionsDropdown.select2
						minimumResultsForSearch: -1		
				@ui.numberOfColumnsDropdown.select2
						minimumResultsForSearch: -1

				# initialize  dropdown based on model
				@ui.numberOfOptionsDropdown.select2 'val', @model.get 'optioncount'
				@ui.numberOfColumnsDropdown.select2 'val', @model.get 'columncount'

				# Multiple ANSWER
				if @model.get 'multiple'
					@ui.enableMultipleAnswersRadio.find("input#yes").prop 'checked',true
					@trigger "show:individual:marks:table"
					@ui.marksTextbox.prop 'disabled',true
					@_updateMarks()	
					
				else
					@ui.enableMultipleAnswersRadio.find("input#no").prop 'checked',true

				@$el.find('#individual-marks-region').on 'blur','input',(e)=>
					@_updateMarks()
					
			_updateMarks:->
				
				totalMarks = 0
				_.each @model.get('correct_answer') ,(option)=>
					totalMarks = totalMarks + parseInt @model.get('elements').get(option).get('marks')
				@model.set 'marks',totalMarks
				@ui.marksTextbox.val totalMarks

				# if @model.get 'individual_marks'
				# 	@ui.individualMarksCheckbox.prop 'checked',true
				# 	@ui.marksTextbox.val(0).prop 'disabled',true
					



			_changeMultipleCorrectAnswers:=>
				@model.set 'multiple', @ui.enableMultipleAnswersRadio.find('input:checked').val()=="yes" ? true : false
				if @model.get 'multiple'
					@trigger "show:individual:marks:table"
					@ui.marksTextbox.prop 'disabled',true
					@_updateMarks()

				

			# _changeIndividualMarks:(evt)->
			# 	if $(evt.target).prop 'checked'
			# 		@model.set 'individual_marks', true
			# 		@ui.marksTextbox.val(0).prop 'disabled',true
					

			# 	else
			# 		@model.set 'individual_marks',false
			# 		@ui.marksTextbox.prop('disabled',false).val @model.get 'marks'
			# 		@trigger "hide:individual:marks:table"

			# function for changing model on change of marks dropbox
			_changeMarks:(evt)->
					
					if not isNaN $(evt.target).val()
							@model.set 'marks', $(evt.target).val()



			_changeOptionNumber:(evt)->
					@model.set 'optioncount',parseInt $(evt.target).val()

			_changeColumnNumber:(evt)->
					@model.set 'columncount',parseInt $(evt.target).val()





				