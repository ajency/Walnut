define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.HotspotElementBox.Views",(Views,App)->


		class Views.HotspotElementView extends Marionette.ItemView

			tagName : 'li'

			className : 'hotspot-elements hotspotable'

			template : '<a href="#" class="drag builder-element">
							<i class="fa {{icon}}"></i>
						</a>'

			onRender : ->

				@$el.attr 'data-element', @model.get 'element'


		class Views.HotspotElementBoxView extends Marionette.CompositeView

			template : '<div class="tile-more-content no-padding">
							<div class="tiles green">
								<div class="tile-footer drag">
									Hotspot Properties 
								</div>
								<div class="docket-body">
									<ul class="hotspot-elements-container">
										
										
									</ul>
								 	<div class="clearfix"></div>
								</div>
							</div>
						</div>'

						# <li class="hotspot-elements hotspotable" data-element="Hotspot-Circle">
						# 	<a href="#" class="drag builder-element">
						# 						<i class="fa fa-circle-o"></i>
						# 					</a>
						# </li>
						# <li class="hotspot-elements hotspotable" data-element="Hotspot-Rectangle">
						# 	<a href="#" class="drag builder-element">
						# 						<i class="fa fa-square-o"></i>
						# 					</a>
						# </li>
						# <li data-element="Image" class="hotspot-elements hotspotable">
						# 	<a href="#" class="drag builder-element" >
						# 		<i class="fa fa-camera"></i>
						# 	</a>
						# </li>

			itemView : Views.HotspotElementView

			itemViewContainer : 'ul.hotspot-elements-container'

			onShow : ->

					@$el.find('.hotspot-elements').draggable
									# connectToSortable	: '.droppable-column'
									helper 				: 'clone'
									delay 				: 5
									addClasses			: false
									distance 			: 5
									revert 				: 'invalid'