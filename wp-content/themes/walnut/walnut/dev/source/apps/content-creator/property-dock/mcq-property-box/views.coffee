define ['app'
		'text!apps/content-creator/property-dock/mcq-property-box/templates/mcqpropview.html'],(App,Template)->

	App.module "ContentCreator.PropertyDock.McqPropertyBox.Views",
	(Views,App,Backbone,Marionette,$,_)->

		class Views.PropertyView extends Marionette.Layout

			template : 	Template

			ui : 
				individualMarksCheckbox : 'input#check-ind-marks'
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
				'change @ui.individualMarksCheckbox': '_changeIndividualMarks'
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
				else
					@ui.enableMultipleAnswersRadio.find("input#no").prop 'checked',true
					@model.set 'individual_marks',false
					@ui.individualMarksCheckbox.prop 'disabled',true

				if @model.get 'individual_marks'
					@ui.individualMarksCheckbox.prop 'checked',true
					@ui.marksTextbox.val(0).prop 'disabled',true
					@trigger "show:individual:marks:table"



			_changeMultipleCorrectAnswers:=>
				@model.set 'multiple', @ui.enableMultipleAnswersRadio.find('input:checked').val()=="yes" ? true : false
				if @model.get 'multiple'
					@$el.find('input#check-ind-marks').prop 'disabled',false
				

			_changeIndividualMarks:(evt)->
				if $(evt.target).prop 'checked'
					@model.set 'individual_marks', true
					@ui.marksTextbox.val(0).prop 'disabled',true
					@trigger "show:individual:marks:table"

				else
					@model.set 'individual_marks',false
					@ui.marksTextbox.prop('disabled',false).val @model.get 'marks'
					@trigger "hide:individual:marks:table"

			# function for changing model on change of marks dropbox
			_changeMarks:(evt)->
					
					if not isNaN $(evt.target).val()
							@model.set 'marks', $(evt.target).val()


			_changeOptionNumber:(evt)->
					@model.set 'optioncount',parseInt $(evt.target).val()

			_changeColumnNumber:(evt)->
					@model.set 'columncount',parseInt $(evt.target).val()





				