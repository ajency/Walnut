define ['underscore', 'unserialize'], ( _) ->

	#Functions related to question-response entity

	_.mixin

		saveUpdateQuestionResponse : (model)->

			questionType = _.getMetaValue(model.get('content_piece_id'))
			questionType.done (meta_value)->

				if meta_value.question_type is 'individual'
					question_response = serialize(model.get('question_response'))
				else
					question_response = model.get('question_response')

				if model.has('ref_id')
					_.updateQuestionResponse(model, question_response)

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
							SET start_date=? WHERE ref_id=?', [_.getCurrentDateTime(0)])

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


		updateQuestionResponse : (model, question_response)->

			end_date = model.get('end_date')			
			end_date = _.getCurrentDateTime(0) if model.get('status') is 'completed'

			_.db.transaction((tx)->
				tx.executeSql('UPDATE '+_.getTblPrefix()+'question_response 
					SET teacher_id=?, question_response=?, time_taken=?, status=?
					, start_date=?, end_date=? WHERE ref_id=?'
					, [_.getUserID(), question_response, model.get('time_taken')
					, model.get('status'), _.getCurrentDateTime(0), end_date, model.get('ref_id')])

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