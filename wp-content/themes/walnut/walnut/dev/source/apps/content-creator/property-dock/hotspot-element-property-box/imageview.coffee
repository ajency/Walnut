define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.HotspotElementPropertyBox.Views",
		(Views, App, Backbone, Marionette, $, _)->

			class Views.ImageView extends Marionette.ItemView

				template:'<div class="tile-more-content no-padding">
								<div class="tiles blue">
									<div class="tile-footer drag">
										Hotspot <i class="fa fa-chevron-right"></i> <span class="semi-bold">Image Element</span>
									</div>
									<div class="docket-body">


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

					# Image ROTATION
					# initialize the knob
					
					$('.dial').val @model.get 'angle'
					$(".dial").knob
							change :(val)=>
								@model.set "angle",val

					#DELETE
					$('#delete.btn-danger').on 'click',=>
							@model.set 'toDelete', true

					


