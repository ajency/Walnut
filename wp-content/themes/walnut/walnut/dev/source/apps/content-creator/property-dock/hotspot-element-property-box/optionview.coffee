define ['app'
		'text!apps/content-creator/property-dock/hotspot-element-property-box/templates/optionview.html'],
		(App,Template)->

			App.module "ContentCreator.PropertyDock.HotspotElementPropertyBox.Views",
				(Views, App, Backbone, Marionette, $, _)->

					class Views.OptionView extends Marionette.ItemView

						template : Template

						onShow:->


							# TRANSPARENCY
							# check model for Transparency and initialize checkbox
							if @model.get 'transparent'

								@$el.find('#transparency-checkbox').prop('checked',true)

							#on click of checkbox set model transparent to true
							@$el.find('#transparency-checkbox').on 'change',=>
								console.log 'transparent changed'
								if @$el.find('#transparency-checkbox').prop 'checked'
									@model.set 'transparent', true
								else
									@model.set 'transparent',false


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
							@$el.find('#delete.btn-danger').on 'click',=>
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
							if @model.get 'correct'
								@$el.find("#correct-answer.radio input#yes").prop 'checked',true
							else
								@$el.find("#correct-answer.radio input#no").prop 'checked',true

							@$el.find('#correct-answer.radio input').on 'change',=>

									@model.set 'correct', @$el.find('#correct-answer.radio input:checked').val()=="yes" ? true : false

											





