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
							<div class="tiles blue">
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