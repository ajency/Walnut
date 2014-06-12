define ["app", 'backbone'], (App, Backbone) ->
	App.module "Entities.ContentPiece", (ContentPiece, App, Backbone, Marionette, $, _)->

		# ContentPiece model
		class ContentPiece.ItemModel extends Backbone.Model

			idAttribute: 'ID'

			defaults:
				ID: 0
				post_title: ''
				post_author: ''
				post_author_name: ''
				post_modified: ''
				post_date: ''
				post_tags: ''
				order   : ''

			name: 'content-piece'


		# ContentPiece collection class
		class ContentPiece.ItemCollection extends Backbone.Collection
			model: ContentPiece.ItemModel
			comparator: 'order'
			name: 'content-piece'

			url: ->
				AJAXURL + '?action=get-content-pieces'


		# collection of content pieces in a content group. eg. questions in a quiz
		class ContentPiece.GroupItemCollection extends Backbone.Collection
			model: ContentPiece.ItemModel
			comparator: 'order'

			initialize: ->
				console.log 'content piece '
				@on('remove', @removedModel, @)
				@on('add', @addedPieces, @)

			removedModel: (model)=>
				@trigger "content:pieces:of:group:removed", model

			addedPieces: (model)=>
				@trigger "content:pieces:of:group:added", model



		# API
		API =
		# get all content pieces
			getContentPieces: (param = {})->
				contentPieceCollection = new ContentPiece.ItemCollection
				contentPieceCollection.fetch
					reset: true
					add: true
					remove: false
					data: param
				contentPieceCollection

		# get all content pieces belonging to particular group
			getContentPiecesOfGroup: (groupModel)->

				contentPiecesOfGroup = new ContentPiece.GroupItemCollection

				contentIDs = groupModel.get('content_pieces')

				if contentIDs
					for contentID in contentIDs
						contentModel = new ContentPiece.ItemModel 'ID': contentID
						contentModel.fetch()

						contentPiecesOfGroup.add contentModel

				contentPiecesOfGroup



			getContentPieceByID: (id)->
				contentPiece = contentPieceCollection.get id if contentPieceCollection?

				if not contentPiece
					contentPiece = new ContentPiece.ItemModel ID: id
					contentPiece.fetch()
				contentPiece

			getContentPiecesByIDs: (ids = [])->
				contentPieces = new ContentPiece.ItemCollection
				if _.size(ids) > 0
					contentPieces.fetch
						data:
							ids: ids

#                    App.execute "when:fetched", contentPieces,=>
#                      for model in contentPieces.models
#                        model.set 'order': _.indexOf(ids,(model.id).toString())

				contentPieces


			#get all content pieces from local database
			getContentPieceFromLocal:(ids)->

				getPostAuthorName = (post_author_id) ->

					postAuthorName = ''
					
					runQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql("SELECT display_name FROM wp_users WHERE ID=?" 
									, [post_author_id], success(d), _.deferredErrorHandler(d))

					success = (d)->
						(tx, data)->
							if data.rows.length isnt 0
								postAuthorName = data.rows.item(0)['display_name']

							d.resolve postAuthorName
							
					$.when(runQuery()).done ->
						console.log 'getPostAuthorName transaction completed'
					.fail _.failureHandler

				
				# get data from wp_posts
				runMainQuery = ->
					$.Deferred (d)->
						_.db.transaction (tx)->
							tx.executeSql("SELECT * FROM wp_posts WHERE post_type = 'content-piece' 
								AND post_status = 'publish' AND ID in ("+ids+")", []
								, onSuccess(d), _.deferredErrorHandler(d))

				onSuccess = (d)->
					(tx,data)->
						result = []

						for i in [0..data.rows.length-1] by 1

							row = data.rows.item(i)

							do(row, i)->
								postAuthorName = getPostAuthorName(row['post_author'])
								postAuthorName.done (author_name)->

									do(row, i, author_name)->
										metaValue = _.getMetaValue(row['ID'])
										metaValue.done (meta_value)->

											do(row, i, author_name, meta_value)->
												if(meta_value.layout_json)
													
													contentElementsArray = _.getJsonToClone(meta_value.layout_json)
													contentElementsArray.done (contentElements)->

														_.mixin(_.str.exports());
														excerpt_array= contentElements.excerpt
														excerpt_array = _.flatten excerpt_array
														taglessArray = new Array
														_.each excerpt_array , (excerpt)->												
															taglessArray.push _(excerpt).stripTags()													
														
														excerpt = taglessArray.join ' | '
														excerpt= _(excerpt).prune(150)

														result[i] = 
															ID: row['ID']
															post_author: row['post_author']
															post_date: row['post_date']
															post_date_gmt: row['post_date_gmt']
															post_content: row['post_content']
															post_title: row['post_title']
															post_excerpt: excerpt
															post_status: row['post_status']
															comment_status: row['comment_status']
															ping_status: row['ping_status']
															post_password: row['post_password']
															post_name: row['post_name']
															to_ping: row['to_ping']
															pinged: row['pinged']
															post_modified: row['post_modified']
															post_modified_gmt: row['post_modified_gmt']
															post_content_filtered: row['post_content_filtered']
															post_parent: row['post_parent']
															guid: row['guid']
															menu_order: row['menu_order']
															post_type: row['post_type']
															post_mime_type: row['post_mime_type']
															comment_count: row['comment_count']
															filter: 'raw'
															post_author_name: author_name
															content_type: meta_value.content_type
															layout: contentElements.elements
															question_type: meta_value.question_type
															post_tags: meta_value.post_tags
															duration: meta_value.duration
															last_modified_by: meta_value.last_modified_by
															published_by: meta_value.published_by
															term_ids: meta_value.term_ids
															instructions: meta_value.instructions
															order: _.indexOf(ids, row['ID'].toString())
							
						d.resolve(result)

				$.when(runMainQuery()).done (d)->
					console.log 'getContentPieceFromLocal transaction completed'
				.fail _.failureHandler




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

		# request handler to get all ContentPieces from local database
		App.reqres.setHandler "get:content-piece:local", (ids) ->
			API.getContentPieceFromLocal ids