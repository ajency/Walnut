define ['app'
		'controllers/region-controller'
		'text!apps/content-group/edit-group/content-display/templates/content-display.html'], (App, RegionController, contentDisplayItemTpl)->

	App.module "CollectionContentDisplayApp.Controller", (Controller, App)->

		class Controller.CollectionEditContentDisplayController extends RegionController

			initialize : (opts)->
				{@model} = opts
				
				@groupContentCollection= App.request "get:content:pieces:of:group", @model.get 'id'

				@view= view = @_getCollectionContentDisplayView @model, @groupContentCollection

				@show view, (loading:true)

				@listenTo @groupContentCollection, 'content:pieces:of:group:added', @contentPiecesChanged

				@listenTo @groupContentCollection, 'content:pieces:of:group:removed', @contentPiecesChanged

				@listenTo view, 'changed:order', @saveContentPieces



			contentPiecesChanged:=>
				contentIDs= @groupContentCollection.pluck 'ID'
				@saveContentPieces contentIDs

			saveContentPieces:(contentIDs)=>				
				@model.set('content_pieces',contentIDs) 
				@model.save({'changed':'content_pieces'}, {wait : true})

			_getCollectionContentDisplayView :(model,collection) ->
				new ContentDisplayView 
					model: model
					collection: collection


		class ContentItemView extends Marionette.ItemView
			
			template 	: contentDisplayItemTpl

			tagName		: 'li'

			className 	: 'sortable'


			onShow:->
				@$el.attr 'id', @model.get 'ID'



		class ContentDisplayView extends Marionette.CompositeView

			template 	: '<ul class="cbp_tmtimeline"></ul>'

			itemView 	: ContentItemView

			itemViewContainer : 'ul.cbp_tmtimeline'

			className 	: 'col-md-10'

			id			: 'myCanvas-miki'

			events	:
					'click .remove' : 'removeItem'

			onShow:->
				@$el.find(".cbp_tmtimeline").sortable()

				@$el.find ".cbp_tmtimeline" 
				.on  "sortstop", ( event, ui )=> 
					sorted_order= @$el.find(".cbp_tmtimeline")
									.sortable "toArray"

					@trigger "changed:order", sorted_order
				 

			removeItem:(e)=>
				id = $(e.target)
					.closest '.contentPiece'
					.attr 'data-id'

				@collection.remove id


		# set handlers
		App.commands.setHandler "show:editgroup:content:displayapp", (opt = {})->
			new Controller.CollectionEditContentDisplayController opt		

