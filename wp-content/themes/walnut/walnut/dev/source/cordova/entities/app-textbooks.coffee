define ['underscore'], ( _) ->

	#Functions related to textbooks entity

	_.mixin


		cordovaTextbookCollection : ->

			defer = $.Deferred()

			_.getClassIdForUser()
			.then (class_id)->
				console.log 'getClassIdForUser transaction completed'

				_.getTextbooksForStudent class_id
				.then (data)->
					console.log 'getTextbooksForStudent transaction completed'
					
					defer.resolve data

			defer.promise()


		
		getClassIdForUser : ->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				class_id = data.rows.item(0)['meta_value']
				defer.resolve class_id


			_.db.transaction (tx)->

				tx.executeSql "SELECT meta_value 
								FROM wp_usermeta 
								WHERE meta_key=? 
								AND user_id=?"
								, ['student_division', _.getUserID()]

				, onSuccess , _.transactionErrorHandler


			defer.promise()


		
		getTextbooksForStudent : (class_id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				result = []

				forEach = (row, i)->
					
					_.getTextbookOptions row['term_id']
					.then (options)->
						console.log 'getTextbookOptions transaction completed'

						_.getChapterCount row['term_id']
						.then (chapter_count)->
							console.log 'getChapterCount transaction completed'

							_.getPracticeAndTotalQuiz row['textbook_id']
							.then (total_quiz_count)->
								console.log 'getPracticeAndTotalQuiz transaction completed'

								_.getPracticeCompletedQuizCount row['textbook_id']
								.then (practice_quizzes_completed)->
									console.log 'getPracticeCompletedQuizCount transaction completed'

									class_test_not_started = total_quiz_count.class_test - 
										(practice_quizzes_completed.class_test_completed + 
										practice_quizzes_completed.class_test_in_progress)

									practice_not_started = total_quiz_count.practice - 
										(practice_quizzes_completed.practice_completed + 
										practice_quizzes_completed.practice_in_progress )

									result[i] = 
										term_id: row["term_id"]
										name: row["name"]
										class_test_count: total_quiz_count.class_test
										class_test_completed : practice_quizzes_completed.class_test_completed
										class_test_not_started : class_test_not_started
										slug: row["slug"]
										term_group: row["term_group"]
										term_taxonomy_id: row["term_taxonomy_id"]
										taxonomy: row["taxonomy"]
										description: row["description"]
										parent: row["parent"]
										count: row["count"]
										classes: _.unserialize(row["class_id"])
										subjects: _.unserialize(row["tags"])
										author: options.author
										thumbnail: options.attachmenturl
										cover_pic: options.attachmenturl
										filter: 'raw'
										chapter_count : chapter_count
										practice_count: total_quiz_count.practice
										practice_completed : practice_quizzes_completed.practice_completed
										practice_not_started : practice_not_started

									
									i = i + 1
									if(i < data.rows.length)
										forEach data.rows.item(i), i
									else 
										defer.resolve result


				forEach data.rows.item(0), 0

			
			_.db.transaction (tx)->

				pattern = '%"'+class_id+'"%'

				tx.executeSql "SELECT * FROM wp_terms t, wp_term_taxonomy tt 
								LEFT OUTER JOIN wp_textbook_relationships wtr 
								ON t.term_id=wtr.textbook_id 
								WHERE t.term_id=tt.term_id 
								AND tt.taxonomy='textbook' AND tt.parent=0 
								AND wtr.class_id LIKE '%"+pattern+"%' ", []

				, onSuccess , _.transactionErrorHandler


			defer.promise()



		# Get additional textbook options such as author name and textbook image url.
		# Here the url is modified to fetch textbook images from local directory.
		getTextbookOptions : (id)->

			defer = $.Deferred()

			options = author:'', attachmenturl:''

			onSuccess = (tx, data)->

				if data.rows.length isnt 0

					option_value = _.unserialize(data.rows.item(0)['option_value'])
					url = option_value.attachmenturl

					if url is 'false'
						attachmenturl = ''
					else
						directoryPath = _.getSynapseMediaDirectoryPath()
						attachmenturl = directoryPath + url.substr(url.indexOf("uploads/"))
						attachmenturl = '<img src="'+attachmenturl+'" 
						onerror="this.onerror=null;this.src=\'/images/img-not-found.jpg\';">'

					options = 
						author: option_value.author
						attachmenturl: attachmenturl

					defer.resolve options

				else 
					defer.resolve options


			_.db.transaction (tx)->

				tx.executeSql "SELECT option_value 
								FROM wp_options 
								WHERE option_name=?"
								, ['taxonomy_'+id]

				, onSuccess, _.transactionErrorHandler


			defer.promise()



		#get Total Quiz and Practice Quiz
		getPracticeAndTotalQuiz : (textbook_id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				total_count = data.rows.item(0)
				defer.resolve total_count


			_.db.transaction (tx)->

				pattern = '%"'+textbook_id+'"%'

				tx.executeSql "SELECT SUM( CASE WHEN m.meta_value = 'practice' THEN 1 ELSE 0 END ) AS practice, 
								SUM( CASE WHEN m.meta_value = 'test' THEN 1 ELSE 0 END ) AS class_test 
								FROM wp_content_collection c, wp_collection_meta m WHERE c.term_ids 
								LIKE '"+pattern+"' 
								AND c.post_status=? 
								AND c.type=? 
								AND c.id = m.collection_id 
								AND m.meta_key=? "
								, ['publish', 'quiz', 'quiz_type']

				, onSuccess, _.transactionErrorHandler


			defer.promise()



		#get Practice quiz Completed count for student app
		getPracticeCompletedQuizCount : (textbook_id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				practice_quizzes_completed = new Array()
				class_test_completed = new Array()
				practice_completed = new Array()
				class_test_in_progress = new Array()
				practice_in_progress = new Array()


				forEach = (row, i)->

					quiz_meta = _.unserialize(row['quiz_meta'])
					status = quiz_meta['status']

					if status is 'completed'
						if row['quiz_type'] is 'test'
							class_test_completed[i] = row['id']
						else
							practice_completed[i] = row['id']
					else
						if row['quiz_type'] is 'test'
							class_test_in_progress[i] = row['id']
						else
							practice_in_progress[i] = row['id']


					i = i + 1
					if(i < data.rows.length)
						forEach data.rows.item(i), i
					else
						if practice_completed.length >0
							count_practice_completed = _.uniq practice_completed
						if practice_in_progress.length >0
							count_practice_in_progress = _.uniq practice_in_progress
						
						practice_quizzes_completed = 
							class_test_completed : _.size(_.values(class_test_completed))
							practice_completed : _.size(count_practice_completed)
							class_test_in_progress : _.size(_.values(class_test_in_progress))
							practice_in_progress : _.size(count_practice_in_progress)
						
						defer.resolve practice_quizzes_completed


				forEach data.rows.item(0), 0


			_.db.transaction (tx)->

				pattern = '%"'+textbook_id+'"%'

				tx.executeSql "SELECT cc.id, cm.meta_value as quiz_type, qr.quiz_meta 
								FROM "+_.getTblPrefix()+"quiz_response_summary qr, wp_content_collection cc, 
								wp_collection_meta cm 
								WHERE qr.collection_id = cc.id 
								AND cm.collection_id = cc.id 
								AND cm.meta_key LIKE '%quiz_type%' 
								AND cc.post_status IN ('publish','archive') 
								AND qr.student_id = ? 
								AND cc.term_ids LIKE '"+pattern+"' "
								, [_.getUserID()]

				, onSuccess, _.transactionErrorHandler


			defer.promise()
		



		getTextBookByTextbookId : (id)->

			defer = $.Deferred()

			onSuccess = (tx,data)->
				row = data.rows.item(0)
				
				result =
					term_id: row["term_id"]
					name: row["name"]
					slug: row["slug"]
					term_group: row["term_group"]
					term_order: row["term_order"]
					term_taxonomy_id: row["term_taxonomy_id"]
					taxonomy: row["taxonomy"]
					description: row["description"]
					parent: row["parent"]
					count: row["count"]
					classes: _.unserialize(row["class_id"])
					subjects: _.unserialize(row["tags"])

				defer.resolve result

			_.db.transaction (tx)->
				
				tx.executeSql "SELECT * FROM wp_terms t, wp_term_taxonomy tt 
								LEFT OUTER JOIN wp_textbook_relationships wtr 
								ON t.term_id=wtr.textbook_id 
								WHERE t.term_id=tt.term_id 
								AND tt.taxonomy='textbook' 
								AND tt.parent=0 
								AND tt.term_id=?"
								, [id]
				, onSuccess, _.transactionErrorHandler

			defer.promise()



		getTextBookNamesByTermIDs : (ids)->
				
			defer = $.Deferred()

			onSuccess = (tx,data)->
				result = []

				if data.rows.length is 0
					defer.resolve result
				
				else

					forEach = (row, i)->
						
						result[i] =
							id: row['term_id']
							name: row['name']


						i = i + 1

						if ( i < data.rows.length)
							forEach data.rows.item(i), i

						else
							defer.resolve result

					forEach data.rows.item(0), 0


			_.db.transaction (tx)->
				
				tx.executeSql "SELECT term_id, name FROM wp_terms 
								WHERE term_id IN ("+ids+")"
								, []
				, onSuccess, _.transactionErrorHandler

			defer.promise()