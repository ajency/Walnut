define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.BigAnswerPropertyBox.Views",
	(Views,App,Backbone,Marionette,$,_)->

		class Views.PropertyView extends Marionette.ItemView

			template : '<div class="tile-more-content no-padding">
								<div class="tiles blue">
									<div class="tile-footer drag">
										BigAnswer<i class="fa fa-chevron-right"></i> <span class="semi-bold">Big Answer Properties</span>
									</div>
									<div class="docket-body">

									<!--	<div class="form-group">
											<div class="bootstrap-tagsinput"> 
												<input id="correct-answers" value="{{correctanswersFn}}" type="text" data-role="tagsinput" placeholder="Type Answer and press Enter" />
											</div>
										</div> -->

										<div class="checkbox check-success">
											<input id="check-case-sensitive" type="checkbox" name="check-ind-marks"> <label for="check-case-sensitive">Case Sensitive</label>
										</div>

										<div class="m-b-10">Max Characters
											<input id="answer-max-length" type="text"  value="{{maxlength}}" >											
										</div>
										
										<div class="m-b-10">
											Font
											<select class="font" id="biganswer-font">
											  <option value="Arial">
											    Arial
											  </option>
											  
											  <option value="Calibri">
											    Calibri
											  </option>
											  
											  <option value="Comic Sans MS">
											    Comic Sans MS
											  </option>
											  
											  <option value="Courier">
											    Courier
											  </option>
											  
											  <option value="Georgia">
											    Georgia
											  </option>
											  
											  <option value="Helvetica">
											    Helvetica
											  </option>
											  
											  <option value="Impact">
											    Impact
											  </option>
											  
											  <option value="Lucida Console">
											    Lucida Console
											  </option>
											  
											  <option value="Lucida Sans Unicode">
											    Lucida Sans Unicode
											  </option>
											  
											  <option value="Tahoma">
											    Tahoma
											  </option>
											  
											  <option value="Times New Roman">
											    Times New Roman
											  </option>
											  
											  <option value="Trebuchet MS">
											    Trebuchet MS
											  </option>
											  
											  <option value="Verdana">
											    Verdana
											  </option>

											  <option value="Chelsea Market">
											    Chelsea Market
											  </option>

											  <option value="Indie Flower">
											    Indie Flower
											  </option>

											  <option value="Just Another Hand">
											    Just Another Hand
											  </option>

											  <option value="Sacramento">
											    Sacramento
											  </option>
											  
											</select>
										</div>

										<div class="m-b-10 inline colors">
											Font Color
											<input type="hidden" id="font-color" class="color-picker" value="{{color}}">
										</div>

										<div class="">
							        
											<div class="textProp slider success">
												Font Size 
												<input type="text" id="biganswer-fontsize" class="fontSize" data-slider-max="60" data-slider-min="6" data-slider-step="1" data-slider-value="{{font_size}}" data-slider-orientation="horizontal" data-slider-selection="before" style="width:85%">

											</div>

										</div>					

										<div class="m-b-10">
											Blank Style
											<select id="biganswer-style">
												<option value="uline">Underline</option>
												<option value="box">Box</option>
												<option value="blank">Blank</option>		
											</select>
										</div>

										<div class="form-group inline colors">
											Blank Background
											<input type="hidden" id="bg-color" data-opacity="{{bg_opacity}}" class="color-picker" value={{bg_color}}>
										</div>

										<div>
											Marks
											<input id="marks" type="text" value="{{marks}}" class="form-control" >
										</div>	
									
									</div>
								</div>
							</div>' 


			# view events 
			events : 
				'blur #answer-max-length' : '_changeMaxLength'
				'change input#check-case-sensitive': '_checkCaseSensitive'
				'change select#biganswer-font' : '_changeFont'
				'blur input#marks' : '_changeMarks'
				'change select#biganswer-style' : '_changeStyle'
				# 'change input#correct-answers' : '_changeCorrectAnswers'

			# mixinTemplateHelpers:(data)->

			# 	data.correctanswersFn = ->
			# 		@correct_answers.toString()

			# 	console.log JSON.stringify data

			# 	data

			onShow:(options)->
					# @$el.find('input#correct-answers').tagsinput('refresh');
					# # @$el.find('input#correct-answers').tagsinput('input').val @model.get('correct_answers')



					#initialize Case Sensitive Checkbox based on model
					if @model.get 'case_sensitive'
							@$el.find('#check-case-sensitive').prop 'checked',true

					# initialize the dropdown to use select2 plugin
					@$el.find('#biganswer-font').select2
							minimumResultsForSearch: -1
					# initialize font dropdown based on model
					@$el.find('#biganswer-font').select2 'val',@.model.get 'font'

					

					# initialize the dropdown to use select2 plugin
					@$el.find('#biganswer-style').select2
							minimumResultsForSearch: -1
					# initialize font dropdown based on model
					@$el.find('#biganswer-style').select2 'val',@model.get 'style'
				
					# initialize font size to use slider plugin
					@$el.find('.fontSize').slider()
					# listen to slide event of slider
					# on slide change the model
					@$el.find('#biganswer-fontsize').slider().on 'slide',=>
							# on click of slider , value set to null
							# resolved with this
							size = @model.get 'font_size'
							@model.set 'font_size', @$el.find('.fontSize').slider('getValue').val()||size

					# initialize colorpicker for font color and set the on change event
					@$el.find('#font-color.color-picker').minicolors
							animationSpeed: 200
							animationEasing: 'swing'
							control: 'hue'
							position: 'top left'
							showSpeed: 200

							change :(hex,opacity)=>
									@model.set 'color', hex

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

			# # function for changing the correct answer array						
			# _changeCorrectAnswers:(evt)->
			# 		@model.set 'correct_answers',$(evt.target).val().split(',')
					
			# function for changing model on change of 
			# case sensitive checkbox
			_checkCaseSensitive:(evt)->
					if $(evt.target).prop 'checked'
						@model.set 'case_sensitive', true
						
					else
						@model.set 'case_sensitive',false


			# function for changing model on change of font dropbox
			_changeFont:(evt)-> 
					@model.set 'font', $(evt.target).val()

			# function for changing model on change of marks dropbox
			_changeMarks:(evt)->
					@model.set 'marks', $(evt.target).val()


			# function for changing model on change of maxlength textbox
			_changeMaxLength:(evt)-> 
					# check if the value is a number
					if  not isNaN $(evt.target).val()
							console.log @model
							@model.set 'maxlength',$(evt.target).val()
							console.log @model

			_changeStyle:(evt)->
					@model.set 'style',$(evt.target).val()










			




				