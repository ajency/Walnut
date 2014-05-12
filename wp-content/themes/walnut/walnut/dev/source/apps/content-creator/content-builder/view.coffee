define ['app'],(App)->

	App.module "ContentCreator.ContentBuilder.Views", (Views, App)->

		class Views.ContentBuilderView extends Marionette.ItemView

			template : '<div class="tiles blue p-l-15 p-r-15">
      						<div class="tiles-body no-border">
      							<div class="row">
      				                <div class="col-md-2 col-sm-2">
      				                	<h4 class="text-white m-t-0 m-b-0 semi-bold time"> <i class="fa fa-clock-o"></i> 3m15s</h4>
      				                </div>
      				                <div class="col-md-2 col-sm-2 text-center">
      				                  <h4 class="text-white m-t-0 m-b-0  time"> Marks: <span class="semi-bold">25</span></h4>
      				                </div>
      				                <div class="col-md-2 col-sm-2 text-center">
      				                  <!--<a href="#" class="hashtags transparent"> <i class="fa fa-eye"></i> Answer </a>-->
      				                </div>
      				                <div class="col-md-2 col-sm-2 text-center">
      				                  <a href="#" class="hashtags transparent"> <i class="fa fa-lightbulb-o"></i> Hint </a>
      				                </div>
      				                <div class="col-md-2 col-sm-2 text-center">
      				                  <a href="#" class="hashtags transparent"> <i class="fa fa-forward"></i> Skip </a>
      				                </div>
      				                <div class="col-md-2 col-sm-2 text-center">
      				                  <a href="#" class="hashtags transparent"> <i class="fa fa-check"></i> Done </a>
      				                </div>
      				            </div>
      				        </div>
      					</div><div id="myCanvas" class="droppable-column" height="300"></div>'


			onRender : ->
				@$el.attr 'id','site-page-content-region'


			onShow:->
				@$el.find('.droppable-column').sortable
										revert 		: 'invalid'
										items 		: '> .element-wrapper'
										connectWith : '.droppable-column,.column'
										start 		: (e, ui)->
														ui.placeholder.height ui.item.height()
														window.dragging = true
														return
										stop 		:(e, ui)-> 
														window.dragging = false
														return
										handle 		: '.aj-imp-drag-handle'
										helper 		: 'clone'
										opacity		: .65
										receive		: (evt, ui)=> 
											# trigger drop event if ui.item is Li tag
											if ui.item.prop("tagName") is 'LI'
												type  = ui.item.attr 'data-element'
												@trigger "add:new:element", $(evt.target), type
												