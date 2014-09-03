define ['underscore', 'unserialize'], ( _) ->

	#Functions related to content-group entity

	_.mixin

		getQuizByTextbookIdAndUserID : (textbookId)->

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
							metaKeyDescriptionAndContentLayout = _.getMetaKeyDescriptionAndContentLayout(row['id'])
							metaKeyDescriptionAndContentLayout.done (metaKeyDescriptionContentLayout)->

								quizType = contentLayout = description = ''
								quizType = metaKeyDescriptionContentLayout.quizType
								console.log quizType
								# contentLayout = metaKeyDescriptionContentLayout.responseIds
								contentLayout = _.unserialize(metaKeyDescriptionContentLayout.contentLayout)
								# console.log JSON.stringify contentLayout
								description = _.unserialize(metaKeyDescriptionContentLayout.description)

								do (row, i, quizType, contentLayout, description)->
									dateAndStatus = _.getStartDateAndStatus(row['id'])
									dateAndStatus.done (dateStatus)->
										status = dateStatus.status
										date = dateStatus.start_date
									if not (row['post_status'] is 'archive' and status is 'not started')
										console.log JSON.stringify id: row['id']
										console.log JSON.stringify name: row['name']
										console.log JSON.stringify training_date: date
										console.log JSON.stringify content_layout: contentLayout
										console.log JSON.stringify description: description
										console.log JSON.stringify post_status: row['post_status']
										data = 
											id: row['id']
											name: row['name']
											created_on: row['created_on']
											created_by: row['created_by']
											last_modified_on: row['last_modified_on']
											last_modified_by: row['last_modified_by']
											published_on: row['published_on']
											published_by: row['published_by']
											type: row['type']
											term_ids: _.unserialize(row['term_ids'])
											duration: _.getDuration(row['duration'])
											minshours: _.getMinsHours(row['duration'])
											total_minutes: row['duration']
											quiz_type: quizType
											content_layout: contentLayout
											training_date: date
											description: description
											post_status: row['post_status']


										console.log JSON.stringify data
										result.push data
					console.log JSON.stringify result
					d.resolve result		

			$.when(runQuery()).done (data)->
				console.log 'getContentGroupByTextbookIdAndDivision transaction completed'
			.fail _.failureHandler


		getStartDateAndStatus : (collection_id)->
			runFunc = ->

				$.Deferred (d)->

					data = start_date:'', status:''
					quizResponseSummary = _.getQuizResponseSummary(collection_id)
					quizResponseSummary.done (quiz_responses)->
						contentLayoutValue = ''
						contentLayoutValue = _.unserialize(quiz_responses.quiz_meta)

						if contentLayoutValue.status isnt "started" or contentLayoutValue.status isnt "completed"
							data.status = 'not started'

						if contentLayoutValue.status is "started"
							data.status = 'started'

							data.start_date = quiz_responses.taken_on

						if contentLayoutValue.status is 'completed'
							data.status = 'completed'
							data.start_date = quiz_responses.taken_on


						# console.log JSON.stringify data
						d.resolve data

			
			$.when(runFunc()).done ->
				console.log 'getStartDateAndStatus done'
			.fail _.failureHandler



		getQuizResponseSummary : (collection_id)->
			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT taken_on, quiz_meta 
							FROM "+_.getTblPrefix()+"quiz_response_summary WHERE collection_id=? 
							AND student_id=?", [collection_id, _.getUserID()] 
							, onSuccess(d), _.deferredErrorHandler(d))
			onSuccess =(d)->
				(tx,data)->

					result = data.rows.item(0)
					d.resolve(result)


			$.when(runQuery()).done ->
				console.log 'getQuizResponseSummary transaction completed'
			.fail _.failureHandler



		getMetaKeyDescriptionAndContentLayout : (collection_id)->

			metaKeyDescriptionAndContentLayout = quizType: '', contentLayout: '', description: ''

			runQuery =->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_collection_meta WHERE collection_id=?"
							,[collection_id], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->
				(tx,data)->
					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)
						if row['meta_key'] is 'quiz_type'
							metaKeyDescriptionAndContentLayout.quizType = row['meta_value']

						# if row['meta_key'] is 'content_layout'
						# 	responseIds = []

						# 	contentLayoutValue = _.unserialize(row['meta_value'])

						# 	_.each contentLayoutValue, (response, key)->
						# 		if response.type is "content-piece"
						# 			responseIds.push response.id

						# 	metaKeyDescriptionAndContentLayout.responseIds = responseIds
						if row['meta_key'] is 'content_layout'
							metaKeyDescriptionAndContentLayout.contentLayout = row['meta_value']
							

						if row['meta_key'] is 'description'
							metaKeyDescriptionAndContentLayout.description = row['meta_value']

					
					d.resolve(metaKeyDescriptionAndContentLayout)

			$.when(runQuery()).done ->
				console.log 'getMetaKeyDescriptionAndContentLayout transaction completed'
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