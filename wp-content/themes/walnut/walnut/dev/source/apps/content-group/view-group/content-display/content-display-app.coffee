define ['app'
		'controllers/region-controller'
		'text!apps/content-group/view-group/content-display/templates/content-display.html'], (App, RegionController, contentDisplayItemTpl)->

	App.module "CollectionContentDisplayApp.Controller", (Controller, App)->

		class Controller.CollectionContentDisplayController extends RegionController

			initialize : (opts)->

				{model} = opts
				{@module} = opts
				
				groupContentCollection= App.request "get:content:pieces:by:ids", model.get 'content_pieces'
				questionResponseCollection = App.request "get:question:response:collection", 
													'division' : 3
													'collection_id' : model.get 'id'

				@view= view = @_getCollectionContentDisplayView model, groupContentCollection, questionResponseCollection
				@show view, (loading:true, entities: [groupContentCollection,questionResponseCollection])

				@listenTo model, 'training:module:started', @trainingModuleStarted

				

			_getCollectionContentDisplayView :(model, collection, responseCollection) =>
				new ContentDisplayView 
					model: model
					collection: collection
					responseCollection: responseCollection
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

			serializeData:->
				data=super()

				responseCollection= Marionette.getOption @, 'responseCollection'
				data.responseQuestionIDs= responseCollection.pluck 'content_piece_id'
				console.log data.responseQuestionIDs

				data

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

