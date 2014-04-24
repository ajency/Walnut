define ['app'
		'text!apps/content-creator/property-dock/mcq-property-box/templates/mcqpropview.html'],(App,Template)->

	App.module "ContentCreator.PropertyDock.McqPropertyBox.Views",
	(Views,App,Backbone,Marionette,$,_)->

		class Views.PropertyView extends Marionette.Layout

			template : 	Template

			# defining regions of the layout view
			regions : 
				'individualMarksRegion' : '#individual-marks-region'


			# view events
			events :
				'change select#options-num': '_changeOptionNumber'
				'change select#column-num': '_changeColumnNumber'
				'change input#check-ind-marks': '_enableIndividualMarks'
				'change select#marks' : '_changeMarks'
				'change #multiple-answer.radio'  : '_multipleCorrectAnswers'

			# # events of the views model
			# modelEvents : 
			# 	'change:multiple' : '_changeMultipleAllowed'

			onShow:->
				#initialize dropdowns to not show search 
				@$el.find('select#options-num').select2
						minimumResultsForSearch: -1
				@$el.find('select#marks').select2
						minimumResultsForSearch: -1
				@$el.find('select#column-num').select2
						minimumResultsForSearch: -1

				# initialize  dropdown based on model
				@$el.find('select#options-num').select2 'val', @model.get 'optioncount'
				@$el.find('select#column-num').select2 'val', @model.get 'columncount'
				@$el.find('select#marks').select2 'val', @model.get 'marks'


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

			_changeColumnNumber:(evt)->
					@model.set 'columncount',parseInt $(evt.target).val()





				