define ['app'
		'controllers/region-controller'
		'text!apps/content-group/view-group/content-display/templates/content-display.html'], (App, RegionController, contentDisplayItemTpl)->

	App.module "CollectionContentDisplayApp.Controller", (Controller, App)->

		class Controller.CollectionContentDisplayController extends RegionController

			initialize : (opts)->

				{@model} = opts

				#@groupContentCollection= App.request "get:content:pieces:of:group", @model.get 'id'
				
				@groupContentCollection= App.request "get:content:pieces:by:ids", @model.get 'content_pieces'
				
				App.execute "when:fetched", @groupContentCollection, @showView

			showView:=>
				@view= view = @_getCollectionContentDisplayView @model
				@show view, (loading:true, entities: [@groupContentCollection])

			_getCollectionContentDisplayView :(model) =>
				new ContentDisplayView 
					model: model
					collection: @groupContentCollection


		class ContentItemView extends Marionette.ItemView
			
			template 	: contentDisplayItemTpl

			tagName		: 'li'

			className 	: ''


		class ContentDisplayView extends Marionette.CompositeView

			template 	: '<ul class="cbp_tmtimeline"></ul>'

			itemView 	: ContentItemView

			itemViewContainer : 'ul.cbp_tmtimeline'

			className 	: 'col-md-10'

			id			: 'myCanvas-miki'

			onShow:->
				console.log @collection

		# set handlers
		App.commands.setHandler "show:viewgroup:content:displayapp", (opt = {})->
			new Controller.CollectionContentDisplayController opt		

