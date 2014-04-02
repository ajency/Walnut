define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.HotspotElementPropertyBox.Views",
		(Views, App, Backbone, Marionette, $, _)->

			class Views.OptionView extends Marionette.ItemView

				template : '<div class="tile-more-content no-padding">
								<div class="tiles green">
									<div class="tile-footer drag">
										Hotspot <i class="fa fa-chevron-right"></i> <span class="semi-bold">{{shape}} Element</span>
									</div>
									<div class="docket-body">

										<div id="correct-answer" class="radio radio-success">Is this correct?
											<input id="yes" type="radio" name="optionyes" value="yes">
											<label for="yes">Yes</label>
											<input id="no" type="radio" name="optionyes" value="no" checked="checked">
											<label for="no">No</label>
										</div>

										Marks 	<select class="marks">
													<option value="1">1</option>
													<option value="2">2</option>
												</select>

										<div class="form-group">
											Color  <input type="hidden" id="hidden-input" class="fontColor" value="#1a45a1">
										</div>

										<div id="transparency" class="checkbox check-success">
											<input id="checkbox3" type="checkbox" value="1">
											<label for="checkbox3">Set Transparent</label>
										</div>

										<div id="knob" class="form-group">
											Rotate <input type="text" class="dial" data-min="0" data-max="360"
											 data-width="40" data-height="40" data-displayInput=false data-thickness=".5"
											  data-fgColor="#0AA699" data-angleOffset="90" data-cursor=true>
										</div>



										<div class="form-group">
											<button type="button" id="delete" class="btn btn-danger btn-small">Delete</button>
										</div>

									</div>
								</div>
							</div>'

				onShow:->


					# TRANSPARENCY
					# check model for Transparency and initialize checkbox
					if @model.get 'transparent'
						$('#transparency.checkbox #checkbox3').prop('checked',true)

					#on click of checkbox set model transparent to true
					$('#transparency.checkbox').on 'change',=>
						if $('#transparency.checkbox').hasClass 'checked'
							@model.set 'transparent', true
						else
							@model.set 'transparent',false


					# COLOR
					# initialize colorpicker and set the on change event
					$('.fontColor').minicolors
							animationSpeed: 200
							animationEasing: 'swing'
							control: 'hue'
							position: 'top left'
							showSpeed: 200

							change :(hex,opacity)=>
								@model.set 'color', hex

					# set the vale of color picker according to the current model
					$('.fontColor').minicolors 'value', @model.get 'color'


					#DELETE
					$('#delete.btn-danger').on 'click',=>
							@model.set 'toDelete', true


					# Rect ROTATION
					# initialize the knob
					if @model.get('shape') is 'Rect'
						$('.dial').val @model.get 'angle'
						$(".dial").knob
								change :(val)=>
									@model.set "angle",val

					else 
						$('#knob').hide()


					# CORRECT ANSWER
					if @model.get 'correct'
						$("#correct-answer.radio input#yes").prop 'checked',true
					else
						$("#correct-answer.radio input#no").prop 'checked',true

					$('#correct-answer.radio input').on 'change',=>

							@model.set 'correct', $('#correct-answer.radio input:checked').val()=="yes" ? true : false

									





