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

				name: 'content-piece'
		

			# ContentPiece collection class
			class ContentPiece.ItemCollection extends Backbone.Collection
				model : ContentPiece.ItemModel
				comparator : 'ID'
				name : 'content-piece'

				url :->
					 AJAXURL + '?action=get-content-pieces'


			contentPieceCollection = new ContentPiece.ItemCollection

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
					contentPieceCollection.fetch
										reset : true
										data  : param

					contentPieceCollection

				# get all content pieces belonging to particular group
				getContentPiecesOfGroup:(groupid = '')->
					if groupid

						contentGroup= App.request "get:content:group:by:id", groupid

						App.execute "when:fetched", contentGroup, =>
							contentIDs = contentGroup.get('content_pieces')
							
							for contentID in contentIDs
								contentModel = contentPieceCollection.get contentID

								if not contentModel
									contentModel = new ContentPiece.ItemModel 'ID' : contentID
									contentModel.fetch()

								contentPiecesOfGroup.add contentModel
					
							contentPiecesOfGroup

					contentPiecesOfGroup

				getContentPieceByID:(id)->
					contentPiece = contentPieceCollection.get id

					if not contentPiece 
						contentPiece = new ContentPiece.ItemModel ID : id
						contentPiece.fetch()
					contentPiece

				getContentPiecesByIDs:(ids = [])->
					contentPieces= new ContentPiece.ItemCollection 
					if _.size(ids) >0
						contentPieces.fetch
							data: 
								ids: ids
						contentPieces

				getContentPieceFromLocal:(ids)->
					console.log 'Ids: '+ids
					runQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql("SELECT * FROM wp_posts WHERE post_type = 'content-piece' 
									AND post_status = 'publish' AND ID in ("+ids+")", [], onSuccess(d), onFailure(d))

					onSuccess =(d)->
						(tx,data)->
							console.log 'Content piece success'
							result = []
							i = 0
							while i < data.rows.length
								r = data.rows.item(i)
								result[i] = 
									ID: r['ID']
									post_author: r['post_author']
									post_date: r['post_date']
									post_date_gmt: r['post_date_gmt']
									post_content: r['post_content']
									post_title: r['post_title']
									post_excerpt: r['post_excerpt']
									post_status: r['post_status']
									comment_status: r['comment_status']
									ping_status: r['ping_status']
									post_password: r['post_password']
									post_name: r['post_name']
									to_ping: r['to_ping']
									pinged: r['pinged']
									post_modified: r['post_modified']
									post_modified_gmt: r['post_modified_gmt']
									post_content_filtered: r['post_content_filtered']
									post_parent: r['post_parent']
									guid: r['guid']
									menu_order: r['menu_order']
									post_type: r['post_type']
									post_mime_type: r['post_mime_type']
									comment_count: r['comment_count']
									filter: 'raw'
									subjects: ''
									creator: 'admin'
									content_type: ''
								i++
							
							d.resolve(result)

					onFailure =(d)->
						(tx,error)->
							d.reject('OnFailure!: '+error)

					$.when(runQuery()).done (d)->
						console.log 'Content piece transaction completed'
					.fail (err)->
						console.log 'Error: '+err

							
						

			# request handler to get all ContentPieces
			App.reqres.setHandler "get:content:pieces", (opt) ->
				API.getContentPieces(opt)


			# request handler to get all ContentPieces
			App.reqres.setHandler "get:content:pieces:of:group", (groupid) ->
				API.getContentPiecesOfGroup(groupid)

			App.reqres.setHandler "get:content:piece:by:id", (id)->
				API.getContentPieceByID id

			App.reqres.setHandler "get:content:pieces:by:ids", (ids)->
				API.getContentPiecesByIDs ids

			# request handler to get all ContentPieces from local database
			App.reqres.setHandler "get:content-piece:local", (ids) ->
				API.getContentPieceFromLocal ids	
