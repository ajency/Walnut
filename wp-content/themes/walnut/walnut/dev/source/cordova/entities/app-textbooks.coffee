define ['underscore'], ( _) ->

	#Functions related to textbooks entity

	_.mixin
		
		getTextbooksForStudent : ->

			runQuery = ->

				$.Deferred (d)->
					classID = _.getClassIdForUser()
					classID.done (class_id)->
						_.db.transaction (tx)-> 
							pattern = '%"'+class_id+'"%' 

							tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt 
								LEFT OUTER JOIN wp_textbook_relationships wtr ON 
								t.term_id=wtr.textbook_id WHERE t.term_id=tt.term_id 
								AND tt.taxonomy='textbook' AND tt.parent=0 
								AND wtr.class_id LIKE '%"+pattern+"%' " 
								, [], onSuccess(d) , _.deferredErrorHandler(d));
							

			onSuccess = (d)->
				(tx, data)->
					result = []
					for i in [0..data.rows.length-1] by 1

						row = data.rows.item(i)

						do (row ,i)->
							modulesCount = _.getModulesCount(row['textbook_id'])
							modulesCount.done (modules_count)->
								
								do(row, i, modules_count)->
									textbookOptions = _.getTextbookOptions(row['term_id'])
									textbookOptions.done (options)->

										do(row, i, modules_count, options)->
											chapterCount = _.getChapterCount(row['term_id'])
											chapterCount.done (chapter_count)->

												do(row, i, modules_count, options,chapter_count)->
													practiceAndTotalQuiz = _.getPracticeAndTotalQuiz(row['textbook_id'])
													practiceAndTotalQuiz.done (total_quiz_count)->


														do(row, i, modules_count, options, chapter_count, total_quiz_count)->
															practiceCompletedQuizCount = _.getPracticeCompletedQuizCount(row['textbook_id'])
															practiceCompletedQuizCount.done (practice_quizzes_completed)->


																result[i] = 
																	term_id: row["term_id"]
																	name: row["name"]
																	class_test_count: total_quiz_count.class_test
																	class_test_completed : practice_quizzes_completed.class_test_completed
																	class_test_not_started : total_quiz_count.class_test - (practice_quizzes_completed.class_test_completed + practice_quizzes_completed.class_test_in_progress)
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
																	practice_not_started : total_quiz_count.practice - (practice_quizzes_completed.practice_completed + practice_quizzes_completed.practice_in_progress )
					
					d.resolve(result)
			
			$.when(runQuery()).done (data)->
				console.log 'getTextbooksForStudent transaction completed'
			.fail _.failureHandler


		
		getClassIdForUser : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT meta_value FROM wp_usermeta 
							WHERE meta_key=? AND user_id=?", ['student_division', _.getUserID()],
							onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					class_id= ''
					class_id = data.rows.item(0)['meta_value']
					console.log class_id 
					# console.log class_id.replace(/"([^"]+(?="))"/g, "$1")
					d.resolve class_id

			$.when(runQuery()).done ->
				console.log 'getClassIdForUser transaction completed'
			.fail _.failureHandler


		
		# Get the total number of modules for each textbook having status as 'publish'
		getModulesCount : (textbook_id)->

			pattern = '%"'+textbook_id+'"%'

			
			runQuery =->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT COUNT(id) AS count FROM wp_content_collection 
							WHERE 
								term_ids LIKE '"+pattern+"' 
								AND post_status=?
								AND type=?", 

								['publish', 'quiz']
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->
				(tx,data)->
					modules_count = data.rows.item(0)['count']
					d.resolve(modules_count)

			$.when(runQuery()).done ->
				console.log 'getModulesCount transaction completed'
			.fail _.failureHandler


		#get Total Quiz and Practice Quiz
		getPracticeAndTotalQuiz : (textbook_id)->
			
			pattern = '%"'+textbook_id+'"%'

			runQuery =->

				$.Deferred (d)->

					_.db.transaction (tx)->
						tx.executeSql("SELECT SUM( CASE WHEN m.meta_value = 'practice' THEN 1 ELSE 0 END ) 
							as practice
							, SUM( CASE WHEN m.meta_value = 'test' THEN 1 ELSE 0 END ) as class_test 
							FROM wp_content_collection c
							, wp_collection_meta m
							 WHERE c.term_ids LIKE '"+pattern+"' 
							 AND c.post_status=? 
							 AND c.type=? 
							 AND c.id = m.collection_id 
							 AND m.meta_key=? "
							, ['publish', 'quiz', 'quiz_type']

							,onSuccess(d), _.deferredErrorHandler(d))


			onSuccess =(d)->

				(tx,data)->
					total_count = data.rows.item(0)
					console.log total_count
					d.resolve(total_count)


			$.when(runQuery()).done ->
				console.log 'getPracticeAndTotalQuiz transaction completed'
			.fail _.failureHandler			



		#get Practice quiz Completed count for student app
		getPracticeCompletedQuizCount : (textbook_id)->

			pattern = '%"'+textbook_id+'"%'

			runQuery =->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT cc.id, cm.meta_value as quiz_type, qr.quiz_meta 
							FROM "+_.getTblPrefix()+"quiz_response_summary qr, 
							wp_content_collection cc, wp_collection_meta cm 
							WHERE qr.collection_id = cc.id 
							AND cm.collection_id = cc.id 
							AND cm.meta_key LIKE '%quiz_type%' 
							AND cc.post_status IN ('publish','archive') 
							AND qr.student_id = ? 
							AND cc.term_ids LIKE '"+pattern+"' "
							, [_.getUserID()]
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->
				(tx,data)->

					practice_quizzes_completed = new Array()
					
					class_test_completed = new Array()
					practice_completed = new Array()
					class_test_in_progress = new Array()
					practice_in_progress = new Array()
					
					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)
						
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
					
					if practice_completed.length >0
						count_practice_completed = _.uniq(practice_completed);
					if practice_in_progress.length >0
						count_practice_in_progress = _.uniq(practice_in_progress);
					
					
					practice_quizzes_completed = 
						class_test_completed : _.size(_.values(class_test_completed)),
						practice_completed : _.size(count_practice_completed),
						class_test_in_progress : _.size(_.values(class_test_in_progress)),
						practice_in_progress : _.size(count_practice_in_progress)


					d.resolve(practice_quizzes_completed)

			$.when(runQuery()).done ->
				console.log 'getPracticeCompletedQuizCount transaction completed'
			.fail _.failureHandler

		
		# Get additional textbook options such as author name and textbook image url.
		# Here the url is modified to fetch textbook images from local directory.
		getTextbookOptions : (id)->

			options = author:'', attachmenturl:''

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT option_value FROM wp_options WHERE option_name=?"
							, ['taxonomy_'+id], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
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

						d.resolve options

					else 
						d.resolve options
					
			$.when(runQuery()).done ->
				console.log 'getTextbookOptions transaction completed'
			.fail _.failureHandler



		getTextBookByTextbookId : (id)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt 
							LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id  
							WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0 
							AND tt.term_id=?", [id], onSuccess(d), _.deferredErrorHandler(d));
						

			onSuccess = (d)->
				(tx, data)->

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

					d.resolve(result)

			$.when(runQuery()).done (data)->
				console.log 'getTextBookByTextbookId transaction completed'
			.fail _.failureHandler



		getTextBookNamesByTermIDs : (ids)->
				
			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT term_id, name FROM wp_terms WHERE 
							term_id IN ("+ids+")", [], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->
				(tx, data)->

					result = []

					for i in [0..data.rows.length-1] by 1

						row = data.rows.item(i)

						result[i] =
							id: row['term_id']
							name: row['name']

					d.resolve(result)

			$.when(runQuery()).done ->
				console.log 'getTextBookNamesByTermIDs transaction completed'
			.fail _.failureHandler