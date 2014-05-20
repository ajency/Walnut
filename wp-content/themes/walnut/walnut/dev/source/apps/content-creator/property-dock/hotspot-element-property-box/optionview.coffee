define ['app'
		'text!apps/content-creator/property-dock/hotspot-element-property-box/templates/optionview.html'],
		(App,Template)->

			App.module "ContentCreator.PropertyDock.HotspotElementPropertyBox.Views",
				(Views, App, Backbone, Marionette, $, _)->

					class Views.OptionView extends Marionette.ItemView

						template : Template

						ui :
							individualMarksTextbox : '#individual-marks'

						events:
							'blur @ui.individualMarksTextbox' : '_changeIndividualMarks'

						initialize:(options)->
							@hotspotModel = options.hotspotModel

						onShow:->


						


							# COLOR
							# initialize colorpicker and set the on change event
							@$el.find('.fontColor').minicolors
									animationSpeed: 200
									animationEasing: 'swing'
									control: 'hue'
									position: 'top left'
									showSpeed: 200

									change :(hex,opacity)=>
										@model.set 'color', hex

							# set the vale of color picker according to the current model
							@$el.find('.fontColor').minicolors 'value', @model.get 'color'


							#DELETE
							@$el.find('#delete.text-danger').on 'click',=>
									@model.set 'toDelete', true


							# Rect ROTATION
							# initialize the knob
							if @model.get('shape') is 'Rect'
								@$el.find('.dial').val @model.get 'angle'
								@$el.find(".dial").knob
										change :(val)=>
											@model.set "angle",val

							else 
								@$el.find('#knob').hide()


							# CORRECT ANSWER
							@_initializeCorrectAnswer()
							

							@$el.find('#correct-answer.radio input').on 'change',=>

									@model.set 'correct', @$el.find('#correct-answer.radio input:checked').val()=="yes" ? true : false
									@_toggleMarks()
											
							# if not @hotspotModel.get 'enableIndividualMarks'
							# 	@_disableMarks()

							@ui.individualMarksTextbox.on 'change',->
								console.log 'marks cxhanged'



							@_toggleMarks()

							@listenTo @hotspotModel , 'change:enableIndividualMarks',@_toggleMarks

						_initializeCorrectAnswer:->
							if @model.get 'correct'
								@$el.find("#correct-answer.radio input#yes").prop 'checked',true
							else
								@$el.find("#correct-answer.radio input#no").prop 'checked',true
								
								

						_toggleMarks:(model,enableIndividualMarks)->

							if @hotspotModel.get('enableIndividualMarks') and @model.get 'correct'
								@_enableMarks()

							else 
								@model.set 'marks',0
								@ui.individualMarksTextbox.trigger 'change'							
								@_disableMarks()

						_disableMarks:->
							@ui.individualMarksTextbox.val 0
							@ui.individualMarksTextbox.prop 'disabled',true

						_enableMarks:->
							@ui.individualMarksTextbox.val @model.get 'marks'
							@ui.individualMarksTextbox.prop 'disabled',false

						_changeIndividualMarks:(evt)->
							if not isNaN $(evt.target).val()
									@model.set 'marks', parseInt $(evt.target).val()

						onBeforeClose:->
							@ui.individualMarksTextbox.trigger 'blur'
