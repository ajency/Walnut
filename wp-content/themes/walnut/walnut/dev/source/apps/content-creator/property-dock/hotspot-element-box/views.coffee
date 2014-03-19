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
										<li>
											<a href="#" class="drag builder-element">
																<i class="fa fa-circle-o"></i>
															</a>
										</li>
										<li>
											<a href="#" class="drag builder-element">
																<i class="fa fa-square-o"></i>
															</a>
										</li>
										<div class="clearfix"></div>
									</ul>
								 	
								</div>
							</div>
						</div>'