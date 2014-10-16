define ['underscore', 'unserialize'], ( _) ->

	#Functions related to Quiz entity

	_.mixin

		getQuizByTextbookId : (textbookId)->

			runQuery = ->

				pattern = '%"'+textbookId+'"%'

				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_content_collection WHERE term_ids 
							LIKE '"+pattern+"' AND post_status IN ('publish', 'archive') AND 
							type=?", ['quiz'], onSuccess(d), _.deferredErrorHandler(d))

				
			onSuccess = (d)->
				(tx, data)->
					result = []


					for i in [0..data.rows.length-1] by 1

						row = data.rows.item(i)

						do (row, i)->
							collectionMeta = _.getCollectionMeta(row['id'])
							collectionMeta.done (collectionMetaData)->

								do(row, i, collectionMetaData)->
									dateAndStatus = _.getStartDateAndStatus(row['id'])
									dateAndStatus.done (dateStatus)->
										status = dateStatus.status
										attempts = dateStatus.attempts
										date = dateStatus.start_date
										
										result[i] = 
											id: row['id']
											name: row['name']
											created_on: row['created_on']
											created_by: row['created_by']
											last_modified_on: row['last_modified_on']
											last_modified_by: row['last_modified_by']
											published_on: row['published_on']
											published_by: row['published_by']
											post_status: row['post_status']
											type: row['type']
											term_ids: _.unserialize(row['term_ids'])
											duration: _.getDuration(row['duration'])
											minshours: _.getMinsHours(row['duration'])
											total_minutes: row['duration']
											description: ""
											permissions: collectionMetaData.permission
											instructions: collectionMetaData.instructions
											quiz_type: collectionMetaData.quizType
											marks: collectionMetaData.marks
											negMarksEnable: collectionMetaData.negMarksEnable
											negMarks: collectionMetaData.negMarks
											message: collectionMetaData.message
											content_layout: ""
											taken_on: date
											status: status
											attempts: attempts
											content_pieces: collectionMetaData.contentPieces

					
					d.resolve result
					
					

			$.when(runQuery()).done (data)->
				console.log 'getQuizByTextbookId transaction completed'
			.fail _.failureHandler


		getCollectionMeta : (collection_id)->

			deferreds = []

			result = quizType: '', contentPieces: '', instructions: '', permission:'', marks:''
					, negMarks: '', negMarksEnable: '', message: ''

			runQuery =->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_collection_meta WHERE collection_id=?"
							,[collection_id], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->
				(tx,data)->

					for i in [0..data.rows.length-1] by 1

						row = data.rows.item(i)

						do (row)->
							if row['meta_key'] is 'quiz_type'
								result.quizType = row['meta_value']

							if row['meta_key'] is 'description'
								description = _.unserialize(row['meta_value'])
								result.instructions = description.instruction

							if row['meta_key'] is 'permissions'
								result.permission = _.unserialize(row['meta_value'])

							if row['meta_key'] is 'quiz_meta'
								quiz_meta = _.unserialize(row['meta_value'])
								result.marks = quiz_meta.marks
								result.negMarks = quiz_meta.negMarks
								result.negMarksEnable = quiz_meta.negMarksEnable
								result.message = quiz_meta.message

							if row['meta_key'] is 'content_layout'
								def = _.getContentPiecesFromContentLayout(row['meta_value'])
								deferreds.push def
					
					if deferreds.length is 0
						d.resolve(result)
					else
						$.when(deferreds...).done (content_pieces...)->
							_.each content_pieces, (contentPiece)->
								result.contentPieces = contentPiece

							d.resolve(result)

			$.when(runQuery()).done ->
				console.log 'getCollectionMeta transaction completed'
			.fail _.failureHandler


		getContentPiecesFromContentLayout : (contentLayout)->

			content_pieces = []
			content_layout = _.unserialize(contentLayout)
			deferreds = []

			runFunc = ->

				$.Deferred (d)->

					_.each content_layout, (content, key)->

						do (content, content_pieces)->

							if content.type is "content-piece"
								if content.id
									content_pieces.push(parseInt(content.id))

							else if content.type is "content_set"
								def = _.generateSetItems(content, content_pieces)
								deferreds.push def

					if deferreds.length is 0
						d.resolve(content_pieces)
					else
						$.when(deferreds...).done (content_set_ids...)->
							_.each content_set_ids, (contentSetId, key)->
								content_pieces = content_pieces.concat(contentSetId)

							d.resolve(content_pieces)


			$.when(runFunc()).done ->
				console.log "getContentPiecesFromContentLayout done"
			.fail _.failureHandler


		#This function gets the ids for content sets
		generateSetItems : (content, content_pieces)->
			term_ids = content.data.terms_id
			level1 = parseInt(content.data.lvl1)
			level2 = parseInt(content.data.lvl2)
			level3 = parseInt(content.data.lvl3)
			complete_ids = []

			runFunc = ->

				$.Deferred (d)->

					getPostId = _.getIdFromPostMeta()
					getPostId.done (postIds)->

						getUniquePostId = _.getUniqueIdFromPostMeta(term_ids, postIds,content_pieces)
						getUniquePostId.done (uniquePostId)->
							uniquePostId =  uniquePostId.join()

							getIdFromLevel1 = _.checkForEachContentSetValue(uniquePostId, level1, '1')
							getIdFromLevel1.done (complete_ids_level1)->
								complete_ids = complete_ids.concat(complete_ids_level1)

								getIdFromLevel2 = _.checkForEachContentSetValue(uniquePostId, level2, '2')
								getIdFromLevel2.done (complete_ids_level2)->
									complete_ids = complete_ids.concat(complete_ids_level2)

									getIdFromLevel3 = _.checkForEachContentSetValue(uniquePostId, level3, '3')
									getIdFromLevel3.done (complete_ids_level3)->

										complete_ids = complete_ids.concat(complete_ids_level3)
										d.resolve(complete_ids)


			$.when(runFunc()).done ->
				console.log 'generateSetItems done'
			.fail _.failureHandler


		#This function will get all the ids for type student question and key content_type
		getIdFromPostMeta : ->

			runQuery = ->
				$.Deferred (d)->

					_.db.transaction (tx)->
						tx.executeSql("SELECT ID FROM wp_posts 
							WHERE ID IN (SELECT post_id FROM wp_postmeta WHERE meta_key='content_type'
							AND meta_value='student_question') 
							AND post_status = 'publish' ", [] 
							, onSuccess(d), _.deferredErrorHandler(d))
			
			onSuccess =(d)->
				postId = []

				(tx,data)->
					for i in [0..data.rows.length-1] by 1
						postId.push data.rows.item(i)['ID']

					d.resolve(postId)

			$.when(runQuery()).done ->
				console.log "getIdFromPostMeta transaction completed"
			.fail _.failureHandler


		#This function gets ids which are not present in the content_pieces
		#term_ids is the textbook or chapter or section or subsection id depending
		#on which is the last encountedred
		getUniqueIdFromPostMeta : (term_ids, postIds,content_pieces)->
			
			runQuery = ->
				
				$.Deferred (d)->
					difference = _.difference(postIds, content_pieces)
					difference =  difference.join()

					term_id = ''
					_.each term_ids, (val)->
						if val isnt ""
							term_id = val

					_.db.transaction (tx)->
						pattern = '%"'+term_id+'"%' 
						tx.executeSql("SELECT post_id FROM wp_postmeta 
							WHERE post_id IN ("+difference+") 
							AND meta_key='content_piece_meta' 
							AND meta_value LIKE '%"+pattern+"%' " 
							, [], onSuccess(d) , _.deferredErrorHandler(d))

			onSuccess =(d)->
				uniquePostId = []

				(tx, data)->
					for i in [0..data.rows.length-1] by 1

						uniquePostId.push data.rows.item(i)['post_id']

					d.resolve(uniquePostId)

			$.when(runQuery()).done ->
				console.log "getUniqueIdFromPostMeta transaction completed"
			.fail _.failureHandler


		#This function gets ids for each level in the content set
		#count is the level id in that content set
		#and value is the level number
		checkForEachContentSetValue : (uniquePostId, count, level)->

			runQuery = ->

				$.Deferred (d)->

					_.db.transaction (tx)->
						tx.executeSql("SELECT post_id FROM wp_postmeta 
							WHERE post_id in ("+uniquePostId+") 
							AND meta_key='difficulty_level' 
							AND meta_value = ?  
							ORDER BY RANDOM() 
							LIMIT '"+count+"' " 
							, [level], onSuccess(d) , _.deferredErrorHandler(d))
			

			onSuccess =(d)->
				complete_ids_for_each_level = []

				(tx, data)->
					for i in [0..data.rows.length-1] by 1
						complete_ids_for_each_level.push data.rows.item(i)['post_id']

					d.resolve(complete_ids_for_each_level)

			$.when(runQuery()).done ->
				console.log "checkForEachContentSetValue transaction completed"
			.fail _.failureHandler


		getStartDateAndStatus : (collection_id)->

			data = start_date:'', status:'', attempts:''

			runFunc = ->

				$.Deferred (d)->
					
					quizResponseSummary = _.getQuizResponseSummaryByCollectionId(collection_id)
					quizResponseSummary.done (quiz_responses)->

						if _.isEmpty quiz_responses
							data.status = 'not started'
							data.start_date = ''
							data.attempts = 0
							d.resolve data

						if not _.isEmpty quiz_responses
							
							getQuizType = _.getCollectionMeta(collection_id)
							getQuizType.done (collectionMetaData)->

								contentLayoutValue = _.unserialize(quiz_responses.quiz_meta)

								if collectionMetaData.quizType is 'practice'
									data.attempts = quiz_responses.attempts
									# data.status = 'completed'

									# if moment(quiz_responses.taken_on).isValid()
									# 	data.start_date = quiz_responses.taken_on

									# else
									# 	date = quiz_responses.taken_on
									# 	data.start_date = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD")
								
								
								if contentLayoutValue.status is "started"
									data.status = 'started'

									if moment(quiz_responses.taken_on).isValid()
										data.start_date = quiz_responses.taken_on

									else
										date = quiz_responses.taken_on
										data.start_date = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD")


								else if contentLayoutValue.status is "completed"
									data.status = 'completed'

									if moment(quiz_responses.taken_on).isValid()
										data.start_date = quiz_responses.taken_on

									else
										date = quiz_responses.taken_on
										data.start_date = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD")

								d.resolve data

			
			$.when(runFunc()).done ->
				console.log 'getStartDateAndStatus done'
			.fail _.failureHandler



		getQuizResponseSummaryByCollectionId : (collection_id)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT COUNT(summary_id) AS attempts, taken_on, quiz_meta 
							FROM "+_.getTblPrefix()+"quiz_response_summary 
							WHERE collection_id=? AND student_id=?"
							, [collection_id, _.getUserID()] 
							, onSuccess(d), _.deferredErrorHandler(d))
			
			onSuccess =(d)->
				(tx,data)->

					result = data.rows.item(0)
					if result.attempts is 0
						result = ''
						d.resolve(result)
					else
						d.resolve(result)
					
					


			$.when(runQuery()).done ->
				console.log 'getQuizResponseSummaryByCollectionId transaction completed'
			.fail _.failureHandler

		
		
		getDuration : (duration)->

			if duration > 60
				duration/60
			else
				duration

		
		getMinsHours : (duration)->

			if duration > 60
				'hrs'
			else 'mins'	



		getQuizById : (id)->
			

			runQuery = ->

				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_content_collection WHERE 
							id=?", [id], onSuccess(d), _.deferredErrorHandler(d))


			onSuccess =(d)->
				(tx,data)->
					result = ''
					row = data.rows.item(0)

					do (row)->
						collectionMeta = _.getCollectionMeta(row['id'])
						collectionMeta.done (collectionMetaData)->

							do(row, collectionMetaData)->
								dateAndStatus = _.getStartDateAndStatus(row['id'])
								dateAndStatus.done (dateStatus)->

									result = 
										id: row['id']
										content_pieces : collectionMetaData.contentPieces
										created_by: row['created_by']
										created_on: row['created_on']
										duration: row['duration']
										instructions : collectionMetaData.instructions
										last_modified_by: row['last_modified_by']
										last_modified_on: row['last_modified_on']
										marks : collectionMetaData.marks
										message : collectionMetaData.message
										minshours: _.getMinsHours(row['duration'])
										name: row['name']
										negMarks : collectionMetaData.negMarks
										negMarksEnable : collectionMetaData.negMarksEnable
										permissions : collectionMetaData.permission
										post_status: row['post_status']
										published_by: row['published_by']
										published_on: row['published_on']
										quiz_type : collectionMetaData.quizType
										status : dateStatus.status
										attempts: dateStatus.attempts
										taken_on : dateStatus.start_date
										term_ids: _.unserialize(row['term_ids'])
										total_minutes: row['duration']
										type: row['type']
									
									d.resolve(result)
			
			$.when(runQuery()).done ->
				console.log 'getQuizById done'
			.fail _.failureHandler
