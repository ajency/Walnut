define ['app'
		'controllers/region-controller'
		'text!apps/content-group/edit-group/content-display/templates/content-display.html'], (App, RegionController, contentDisplayItemTpl)->

	App.module "CollectionContentDisplayApp.Controller", (Controller, App)->

		class Controller.CollectionContentDisplayController extends RegionController

			initialize : (opts)->
				{@model} = opts
				console.log @model
				@groupContentCollection= App.request "get:content:pieces:of:group", @model.get 'id'

				@view= view = @_getCollectionContentDisplayView @model, @groupContentCollection

				@show view, (loading:true)


			_getCollectionContentDisplayView :(model,collection) ->
				new ContentDisplayView 
					model: model
					collection: collection


		class ContentItemView extends Marionette.ItemView
			
			template 	: contentDisplayItemTpl

			tagName		: 'li'

			className 	: 'sortable'


		class ContentDisplayView extends Marionette.CompositeView

			template 	: '<ul class="cbp_tmtimeline"></ul>'

			itemView 	: ContentItemView

			itemViewContainer : 'ul.cbp_tmtimeline'

			className 	: 'col-md-10'

			id			: 'myCanvas-miki'

		# set handlers
		App.commands.setHandler "show:viewgroup:content:displayapp", (opt = {})->
			new Controller.CollectionContentDisplayController opt		

