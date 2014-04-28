define ['app'
		'controllers/region-controller'
		'text!apps/content-group/view-group/content-display/templates/content-display.html'], (App, RegionController, contentDisplayItemTpl)->

	App.module "CollectionContentDisplayApp.Controller", (Controller, App)->

		class Controller.CollectionContentDisplayController extends RegionController

			initialize : (opts)->

				{@model} = opts
				{@module} = opts
				
				@groupContentCollection= App.request "get:content:pieces:by:ids", @model.get 'content_pieces'
				
				App.execute "when:fetched", @groupContentCollection, @showView

				@listenTo @model, 'training:module:started', @trainingModuleStarted

			showView:=>
				@view= view = @_getCollectionContentDisplayView @model
				@show view, (loading:true, entities: [@groupContentCollection])

			_getCollectionContentDisplayView :(model) =>
				new ContentDisplayView 
					model: model
					collection: @groupContentCollection
					module: @module

			trainingModuleStarted:=>
				@view.triggerMethod "apply:urls"

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

			

			onApplyUrls:->

				currentRoute=App.getCurrentRoute()

				url = '#'+currentRoute+'/'

				for item in @$el.find('li .contentPiece')

					itemurl = url+ $(item).attr 'data-id'

					$(item).find 'a'
					.attr 'href',itemurl



		# set handlers
		App.commands.setHandler "show:viewgroup:content:displayapp", (opt = {})->
			new Controller.CollectionContentDisplayController opt		

