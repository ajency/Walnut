define ['underscore', 'serialize'], ( _) ->

	#Functions related to question-response entity

	_.mixin

		# Question response get functions
		cordovaQuestionResponseCollection : (collection_id, division)->

			defer = $.Deferred()

			result = []

			_.getQuestionResponseByCollectionIdAndDivision(collection_id, division)
			.then (questionResponseData)->
				console.log 'getQuestionResponseByCollectionIdAndDivision done'

				length = questionResponseData.rows.length

				if length is 0
					defer.resolve result
				else
					forEach = (row, i)->

						_.getMetaValue(row['content_piece_id'])
						.then (meta_value)->
							console.log 'getMetaValue done'

							_.getQuestionResponseMetaData(row['ref_id'])
							.then (multipleEvalQuestionResponse)->
								console.log 'getQuestionResponseMetaData done'

								_.getTeacherName(row['teacher_id'])
								.then (teacher_name)->
									console.log 'getTeacherName done'

									if meta_value.question_type is 'individual'
										question_response = _.unserialize(row['question_response'])
										question_response = _.map(question_response, (num)->
												parseInt(num)
											)
									
									else if meta_value.question_type is 'chorus'
										question_response = row['question_response']

									else
										# when question_type is 'multiple_eval'
										question_response = multipleEvalQuestionResponse

									result[i] = 
										ref_id: row['ref_id']
										teacher_id: row['teacher_id']
										teacher_name: teacher_name
										content_piece_id: row['content_piece_id']
										collection_id: row['collection_id']
										division: row['division']
										question_response: question_response
										time_taken: row['time_taken']
										start_date: row['start_date']
										end_date: row['end_date']
										status: row['status']

									
									i = i + 1
									if i < length
										forEach questionResponseData.rows.item(i), i
									else
										defer.resolve result


					forEach questionResponseData.rows.item(0), 0
				

			defer.promise()



		
		getQuestionResponseByCollectionIdAndDivision : (collection_id, division)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				defer.resolve data
				

			_.db.transaction (tx)->

				tx.executeSql "SELECT * 
								FROM "+_.getTblPrefix()+"question_response 
								WHERE collection_id=? 
								AND division=?"
								, [collection_id, division]

				, onSuccess, _.transactionErrorHandler
				

			defer.promise()



		getQuestionResponseMetaData : (ref_id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				question_response = []

				length = data.rows.length

				if length is 0
					defer.resolve question_response

				else
					forEach = (row, i)->

						meta_key = parseInt(row['meta_key'])
						meta_value = _.unserialize(row['meta_value'])

						question_response[i] = _.extend(meta_value, 'id':meta_key)

						i = i + 1
						if i < length
							forEach data.rows.item(i), i
						else
							defer.resolve question_response


					forEach data.rows.item(0), 0

			
			_.db.transaction (tx)->

				tx.executeSql "SELECT * 
								FROM "+_.getTblPrefix()+"question_response_meta 
								WHERE qr_ref_id=?"
								, [ref_id]

				, onSuccess, _.transactionErrorHandler


			defer.promise()



		
		getTeacherName : (teacher_id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				display_name = ''

				if data.rows.length isnt 0
					display_name = data.rows.item(0)['display_name']

				defer.resolve display_name


			_.db.transaction (tx)->

				tx.executeSql "SELECT display_name 
								FROM wp_users 
								WHERE ID=?"
								, [teacher_id]

				, onSuccess, _.transactionErrorHandler


			defer.promise()




		# Question response save functions
		saveUpdateQuestionResponse : (model)->

			_.getMetaValue(model.get('content_piece_id'))
			.done (meta_value)->
				console.log 'getMetaValue done'

				if meta_value.question_type is 'individual'
					question_response = serialize(model.get('question_response'))

				else if meta_value.question_type is 'chorus'
					question_response = model.get('question_response')
				
				else
					# when question_type is 'multiple_eval'
					question_response = ''

				
				if model.has('ref_id')
					_.updateQuestionResponse(model, question_response, meta_value.question_type)

				else
					_.insertQuestionResponse(model, question_response)



		insertQuestionResponse : (model, question_response)->

			CP = model.get('content_piece_id')
			C = model.get('collection_id')
			D = model.get('division')

			ref_id = 'CP'+CP+'C'+C+'D'+D

			if not model.get('start_date')
				start_date = _.getCurrentDateTime(0)
			else 
				start_date = model.get('start_date')

			_.checkIfRecordExistsInQuestionResponse(ref_id)
			.done (exists)->
				console.log 'checkIfRecordExistsInQuestionResponse done'

				if exists
					_.db.transaction((tx)->
						tx.executeSql('UPDATE '+_.getTblPrefix()+'question_response 
							SET start_date=?, sync=? WHERE ref_id=?'
							, [_.getCurrentDateTime(0), 0, ref_id])

					,_.transactionErrorHandler
					,(tx)->
						console.log 'SUCCESS: Record exists. Updated record in wp_question_response'
					)  

				else
					_.db.transaction((tx)->
						tx.executeSql('INSERT INTO '+_.getTblPrefix()+'question_response 
							(ref_id, teacher_id, content_piece_id, collection_id, division
							, question_response, time_taken, start_date, end_date, status, sync) 
							VALUES (?,?,?,?,?,?,?,?,?,?,?)'
							, [ref_id, _.getUserID(), model.get('content_piece_id')
							, model.get('collection_id'), model.get('division')
							, question_response, model.get('time_taken'), start_date
							, model.get('end_date'), model.get('status'), 0])

					,_.transactionErrorHandler
					,(tx)->
						console.log 'SUCCESS: Inserted record in wp_question_response'
					)

				# pass ref_id to model
				model.set 'ref_id': ref_id



		updateQuestionResponse : (model, question_response, question_type)->

			_.insertUpdateQuestionResponseMeta(model, question_type)

			end_date = model.get('end_date')			
			end_date = _.getCurrentDateTime(0) if model.get('status') is 'completed'

			_.db.transaction((tx)->
				tx.executeSql('UPDATE '+_.getTblPrefix()+'question_response 
					SET teacher_id=?, question_response=?, time_taken=?, status=?
					, start_date=?, end_date=?, sync=? WHERE ref_id=?'
					, [_.getUserID(), question_response, model.get('time_taken')
					, model.get('status'), _.getCurrentDateTime(0), end_date, 0, model.get('ref_id')])

			,_.transactionErrorHandler
			,(tx)->
				console.log 'SUCCESS: Updated record in wp_question_response'
			)


		insertUpdateQuestionResponseMeta : (model, question_type)->

			if question_type is 'multiple_eval'
				multiple_eval_questionResponse = model.get('question_response')
				
				if not _.isEmpty(multiple_eval_questionResponse)
					
					_.each multiple_eval_questionResponse, (qR, i)->
						
						student_id = qR['id']

						qR = _.omit(qR, 'id')
						meta_value = serialize(qR)

						do(student_id, meta_value)->

							_.checkIfRecordExistsInQuestionResponseMeta(model.get('ref_id'), student_id)
							.done (exists)->
								console.log 'checkIfRecordExistsInQuestionResponseMeta done'

								if exists
									_.db.transaction((tx)->
										tx.executeSql('UPDATE '+_.getTblPrefix()+'question_response_meta 
											SET meta_value=?, sync=? WHERE qr_ref_id=? AND meta_key=?'
											, [meta_value, 0, model.get('ref_id'), student_id])

									,_.transactionErrorHandler
									,(tx)->
										console.log 'SUCCESS: Updated record in wp_question_response_meta'
									)

								else
									_.db.transaction((tx)->
										tx.executeSql('INSERT INTO '+_.getTblPrefix()+'question_response_meta 
											(qr_ref_id, meta_key, meta_value, sync) VALUES (?,?,?,?)'
											, [model.get('ref_id'), student_id, meta_value, 0])

									,_.transactionErrorHandler
									,(tx)->
										console.log 'SUCCESS: Inserted record in wp_question_response_meta'
									)



		checkIfRecordExistsInQuestionResponse : (ref_id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				exists = false
				exists = true if data.rows.length > 0

				defer.resolve exists
				

			_.db.transaction (tx)->

				tx.executeSql "SELECT ref_id 
								FROM "+_.getTblPrefix()+"question_response 
								WHERE ref_id=?"
								, [ref_id]

				, onSuccess, _.transactionErrorHandler


			defer.promise()


		
		checkIfRecordExistsInQuestionResponseMeta : (qr_ref_id, meta_key)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				exists = false
				exists = true if data.rows.length > 0

				defer.resolve exists
				

			_.db.transaction (tx)->

				tx.executeSql "SELECT qr_ref_id 
								FROM "+_.getTblPrefix()+"question_response_meta 
								WHERE qr_ref_id=? 
								AND meta_key=?"
								, [qr_ref_id, meta_key]

				, onSuccess, _.transactionErrorHandler


			defer.promise()


			