define ['app'
		'controllers/region-controller'
		],(App,RegionController)->

			App.module "ContentCreator.HotspotProperties",(HotspotProperties, App, Backbone, Marionette, $, _)->

				class HotspotPropertiesController extends RegionController

					initialize :(options)->

						console.log "in hotspot properties"
						@view = @_getHotspotPropertiesView()

						@show @view


					_getHotspotPropertiesView:->
						new HotspotElementBoxView


				class HotspotElementBoxView extends Marionette.ItemView

					className : 'tile-more-content no-padding'

					template : '<div class="tiles green">
									<div class="tile-footer drag">
									  Hotspot Properties 
									</div>
									<div class="docket-body">
										<ul>
											<li data-element="circle">
												<a href="#" class="drag builder-element">
																	<i class="fa fa-circle-o"></i>
																</a>
											</li>
											<li data-element="square">
												<a href="#" class="drag builder-element">
																	<i class="fa fa-square-o"></i>
																</a>
											</li>
											<div class="clearfix"></div>
										</ul>
									 	
										</div>
									</div>'

					onShow:->
				
						@$el.find('*[data-element]').draggable
												connectToSortable	: '.droppable-column'
												helper 				: 'clone'
												delay 				: 5
												addClasses			: false
												distance 			: 5
												revert 				: 'invalid'


				App.commands.setHandler "show:hotspot:properties", (options)->
								console.log "hi"
								new HotspotPropertiesController
											region : options.region
