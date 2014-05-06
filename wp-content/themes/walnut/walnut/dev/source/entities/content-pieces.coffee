define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.ContentPiece", (ContentPiece, App, Backbone, Marionette, $, _)->
			
			# ContentPiece model
			class ContentPiece.ItemModel extends Backbone.Model

				idAttribute : 'ID'

				defaults:
					ID       		   	: 0
					post_title    		: ''
					creator 	       	: ''
					post_modified     	: ''
					post_date 			: ''
					post_tags 			: ''

				name: 'content-piece'
		

			# ContentPiece collection class
			class ContentPiece.ItemCollection extends Backbone.Collection
				model : ContentPiece.ItemModel
				comparator : 'ID'
				url :->
					 AJAXURL + '?action=get-content-pieces'


			

			# collection of content pieces in a content group. eg. questions in a quiz
			class ContentPiece.GroupItemCollection extends Backbone.Collection
				model : ContentPiece.ItemModel
				comparator : 'ID'

				initialize:->
					@on('remove', @removedModel, @)
					@on('add', @addedPieces, @)

				removedModel:(model)=>
					@trigger "content:pieces:of:group:removed", model

				addedPieces:(model)=>
					@trigger "content:pieces:of:group:added", model

			
			contentPiecesOfGroup = new ContentPiece.GroupItemCollection

			# API 
			API = 
				# get all content pieces
				getContentPieces:(param = {})->
					contentPieceCollection = new ContentPiece.ItemCollection
					contentPieceCollection.fetch
										reset : true
										data  : param

					contentPieceCollection

				# get all content pieces belonging to particular group
				getContentPiecesOfGroup:(groupModel)->

					contentIDs=  groupModel.get('content_pieces')

					if contentIDs
						for contentID in contentIDs
							contentModel = contentPieceCollection.get contentID if contentPieceCollection?

							if not contentModel
								contentModel = new ContentPiece.ItemModel 'ID' : contentID
								contentModel.fetch()

							contentPiecesOfGroup.add contentModel

					contentPiecesOfGroup

					

				getContentPieceByID:(id)->
					contentPiece = contentPieceCollection.get id if contentPieceCollection?

					if not contentPiece 
						contentPiece = new ContentPiece.ItemModel ID : id
						contentPiece.fetch()
					contentPiece

				getContentPiecesByIDs:(ids = [])->
					if _.size(ids) >0
						contentPieces= new ContentPiece.ItemCollection 
						contentPieces.fetch
							data: 
								ids: ids
						contentPieces

			# request handler to get all ContentPieces
			App.reqres.setHandler "get:content:pieces", (opt) ->
				API.getContentPieces(opt)


			# request handler to get all ContentPieces
			App.reqres.setHandler "get:content:pieces:of:group", (groupModel) ->
				API.getContentPiecesOfGroup(groupModel)

			App.reqres.setHandler "get:content:piece:by:id", (id)->
				API.getContentPieceByID id

			App.reqres.setHandler "get:content:pieces:by:ids", (ids)->
				API.getContentPiecesByIDs ids
