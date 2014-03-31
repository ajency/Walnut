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

					               	</div>
				              	</div>
			            	</div>'

				onShow:->
					self = @	

					$('.fontSize').slider()

					$('#hotspot-textelement-fontfamily').children('option').each ->
					
						if $(@).text() is self.model.get 'fontFamily'
							@selected = true

								

					$('#hotspot-textelement-text').on 'input',=>
						@model.set "text", $('#hotspot-textelement-text').val()

					$('#hotspot-textelement-fontsize').slider().on 'slide',=>
						size = @model.get 'fontSize'
						@model.set 'fontSize', $('.fontSize').slider('getValue').val()||size
						# console.log $('.fontSize').slider('getValue').val()||size


					$('#hotspot-textelement-fontfamily').on 'change',->
						@.options[0].disabled = true
						self.model.set 'fontFamily', $('#hotspot-textelement-fontfamily  option:selected').text()
						
						
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
						
						

