define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.ContentPiece", (ContentPiece, App, Backbone, Marionette, $, _)->
			

			# ContentPiece model
			class ContentPiece.ItemModel extends Backbone.Model

				idAttribute : 'ID'

				defaults:
					ID       		   	: ''
					post_title    		: ''
					creator 	       	: ''
					post_modified     	: ''
					post_date 			: ''
					post_tags 			: ''

				name: 'contentPiece'

			# ContentPiece collection class
			class ContentPiece.ItemCollection extends Backbone.Collection
				model : ContentPiece.ItemModel
				comparator : 'ID'
				url :->
					 AJAXURL + '?action=get-content-pieces'


			contentPieceCollection = new ContentPiece.ItemCollection

			# API 
			API = 
				# get all content pieces
				getContentPieces:(param = {})->
					console.log param
					contentPieceCollection.fetch
										reset : true
										data  : param

					contentPieceCollection


				getContentPieceByID:(id)->
					contentPiece = contentPieceCollection.get id

					if not contentPiece 
						contentPiece = new ContentPiece.ItemModel ID : id
						console.log contentPiece
						contentPiece.fetch()
					contentPiece


			# request handler to get all ContentPieces
			App.reqres.setHandler "get:content:pieces", (opt) ->
				API.getContentPieces(opt)

			App.reqres.setHandler "get:content:piece:by:id", (id)->
				API.getContentPieceByID id
