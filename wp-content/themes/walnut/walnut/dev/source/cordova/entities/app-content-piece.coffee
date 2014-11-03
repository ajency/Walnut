define ['underscore', 'unserialize'], ( _) ->

	#Functions related to content-piece entity

	_.mixin

		
		cordovaContentPieceCollection : (ids)->

			defer = $.Deferred()

			result = []

			_.getContentPiecesByIDs(ids)
			.then (contentPieceData)->
				console.log 'getContentPiecesByIDs done'

				length = contentPieceData.rows.length

				if length is 0
					defer.resolve result
				else
					forEach = (row, i)->

						_.getPostAuthorName(row['post_author'])
						.then (author_name)->
							console.log 'getPostAuthorName done'

							_.getMetaValue(row['ID'])
							.then (meta_value)->
								console.log 'getMetaValue done'

								_.getGradingParams(row['ID'])
								.then (grading_params)->
									console.log 'getGradingParams done'

									_.getJsonToClone(meta_value.layout_json)
									.then (contentElements)->
										console.log 'getJsonToClone done'

										# 'contentElements' will return empty string for multiple eval
										# as layout_json is empty.
										if meta_value.question_type is 'multiple_eval'
											# Add grading params to excerpt for multiple eval
											if not _.isEmpty grading_params
												excerpt_array = []
												_.each grading_params, (params, i)->
													excerpt_array.push params['parameter']
													
													attributes = params['attributes']
													_.each attributes, (attr, i)->
														excerpt_array.push attr

										else
											# when question_type is individual or chorus  
											excerpt_array = contentElements.excerpt

										excerpt_array = _.flatten excerpt_array
										taglessArray = new Array
										_.each excerpt_array , (excerpt)->												
											taglessArray.push _(excerpt).stripTags()													
										
										excerpt = taglessArray.join ' | '
										excerpt= _(excerpt).prune(500)

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
											grading_params : grading_params


										i = i + 1
										if i < length
											forEach contentPieceData.rows.item(i), i
										else
											defer.resolve result


					forEach contentPieceData.rows.item(0), 0


			defer.promise()



		getContentPiecesByIDs : (ids)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				defer.resolve data
				

			_.db.transaction (tx)->

				tx.executeSql "SELECT * 
								FROM wp_posts 
								WHERE post_type=? 
								AND post_status=? 
								AND ID in ("+ids+")"
								, ['content-piece', 'publish']

				, onSuccess, _.transactionErrorHandler


			defer.promise()



		getPostAuthorName : (post_author_id) ->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				postAuthorName = ''

				if data.rows.length isnt 0
					postAuthorName = data.rows.item(0)['display_name']

				defer.resolve postAuthorName

			
			_.db.transaction (tx)->

				tx.executeSql "SELECT display_name 
								FROM wp_users 
								WHERE ID=?" 
								, [post_author_id]

				, onSuccess, _.transactionErrorHandler


			defer.promise()
			

		
		getGradingParams : (post_id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				gradingParams = []

				length = data.rows.length

				if length is 0
					defer.resolve gradingParams
				else
					forEach = (row, i)->

						attributes = _.unserialize(row['meta_value'])

						gradingParams[i] = 
							id : row['meta_id']
							parameter : row['meta_key'].replace('parameter_', '')
							attributes : attributes


						i = i + 1
						if i < length
							forEach data.rows.item(i), i
						else
							defer.resolve gradingParams


					forEach data.rows.item(0), 0

			
			_.db.transaction (tx)->

				pattern = '%parameter_%'

				tx.executeSql "SELECT * 
								FROM wp_postmeta 
								WHERE post_id=? 
								AND meta_key 
								LIKE '"+pattern+"'"
								, [post_id]

				, onSuccess, _.transactionErrorHandler


			defer.promise()


