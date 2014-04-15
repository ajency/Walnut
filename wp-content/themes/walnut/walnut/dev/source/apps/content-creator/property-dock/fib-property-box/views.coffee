define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.FibPropertyBox.Views",
	(Views,App,Backbone,Marionette,$,_)->

		class Views.PropertyView extends Marionette.ItemView

			template : '<div class="tile-more-content no-padding">
								<div class="tiles green">
									<div class="tile-footer drag">
										FIB<i class="fa fa-chevron-right"></i> <span class="semi-bold">Fill In The Blanks Properties</span>
									</div>
									<div class="docket-body">

										<div >Max Characters
											<input id="answer-max-length" type="type"  value="{{maxlength}}">											
										</div>

										<div>
											<input id="check-case-sensitive" type="checkbox" name="check-ind-marks"> Case Sensitive
										</div>

										<div>
											Font
											<select class="font" id="fib-font">
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
											  
											</select>
										</div>

										<div class="">
							        
											<div class="textProp slider success">
												Size 
												<input type="text" id="fib-fontsize" class="fontSize" data-slider-max="80" data-slider-max="12" data-slider-step="1" data-slider-value="{{font_size}}" data-slider-orientation="horizontal" data-slider-selection="before">

											</div>

										</div>

										<div>
											Marks
											<select id="marks">
												<option value="1">1</option>
												<option value="2">2</option>	
											</select>
										</div>

										
										<div class="form-group inline">
											Font-Color
											<input type="hidden" id="font-color" class="color-picker" value="{{color}}">
										</div>
										<div class="form-group inline">
											Background-Color
											<input type="hidden" id="bg-color" data-opacity="{{bg_opacity}}" class="color-picker" value={{bg_color}}>
										</div>
									
									</div>
								</div>
							</div>' 


			# view events 
			events : 
				'blur #answer-max-length' : '_changeMaxLength'
				'change input#check-case-sensitive': '_checkCaseSensitive'
				'change select#fib-font' : '_changeFont'

			onShow:(options)->

					#initialize Case Sensitive Checkbox based on model
					if @model.get 'case_sensitive'
							@$el.find('#check-case-sensitive').prop 'checked',true

					# initialize the dropdown to use select2 plugin
					$('#fib-font').select2
							minimumResultsForSearch: -1
					# initialize font dropdown based on model
					$('#fib-font').select2 'val',@.model.get 'font'
				
					# initialize font size to use slider plugin
					$('.fontSize').slider()

					# listen to slide event of slider
					# on slide change the model
					$('#fib-fontsize').slider().on 'slide',=>
							# on click of slider , value set to null
							# resolved with this
							size = @model.get 'font_size'
							@model.set 'font_size', $('.fontSize').slider('getValue').val()||size

					# initialize colorpicker for font color and set the on change event
					$('#font-color.color-picker').minicolors
							animationSpeed: 200
							animationEasing: 'swing'
							control: 'hue'
							position: 'top left'
							showSpeed: 200

							change :(hex,opacity)=>
									@model.set 'color', hex

					# initialize colorpicker for background color and set the on change event
					$('#bg-color.color-picker').minicolors
							animationSpeed: 200
							animationEasing: 'swing'
							control: 'hue'
							position: 'top right'
							showSpeed: 200
							opacity :true
							change :(hex,opacity)=>
									@model.set 'bg_color', hex
									@model.set 'bg_opacity', opacity


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


			# function for changing model on change of maxlength textbox
			_changeMaxLength:(evt)-> 
					# check if the value is a number
					if  not isNaN $(evt.target).val()
							console.log @model
							@model.set 'maxlength',$(evt.target).val()
							console.log @model










			




				