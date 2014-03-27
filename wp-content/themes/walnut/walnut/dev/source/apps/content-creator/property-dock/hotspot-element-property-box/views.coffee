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
										<option value="0">Select a Font</option>
										<option value="5">Arial</option> 
										<option value="3">Calibri</option>
										<option value="11">Comic Sans MS</option>
										<option value="7">Courier</option>
										<option value="2">Georgia</option>
										<option value="4">Helvetica</option>
										<option value="8">Impact</option>
										<option value="9">Lucida Console</option>
										<option value="10">Lucida Sans Unicode</option>
										<option value="12">Tahoma</option>
										<option value="1">Times New Roman</option>
										<option value="13">Trebuchet MS</option>
										<option value="13">Verdana</option>
								    </select>
								</div>

								<div class="form-group">
									<div class="textProp slider success">
								      Size <input type="text" id="hotspot-textelement-fontsize" class="fontSize" data-slider-max="80" data-slider-step="1" data-slider-value="{{fontSize}}" data-slider-orientation="horizontal" data-slider-selection="before">
									</div>
								</div>

								

			               	</div>
			              </div>
			            </div>'

				onShow:->

					$('.fontSize').slider();					

					$('#hotspot-textelement-text').on 'input',=>
						@model.set "text", $('#hotspot-textelement-text').val()

					$('#hotspot-textelement-fontsize').slider().on 'slide',=>
						size = @model.get 'fontSize'
						@model.set 'fontSize', $('.fontSize').slider('getValue').val()||size
						console.log $('.fontSize').slider('getValue').val()||size
						

						

