define ['underscore'], ( _) ->

	#Functions related to textbooks entity

	_.mixin
		
		getTextbooksForStudent : ->

			runQuery = ->

				$.Deferred (d)->
					_.db.transaction (tx)->

						classID = _.getClassIdForUser()
						classID.done (class_id)->
							console.log JSON.stringify class_id

							pattern = '%"'+class_id+'";%'
							console.log pattern


							tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt 
								LEFT OUTER JOIN wp_textbook_relationships wtr ON 
								t.term_id=wtr.textbook_id WHERE t.term_id=tt.term_id AND 
								tt.taxonomy='textbook' AND tt.parent=0
								AND wtr.class_id LIKE '"+pattern+"' "
								, [], onSuccess(d) , _.deferredErrorHandler(d));
							

			onSuccess = (d)->
				(tx, data)->

					result = []
					for i in [0..data.rows.length-1] by 1

						row = data.rows.item(i)
						console.log JSON.stringify row

						do (row ,i)->
							modulesCount = _.getModulesCount(row['textbook_id'])
							modulesCount.done (modules_count)->
								console.log JSON.stringify modules_count
								
								do(row, i, modules_count)->
									textbookOptions = _.getTextbookOptions(row['term_id'])
									textbookOptions.done (options)->
										console.log JSON.stringify options

										do(row, i, modules_count, options)->
											chapterCount = _.getChapterCount(row['term_id'])
											chapterCount.done (chapter_count)->
												console.log JSON.stringify chapter_count

												do(row, i, modules_count, options,chapter_count)->
													completedQuizCount = _.getCompletedQuizCount(row['textbook_id'])
													completedQuizCount.done (quizzes_completed)->
														console.log JSON.stringify quizzes_completed
														
														result[i] = 
															term_id: row["term_id"]
															name: row["name"]
															slug: row["slug"]
															term_group: row["term_group"]
															term_taxonomy_id: row["term_taxonomy_id"]
															taxonomy: row["taxonomy"]
															description: row["description"]
															parent: row["parent"]
															count: row["count"]
															classes: _.unserialize(row["class_id"])
															subjects: _.unserialize(row["tags"])
															modules_count: modules_count
															author: options.author
															thumbnail: options.attachmenturl
															cover_pic: options.attachmenturl
															filter: 'raw'
															chapter_count : chapter_count
															quizzes_completed : quizzes_completed
															quizzes_not_started : modules_count - quizzes_completed
														console.log JSON.stringify result[i]


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

					class_id = data.rows.item(0)['meta_value']
					console.log class_id 
					console.log JSON.stringify class_id
					console.log class_id.replace(/"([^"]+(?="))"/g, "$1")
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

		
		#get Completed quiz count for student app
		getCompletedQuizCount : (textbook_id)->

			pattern = '%"'+textbook_id+'"%'

			runQuery =->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT COUNT(qr.collection_id) AS completed_quiz_count 
							FROM wp_quiz_response_summary qr,
							wp_content_collection cc

							WHERE 
								qr.collection_id = cc.id 
								AND qr.student_id = ?
								AND qr.quiz_meta= ?
								AND cc.term_ids LIKE '"+pattern+"' " , 

								[ _.getUserID(), 'completed']
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->
				(tx,data)->
					quizzes_completed = data.rows.item(0)['completed_quiz_count']
					d.resolve(quizzes_completed)

			$.when(runQuery()).done ->
				console.log 'getCompletedQuizCount transaction completed'
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