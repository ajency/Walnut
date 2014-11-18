define ["app", 'backbone'], (App, Backbone) ->
	App.module "Entities.ContentPiece", (ContentPiece, App, Backbone, Marionette, $, _)->

		# ContentPiece model
		class ContentPiece.ItemModel extends Backbone.Model

			idAttribute : 'ID'

			defaults :
				post_title : ''
				post_author : ''
				post_author_name : ''
				post_modified : ''
				post_date : ''
				post_tags : ''
				order : ''

			name : 'content-piece'
			
			# getMarks:->

			#     layout= @.get 'layout'
				
			#     marks = parseFloat _.compact _.pluck(layout,'marks')
			#             .toFixed 1

			#     marks = parseFloat marks # removes the unnecessary decimal incase of 40.0 

			#     marks=0 if not marks or _.isNaN parseInt marks

			#     marks

			setMarks:(multiplicationFactor)->

				@.set 'marks'               : multiplicationFactor * @.get 'marks'
				@.set 'multiplicationFactor': multiplicationFactor

				@

		# ContentPiece collection class
		class ContentPiece.ItemCollection extends Backbone.Collection
			model : ContentPiece.ItemModel
			comparator : 'order'
			name : 'content-piece'
			url : ->
				AJAXURL + '?action=get-content-pieces'

		contentPiecesRepository= new ContentPiece.ItemCollection

		# collection of content pieces in a content group. eg. questions in a quiz
		class ContentPiece.GroupItemCollection extends Backbone.Collection
			model : ContentPiece.ItemModel
			comparator : 'order'
			name : 'content-piece'
			initialize : ->
				console.log 'content piece '
				@on('remove', @removedModel, @)
				@on('add', @addedPieces, @)

			removedModel : (model)=>
				@trigger "content:pieces:of:group:removed", model

			addedPieces : (model)=>
				@trigger "content:pieces:of:group:added", model


		# API
		API =
		# get all content pieces
			getContentPieces : (param = {})->
				contentPieceCollection = new ContentPiece.ItemCollection
				
				contentPieceCollection.fetch
					add : true
					remove : false
					data : param
					type : 'post'
					success:(resp)-> 
						if not param.search_str
							
							contentPiecesRepository.reset resp.models

				contentPieceCollection

		# get all content pieces belonging to particular group
			getContentPiecesOfGroup : (groupModel)->
				contentPiecesOfGroup = new ContentPiece.GroupItemCollection

				contentIDs = groupModel.get('content_pieces')

				if contentIDs
					for contentID in contentIDs
						contentModel = new ContentPiece.ItemModel 'ID' : contentID
						contentModel.fetch()

						contentPiecesOfGroup.add contentModel

				contentPiecesOfGroup



			getContentPieceByID : (id)->
				contentPiece = contentPiecesRepository.get id

				if not contentPiece
					contentPiece = new ContentPiece.ItemModel ID : id
					contentPiece.fetch
						success:(resp)->contentPiecesRepository.add resp

				contentPiece

			getContentPiecesByIDs : (ids = [])->
				
				contentPieces = new ContentPiece.ItemCollection
				
				for id in ids
					model= contentPiecesRepository.get id
					if model
						contentPieces.add model
						ids = _.without ids, id

				if _.size(ids) > 0
					contentPieces.fetch
						add : true
						remove : false
						data :
							ids : ids

				contentPieces

			newContentPiece:->
				contentPiece = new ContentPiece.ItemModel

			emptyContentCollection:->
				contentPieces = new ContentPiece.ItemCollection


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

		App.reqres.setHandler "new:content:piece",->
			API.newContentPiece()

		App.reqres.setHandler "empty:content:pieces:collection",->
			API.emptyContentCollection()

		App.reqres.setHandler "get:content:pieces:repository",->
			contentPiecesRepository.clone()

		App.reqres.setHandler "app:reset:content:pieces:repository", (models)->
			contentPiecesRepository.reset models
