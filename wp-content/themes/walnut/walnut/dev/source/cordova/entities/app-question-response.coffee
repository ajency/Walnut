define ['underscore', 'serialize'], ( _) ->

	#Functions related to question-response entity

	_.mixin

		# Question response get functions
		getQuestionResponse : (collection_id, division)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"question_response 
							WHERE collection_id=? AND division=?", [collection_id, division]
							, onSuccess(d), _.deferredErrorHandler(d));
					
			onSuccess = (d)->
				(tx, data)->

					result = []

					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)

						do(row, i)->
							questionType = _.getMetaValue(row['content_piece_id'])
							questionType.done (meta_value)->

								do(row, i, meta_value)->
									questionResponseMeta = _.getDataFromQuestionResponseMeta(row['ref_id'])
									questionResponseMeta.done (multipleEvalQuestionResponse)->

										if meta_value.question_type is 'individual'
											question_response = _.unserialize(row['question_response'])
										
										else if meta_value.question_type is 'chorus'
											question_response = row['question_response']

										else
											# when question_type is 'multiple_eval'
											question_response = multipleEvalQuestionResponse

										do(row, i, question_response)->
											teacherName = _.getTeacherName(row['teacher_id'])
											teacherName.done (teacher_name)->
												console.log 'teacher_name: '+teacher_name

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
	
					d.resolve result          

			$.when(runQuery()).done (data)->
				console.log 'getQuestionResponse transaction completed'
			.fail _.failureHandler



		getDataFromQuestionResponseMeta : (ref_id)->

			question_response = ''

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql('SELECT * FROM '+_.getTblPrefix()+'question_response_meta 
							WHERE qr_ref_id=?', [ref_id], onSuccess(d), _.deferredErrorHandler(d))


			onSuccess = (d)->
				(tx, data)->

					if data.rows.length isnt 0
						row = data.rows.item(0)

						meta_key = row['meta_key']
						meta_value = _.unserialize(row['meta_value'])

						question_response = _.extend(meta_value, 'id':meta_key)

					d.resolve question_response

			$.when(runQuery()).done ->
				console.log 'getDataFromQuestionResponseMeta transaction completed'
			.fail _.failureHandler



		getTeacherName : (teacher_id)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT display_name FROM wp_users WHERE ID=?"
							, [teacher_id], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					display_name = ''
					if data.rows.length isnt 0
						display_name = data.rows.item(0)['display_name']

					d.resolve display_name

			$.when(runQuery()).done ->
				console.log 'getTeacherName transaction completed'
			.fail _.failureHandler




		# Question response save functions
		saveUpdateQuestionResponse : (model)->

			questionType = _.getMetaValue(model.get('content_piece_id'))
			questionType.done (meta_value)->

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

			record_exists = _.checkIfRecordExistsInQuestionResponse(ref_id)
			record_exists.done (exists)->
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

			if question_type is 'multiple_eval'
				multiple_eval_questionResponse = model.get('question_response')
				
				if not _.isEmpty(multiple_eval_questionResponse)
					
					_.each multiple_eval_questionResponse, (qR, i)->
						
						student_id = qR['id']

						qR = _.omit(qR, 'id')
						meta_value = serialize(qR)
						console.log 'meta_key in QR: '+student_id
						console.log 'Meta value in QR: '+meta_value

						_.db.transaction((tx)->
							tx.executeSql('INSERT INTO '+_.getTblPrefix()+'question_response_meta 
								(qr_ref_id, meta_key, meta_value, sync) VALUES (?,?,?,?)'
								, [model.get('ref_id'), student_id, meta_value, 0])

						,_.transactionErrorHandler
						,(tx)->
							console.log 'SUCCESS: Inserted record in wp_question_response_meta'
						)


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



		checkIfRecordExistsInQuestionResponse : (ref_id)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT ref_id FROM "+_.getTblPrefix()+"question_response 
							WHERE ref_id=?", [ref_id], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->

					exists = false
					exists = true if data.rows.length > 0

					d.resolve exists

			$.when(runQuery()).done ->
				console.log 'checkIfRecordExistsInQuestionResponse transaction completed'
			.fail _.failureHandler