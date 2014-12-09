define ['underscore', 'unserialize'], ( _) ->

	#Functions related to Quiz entity

	_.mixin


		getQuizByTextbookId : (textbookId)->

			defer = $.Deferred()

			pattern = '%"'+textbookId+'"%'

			onSuccess = (tx,data)->

				result = []

				if data.rows.length is 0
					defer.resolve result
				
				else

					forEach = (row, i)->

						_.getCollectionMeta(row['id'])
						.then (collectionMetaData)->


							_.getStartDateAndStatus(row['id'])
							.then (dateStatus)->


								_.getQuizSchedule(row['id'])
								.then (schedule)->
									
									if collectionMetaData.marks
										marks = parseFloat(collectionMetaData.marks)
									else
										marks = collectionMetaData.marks
									

									result[i] = 
										id : row['id']
										name : row['name']
										created_on : row['created_on']
										created_by : row['created_by']
										last_modified_on : row['last_modified_on']
										last_modified_by : row['last_modified_by']
										published_on : row['published_on']
										published_by : row['published_by']
										post_status : row['post_status']
										type : row['type']
										term_ids : _.unserialize(row['term_ids'])
										duration : _.getDuration(row['duration'])
										minshours : _.getMinsHours(row['duration'])
										total_minutes : row['duration']
										description : ""
										permissions : collectionMetaData.permission
										instructions : collectionMetaData.instructions
										quiz_type : collectionMetaData.quizType
										marks : marks
										negMarksEnable : collectionMetaData.negMarksEnable
										negMarks : collectionMetaData.negMarks
										message : collectionMetaData.message
										content_layout : ""
										taken_on : dateStatus.start_date
										status : dateStatus.status
										attempts : dateStatus.attempts
										content_pieces : collectionMetaData.contentPieces
										schedule:schedule


									i = i + 1
									if (i < data.rows.length)
										forEach data.rows.item(i), i
									
									else
										console.log "getQuizByTextbookId done"
										defer.resolve result
					

					forEach data.rows.item(0), 0


			_.db.transaction (tx)->
				tx.executeSql "SELECT * FROM wp_content_collection
								WHERE term_ids LIKE '"+pattern+"' 
								AND post_status IN ('publish', 'archive') 
								AND type=? "
								, ['quiz']
								, onSuccess, _.transactionErrorHandler


			defer.promise()




		#get extra information related to quiz from wp_collection_meta
		getCollectionMeta : (collection_id)->

			defer = $.Deferred()
			
			deferreds = []

			result = quizType: '', contentPieces: '', instructions: '', permission:'', marks:''
					, negMarks: '', negMarksEnable: '', message: ''

			

			onSuccess = (tx,data)->
				
				if data.rows.length is 0
					defer.resolve result
				
				else

					forEach = (row, i)->


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

						

						i = i + 1
						if (i < data.rows.length)
							forEach data.rows.item(i), i
						
						else
							# if result.quizType is 'practice'
							if deferreds.length is 0
								defer.resolve result
							
							else
								$.when(deferreds...).done (content_pieces...)->
									_.each content_pieces, (contentPiece)->
										result.contentPieces = contentPiece

									console.log "getCollectionMeta done"
									defer.resolve result
							# else
							# 	if deferreds.length is 0
							# 		defer.resolve result
								
							# 	else
							# 		$.when(deferreds...).done (content_pieces...)->
							# 			_.each content_pieces, (contentPiece)->
							# 				result.contentPieces = []

							# 			console.log "getCollectionMeta without content piece done"
							# 			defer.resolve result


					forEach data.rows.item(0), 0


			_.db.transaction (tx)->

				tx.executeSql "SELECT * FROM wp_collection_meta 
								WHERE collection_id = ?"
								, [collection_id]
				, onSuccess, _.transactionErrorHandler


			defer.promise()



		getContentPiecesFromContentLayout : (contentLayout)->
			
			content_pieces = []

			content_layout = _.unserialize(contentLayout)
			
			deferreds = []

	
			defer = $.Deferred()

			if contentLayout.length is 0
				defer.resolve content_pieces
			
			else

				forEach = (content, key)->

					if content.type is "content-piece"
						
						if content.id
							
							content_pieces.push(parseInt(content.id))

					else if content.type is "content_set"
						
						def = _.generateSetItems(content, content_pieces)
						deferreds.push def



					key = key + 1
					
					if (key < content_layout.length)
						forEach content_layout[key], key
					
					else
						if deferreds.length is 0	
							defer.resolve content_pieces
						
						else
							$.when(deferreds...).done (content_set_ids...)->
								
								_.each content_set_ids, (contentSetId, key)->
									
									content_pieces = content_pieces.concat(contentSetId)

								console.log "getContentPiecesFromContentLayout done"
								defer.resolve content_pieces

				
				forEach content_layout[0], 0
					

			defer.promise()



		#This function gets the ids for content sets
		generateSetItems : (content, content_pieces)->
			
			term_ids = content.data.terms_id
			level1 = parseInt(content.data.lvl1)
			level2 = parseInt(content.data.lvl2)
			level3 = parseInt(content.data.lvl3)
			
			complete_ids = []

			defer = $.Deferred()

			_.getIdFromPostMeta()
			.then (postIds)->

				_.getUniqueIdFromPostMeta(term_ids, postIds, content_pieces)
				.then (uniquePostId)->
					uniquePostId =  uniquePostId.join()

					_.checkForEachContentSetValue(uniquePostId, level1, '1')
					.then (complete_ids_level1)->
						complete_ids = complete_ids.concat(complete_ids_level1)

						_.checkForEachContentSetValue(uniquePostId, level2, '2')
						.then (complete_ids_level2)->
							complete_ids = complete_ids.concat(complete_ids_level2)

							_.checkForEachContentSetValue(uniquePostId, level3, '3')
							.then (complete_ids_level3)->

								complete_ids = complete_ids.concat(complete_ids_level3)
								defer.resolve(complete_ids)

			defer.promise()



		#This function will get all the ids for type student question and key content_type
		getIdFromPostMeta : ->

			defer = $.Deferred()

			onSuccess = (tx,data)->
				
				postId = []
				
				if data.rows.length is 0
					defer.resolve postId

				else

					forEach = (row, i)->
						postId.push data.rows.item(i)['ID']

						i = i + 1

						if ( i < data.rows.length)
							forEach data.rows.item(i), i

						else
							console.log "getIdFromPostMeta done"
						
							defer.resolve postId


					forEach data.rows.item(0), 0


			_.db.transaction (tx)->
				
				tx.executeSql "SELECT ID FROM wp_posts 
								WHERE ID IN 
								(SELECT post_id FROM wp_postmeta 
									WHERE meta_key='content_type'
									AND meta_value='student_question') 
								AND post_status = 'publish' "
								, []
				, onSuccess, _.transactionErrorHandler



			defer.promise()



		#This function gets ids which are not present in the content_pieces
		#term_ids is the textbook or chapter or section or subsection id depending
		#on which is the last encountedred
		getUniqueIdFromPostMeta : (term_ids, postIds, content_pieces)->
			
			defer = $.Deferred()
			
			difference = _.difference(postIds, content_pieces)
			difference =  difference.join()

			term_id = ''
			
			_.each term_ids, (val)->
				if val isnt ""
					term_id = val

			
			onSuccess = (tx,data)->
				
				uniquePostId = []

				if data.rows.length is 0
					defer.resolve uniquePostId

				else
			
					forEach = (row, i)->
						
						uniquePostId.push data.rows.item(i)['post_id']

						i = i + 1

						if ( i < data.rows.length)
							forEach data.rows.item(i), i

						else
							console.log "getUniqueIdFromPostMeta done"
							defer.resolve uniquePostId

					forEach data.rows.item(0), 0


			_.db.transaction (tx)->
				
				pattern = '%"'+term_id+'"%'
				
				tx.executeSql "SELECT post_id FROM wp_postmeta 
								WHERE post_id IN ("+difference+") 
								AND meta_key='content_piece_meta' 
								AND meta_value LIKE '%"+pattern+"%' "
								, []
				, onSuccess, _.transactionErrorHandler

			defer.promise()




		#This function gets ids for each level in the content set
		#count is the level id in that content set
		#and value is the level number
		checkForEachContentSetValue : (uniquePostId, count, level)->

			defer = $.Deferred()


			onSuccess = (tx,data)->
				complete_ids_for_each_level = [] 
				

				if data.rows.length is 0	
					defer.resolve complete_ids_for_each_level
				
				else			

					forEach = (row, i)->

						complete_ids_for_each_level.push data.rows.item(i)['post_id']


						i = i + 1

						if ( i < data.rows.length)
							forEach data.rows.item(i), i

						else
							console.log "getUniqueIdFromPostMeta done"
							defer.resolve complete_ids_for_each_level


					forEach data.rows.item(0), 0


			_.db.transaction (tx)->

				tx.executeSql "SELECT post_id FROM wp_postmeta 
								WHERE post_id in ("+uniquePostId+") 
								AND meta_key='difficulty_level' 
								AND meta_value = ?  
								ORDER BY RANDOM() 
								LIMIT '"+count+"' " 
								, [level]
				, onSuccess , _.transactionErrorHandler


			defer.promise()


		getStartDateAndStatus : (collection_id)->

			data = start_date:'', status:'', attempts:''

			defer = $.Deferred()
					
			_.getQuizResponseSummaryByCollectionId(collection_id)
			.then (quiz_responses)->

				if _.isEmpty quiz_responses
					data.status = 'not started'
					data.start_date = ''
					data.attempts = 0
					defer.resolve data

				if not _.isEmpty quiz_responses
					
					_.getCollectionMeta(collection_id)
					.then (collectionMetaData)->

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

						console.log "getStartDateAndStatus done"
						defer.resolve data

			defer.promise()



		getQuizResponseSummaryByCollectionId : (collection_id)->
			
			defer = $.Deferred()


			onSuccess =(tx,data)->
				result = data.rows.item(0)
					
				if result.attempts is 0
					result = ''
					defer.resolve(result)
				else
					console.log "getQuizResponseSummaryByCollectionId done"
					defer.resolve(result)

			_.db.transaction (tx)->
				
				tx.executeSql "SELECT COUNT(summary_id) AS attempts, taken_on, quiz_meta 
								FROM "+_.getTblPrefix()+"quiz_response_summary 
								WHERE collection_id=? 
								AND student_id=?"
								, [collection_id, _.getUserID()] 
				, onSuccess, _.transactionErrorHandler

		
			defer.promise()

		#Gives the schedule date if the quiz type is class test
		getQuizSchedule : (quiz_id)->

			defer = $.Deferred()
			
			_.getDivisionIdForSchedule()
			.then (division_id_string)->
				division_id = parseInt(division_id_string)
				onSuccess =(tx,data)->
					
					schedule = new Array()
					
					row = data.rows.item(0)
						
					if row
						current_date_in_string_format = _.getCurrentDateTime(0)
						from_in_string_format = row['schedule_from']
						to_in_string_format = row['schedule_to']

						current_date_split = current_date_in_string_format.split("-");
						current_date = new Date(parseInt(current_date_split[0], 10), 
														parseInt(current_date_split[1], 10)-1, 
														parseInt(current_date_split[2], 10));

						from_split = from_in_string_format.split("-");
						from = new Date(parseInt(from_split[0], 10), 
														parseInt(from_split[1], 10)-1, 
														parseInt(from_split[2], 10));
						
						to_split = to_in_string_format.split("-");
						to = new Date(parseInt(to_split[0], 10), 
														parseInt(to_split[1], 10)-1, 
														parseInt(to_split[2], 10));						
						
						if current_date >= from and current_date <= to
							active = true
						else
							active = false

						if current_date > to
							expired = true
						else
							expired = false
						
						schedule = 'from' : from, 'to' : to
									, 'is_active':active ,'is_expired':expired
						
						defer.resolve(schedule)

					else
						schedule = ''
						defer.resolve(schedule)


				_.db.transaction (tx)->
					
					tx.executeSql "SELECT schedule_from, schedule_to 
									FROM "+_.getTblPrefix()+"quiz_schedules 
									WHERE quiz_id=? 
									AND division_id=?"
									, [quiz_id, division_id] 
					, onSuccess, _.transactionErrorHandler
				
			defer.promise()



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
			
			defer = $.Deferred()

			onSuccess = (tx,data)->
				
				result = ''
				row = data.rows.item(0)

				
				_.getCollectionMeta(row['id'])
				.then (collectionMetaData)->

					_.getStartDateAndStatus(row['id'])
					.then (dateStatus)->


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
						
						console.log "getQuizById done"
						defer.resolve result


			_.db.transaction (tx)->
				
				tx.executeSql "SELECT * FROM wp_content_collection 
								WHERE id=?"
								, [id]
				, onSuccess, _.transactionErrorHandler

			defer.promise()