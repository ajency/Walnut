define ['underscore', 'unserialize'], ( _) ->

	#Functions related to content-piece entity

	_.mixin

		getContentPiecesByIDs : (ids)->
				
			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_posts WHERE post_type=? AND post_status=? 
							AND ID in ("+ids+")", ['content-piece', 'publish']
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx,data)->
					result = []

					for i in [0..data.rows.length-1] by 1

						row = data.rows.item(i)

						do(row, i)->
							postAuthorName = _.getPostAuthorName(row['post_author'])
							postAuthorName.done (author_name)->

								do(row, i, author_name)->
									metaValue = _.getMetaValue(row['ID'])
									metaValue.done (meta_value)->

										do(row, i, author_name, meta_value)->
											gradingParams = _.getGradingParams(row['ID'])
											gradingParams.done (grading_params)->

												do(row, i, author_name, meta_value, grading_params)->

													if(meta_value.layout_json)
														
														contentElementsArray = _.getJsonToClone(meta_value.layout_json)
														contentElementsArray.done (contentElements)->

															_.mixin(_.str.exports());
															excerpt_array = contentElements.excerpt

															#pushes the parameter and attributes values to excerpt_array
															if not _.isEmpty grading_params
																_.each grading_params, (params, i)->
																	excerpt_array.push params['parameter']
																	
																	attributes = params['attributes']
																	_.each attributes, (attr, i)->
																		excerpt_array.push attr


															excerpt_array = _.flatten excerpt_array
															taglessArray = new Array
															_.each excerpt_array , (excerpt)->												
																taglessArray.push _(excerpt).stripTags()													
															
															excerpt = taglessArray.join ' | '
															excerpt= _(excerpt).prune(550)

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
																
						
					d.resolve(result)

			$.when(runQuery()).done (d)->
				console.log 'getContentPiecesByIDs transaction completed'
			.fail _.failureHandler



		getPostAuthorName : (post_author_id) ->

			postAuthorName = ''
			
			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT display_name FROM wp_users WHERE ID=?" 
							, [post_author_id], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					if data.rows.length isnt 0
						postAuthorName = data.rows.item(0)['display_name']

					d.resolve postAuthorName
					
			$.when(runQuery()).done ->
				console.log 'getPostAuthorName transaction completed'
			.fail _.failureHandler


		
		getGradingParams : (post_id)->

			pattern = '%parameter_%'

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_postmeta WHERE post_id=? AND meta_key 
							LIKE '"+pattern+"'", [post_id], onSuccess(d), _.deferredErrorHandler(d))


			onSuccess = (d)->
				(tx, data)->

					gradingParams = []

					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)

						do(row, i)->

							attributes = ''
							attributes = unserialize(row['meta_value']) if row['meta_value'] isnt ''

							result = 
								id : row['meta_id']
								parameter : row['meta_key'].replace('parameter_', '')
								attributes : attributes

							gradingParams[i] = result

					d.resolve gradingParams

			$.when(runQuery()).done ->
				console.log 'getGradingParams transaction completed'
			.fail _.failureHandler