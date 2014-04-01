define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.HotspotElementPropertyBox.Views",
		(Views, App, Backbone, Marionette, $, _)->

			class Views.TextView extends Marionette.ItemView

				template : '<div class="tile-more-content no-padding">
								<div class="tiles green">
									<div class="tile-footer drag">
										Text Properties 
									</div>

									<div class="docket-body">

										<div class="form-group">
											<textarea id="hotspot-textelement-text" class="textarea" placeholder="Enter Text here" >{{text}}</textarea>
										</div>
										<div class="form-group">
											 <select class="font" id="hotspot-textelement-fontfamily">												
												<option value="1">Arial</option> 
												<option value="2">Calibri</option>
												<option value="3">Comic Sans MS</option>
												<option value="4">Courier</option>
												<option value="5">Georgia</option>
												<option value="6">Helvetica</option>
												<option value="7">Impact</option>
												<option value="8">Lucida Console</option>
												<option value="9">Lucida Sans Unicode</option>
												<option value="10">Tahoma</option>
												<option value="11">Times New Roman</option>
												<option value="12">Trebuchet MS</option>
												<option value="13">Verdana</option>
										    </select>
										</div>

										<div class="form-group">
											<div class="textProp slider success">
										      Size <input type="text" id="hotspot-textelement-fontsize" class="fontSize" data-slider-max="80" data-slider-step="1" data-slider-value="{{fontSize}}" data-slider-orientation="horizontal" data-slider-selection="before">
											</div>
										</div>

										<div class="form-group textFormat" data-toggle="buttons-checkbox">
											<div id="font-style" class="btn-group">
												<button id="bold-btn" class="btn"><i class="fa fa-bold"></i></button>
												<button id="italic-btn" class="btn"><i class="fa fa-italic"></i></button>
											</div>
										</div>

										<div class="form-group">
											Color  <input type="hidden" id="hidden-input" class="fontColor" value="#1a45a1">
										</div>

										
										<div class="form-group">
											<button type="button" id="delete" class="btn btn-danger btn-small">Delete</button>
										</div>

										<div class="form-group">
											Rotate <input type="text" class="dial" data-min="0" data-max="360"
											 data-width="40" data-height="40" data-displayInput=false data-thickness=".5"
											  data-fgColor="#0AA699" data-angleOffset="90" data-cursor=true>
										</div>

					               	</div>
				              	</div>
			            	</div>'

				onShow:->
					self = @	

					#FONT SIZE
					# initialize font size slider
					$('.fontSize').slider()

					# on change of font size do
					$('#hotspot-textelement-fontsize').slider().on 'slide',=>
						size = @model.get 'fontSize'
						@model.set 'fontSize', $('.fontSize').slider('getValue').val()||size


					# TEXT ROTATION
					# initialize the knob
					$('.dial').val self.model.get 'textAngle'
					$(".dial").knob
							change :(val)->
								self.model.set "textAngle",val
								


						

					# FONT COLOR
					# initialize colorpicker and set the on change event
					$('.fontColor').minicolors
							animationSpeed: 200
							animationEasing: 'swing'
							control: 'hue'
							position: 'top left'
							showSpeed: 200

							change :(hex,opacity)->
								self.model.set 'fontColor', hex

					# set the vale of color picker according to the current model
					$('.fontColor').minicolors 'value', self.model.get 'fontColor'


					# FONT FAMILY
					# initialize font family accorging to the model
					$('#hotspot-textelement-fontfamily').children('option').each ->
					
						if $(@).text() is self.model.get 'fontFamily'
							@selected = true

					# on change of font family
					$('#hotspot-textelement-fontfamily').on 'change',->
						@.options[0].disabled = true
						self.model.set 'fontFamily', $('#hotspot-textelement-fontfamily  option:selected').text()
						
								
					# TEXT
					# on change of text
					$('#hotspot-textelement-text').on 'input',=>
						@model.set "text", $('#hotspot-textelement-text').val()

					
					# BOLD and ITALICS
					$('#font-style.btn-group .btn').on 'click',->
						setTimeout ->
							console.log "timeout"
							if $('#font-style.btn-group #bold-btn.btn').hasClass('active')
							 	self.model.set 'fontBold', "bold"
							else
								self.model.set 'fontBold', ""
							if $('#font-style.btn-group #italic-btn.btn').hasClass('active')
								self.model.set 'fontItalics', "italic"
							else
								self.model.set 'fontItalics', ""
						,200
						
					#DELETE
					$('#delete.btn-danger').on 'click',=>
							@model.set 'toDelete', true
						

