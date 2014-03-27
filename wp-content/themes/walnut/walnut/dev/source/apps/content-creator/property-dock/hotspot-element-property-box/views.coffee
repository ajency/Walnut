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
								        <option value="1">Times New Roman</option>
								        <option value="2">Georgia</option>
								        <option value="2">Helvetica</option>
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
						
						

