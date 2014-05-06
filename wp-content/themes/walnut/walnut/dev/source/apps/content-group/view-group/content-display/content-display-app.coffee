define ['app'
		'controllers/region-controller'
		'text!apps/content-group/view-group/content-display/templates/content-display.html'], (App, RegionController, contentDisplayItemTpl)->

	App.module "CollectionContentDisplayApp.Controller", (Controller, App)->

		class Controller.CollectionContentDisplayController extends RegionController

			initialize : (opts)->

				{model, @mode, questionResponseCollection,groupContentCollection} = opts
				
				@view= view = @_getCollectionContentDisplayView model, groupContentCollection, questionResponseCollection
				@show view, (loading:true, entities: [groupContentCollection,questionResponseCollection])

				@listenTo model, 'training:module:started', @trainingModuleStarted

				@listenTo @view, 'view:question:readonly', (questionID)=> 
					@region.trigger 'goto:question:readonly', questionID

			_getCollectionContentDisplayView :(model, collection, responseCollection) =>
				new ContentDisplayView 
					model: model
					collection: collection
					responseCollection: responseCollection
					mode: @mode

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

			events:
				'click .cbp_tmlabel.completed'	: 'viewQuestionReadOnly'

			onShow:->
				responseCollection= Marionette.getOption @, 'responseCollection'
				responseQuestionIDs= responseCollection.pluck 'content_piece_id'

				if Marionette.getOption(@, 'mode') is 'training'
					for question in @$el.find '.contentPiece'
						$ question
						.find '.cbp_tmlabel'
						.addClass 'completed' 
						.css 'cursor','pointer'


				else
					for question in @$el.find '.contentPiece'
						if _.contains responseQuestionIDs, $(question).attr 'data-id'
							$ question
							.find '.cbp_tmlabel'
							.addClass 'done completed'
							.css 'cursor','pointer'

			viewQuestionReadOnly:(e)=>
				questionID= $ e.target
							.closest '.contentPiece'
							.attr 'data-id'

				@trigger "view:question:readonly",questionID

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

