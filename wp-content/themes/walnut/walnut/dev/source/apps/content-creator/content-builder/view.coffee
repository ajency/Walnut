define ['app'],(App)->

	App.module "ContentCreator.ContentBuilder.Views", (Views, App)->

		class Views.ContentBuilderView extends Marionette.ItemView

			template : '<div id="myCanvas" class="droppable-column" height="300"></div>'


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
												