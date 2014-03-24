define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.HotspotElementBox.Views",(Views,App)->

		class Views.HotspotElementBoxView extends Marionette.ItemView

			template : '<div class="tile-more-content no-padding">
							<div class="tiles green">
								<div class="tile-footer drag">
									Hotspot Properties 
								</div>
								<div class="docket-body">
									<ul>
										<li class="hotspot-elements hotspotable" data-element="Hotspot-Circle">
											<a href="#" class="drag builder-element">
																<i class="fa fa-circle-o"></i>
															</a>
										</li>
										<li class="hotspot-elements hotspotable" data-element="Hotspot-Rectangle">
											<a href="#" class="drag builder-element">
																<i class="fa fa-square-o"></i>
															</a>
										</li>
										<li data-element="Image" class="hotspot-elements hotspotable">
											<a href="#" class="drag builder-element" >
												<i class="fa fa-camera"></i>
											</a>
										</li>
										<div class="clearfix"></div>
									</ul>
								 	
								</div>
							</div>
						</div>'

			onShow : ->

					@$el.find('.hotspot-elements').draggable
									# connectToSortable	: '.droppable-column'
									helper 				: 'clone'
									delay 				: 5
									addClasses			: false
									distance 			: 5
									revert 				: 'invalid'