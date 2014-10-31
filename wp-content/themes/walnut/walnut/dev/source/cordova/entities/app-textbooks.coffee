define ['underscore'], ( _) ->

	#Functions related to textbooks entity

	_.mixin


		cordovaTextbookCollection : (class_id, division)->

			defer = $.Deferred()

			result = []

			_.getTextbooksByClassIdAndDivision(class_id, division)
			.then (textbookData)->
				console.log 'getTextbooksByClassIdAndDivision done'

				forEach = (row, i)->

					_.getModulesCount(row['textbook_id'])
					.then (modules_count)->
						console.log 'getModulesCount done'

						_.getTextbookOptions(row['term_id'])
						.then (options)->
							console.log 'getTextbookOptions done'

							_.getChapterCount(row['term_id'])
							.then (chapter_count)->
								console.log 'getChapterCount done'

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

								i = i + 1
								if i < textbookData.rows.length
									forEach textbookData.rows.item(i), i
								else 
									defer.resolve result


				forEach textbookData.rows.item(0), 0
					

			defer.promise()



		# Get meta_value i.e serialized string containing textbook ids assigned to the logged in user
		# and return the unserialized array. 
		getTextBookIds : ->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				ids = _.unserialize(data.rows.item(0)['meta_value'])
				ids = _.compact ids
				defer.resolve ids


			_.db.transaction (tx)->

				tx.executeSql "SELECT meta_value 
								FROM wp_usermeta 
								WHERE meta_key=? 
								AND user_id=?"
								, ['textbooks', _.getUserID()]

				, onSuccess, _.transactionErrorHandler

			defer.promise()

		
		
		# Get list of textbooks based on class id and division.
		getTextbooksByClassIdAndDivision : (class_id, division)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				defer.resolve data

			
			_.getTextBookIds()
			.then (textbook_ids)->
				console.log 'getTextBookIds done'

				_.db.transaction (tx)->

					pattern = '%"'+class_id+'"%'

					tx.executeSql "SELECT * FROM wp_terms t, wp_term_taxonomy tt 
									LEFT OUTER JOIN wp_textbook_relationships wtr 
									ON t.term_id=wtr.textbook_id 
									WHERE t.term_id=tt.term_id 
									AND tt.taxonomy='textbook' 
									AND tt.parent=0
									AND wtr.class_id LIKE '"+pattern+"' 
									AND wtr.textbook_id IN ("+textbook_ids+")"
									, []

					, onSuccess, _.transactionErrorHandler


			defer.promise()



			# runQuery = ->

			# 	$.Deferred (d)->
			# 		textbookIds = _.getTextBookIds()
			# 		textbookIds.done (textbook_ids)->

			# 			_.db.transaction (tx)->
			# 				pattern = '%"'+class_id+'"%'
			# 				tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt 
			# 					LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id 
			# 					WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0
			# 					AND wtr.class_id LIKE '"+pattern+"' AND wtr.textbook_id IN ("+textbook_ids+")"
			# 					, [], onSuccess(d) , _.deferredErrorHandler(d));
							

			# onSuccess = (d)->
			# 	(tx, data)->

			# 		result = []

			# 		for i in [0..data.rows.length-1] by 1

			# 			row = data.rows.item(i)

			# 			do (row ,i)->
			# 				modulesCount = _.getModulesCount(row['textbook_id'])
			# 				modulesCount.done (modules_count)->

			# 					do(row, i, modules_count)->
			# 						textbookOptions = _.getTextbookOptions(row['term_id'])
			# 						textbookOptions.done (options)->

			# 							do(row, i, modules_count, options)->
			# 								chapterCount = _.getChapterCount(row['term_id'])
			# 								chapterCount.done (chapter_count)->

			# 									# do(row, i, modules_count, options, chapter_count)->
			# 									# 	chapterStatusCount = 
			# 									# 	_.getCountOfChaptersStatuses(row['term_id'], division)
			# 									# 	chapterStatusCount.done (chapter_status_count)->
			# 									# 		console.log 'chapterStatusCount'
			# 									# 		console.log chapter_status_count

			# 									result[i] = 
			# 										term_id: row["term_id"]
			# 										name: row["name"]
			# 										slug: row["slug"]
			# 										term_group: row["term_group"]
			# 										term_taxonomy_id: row["term_taxonomy_id"]
			# 										taxonomy: row["taxonomy"]
			# 										description: row["description"]
			# 										parent: row["parent"]
			# 										count: row["count"]
			# 										classes: _.unserialize(row["class_id"])
			# 										subjects: _.unserialize(row["tags"])
			# 										modules_count: modules_count
			# 										author: options.author
			# 										thumbnail: options.attachmenturl
			# 										cover_pic: options.attachmenturl
			# 										filter: 'raw'
			# 										chapter_count : chapter_count


			# 		d.resolve(result)
			
			# $.when(runQuery()).done (data)->
			# 	console.log 'getTextbooksByClassIdAndDivision transaction completed'
			# .fail _.failureHandler


		
		# Get the total number of modules for each textbook having status as 'publish'
		getModulesCount : (textbook_id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				modules_count = data.rows.item(0)['count']
				defer.resolve(modules_count)


			_.db.transaction (tx)->

				pattern = '%"'+textbook_id+'"%'

				tx.executeSql "SELECT COUNT(id) AS count 
								FROM wp_content_collection 
								WHERE term_ids LIKE '"+pattern+"' 
								AND status=?"
								, ['publish']

				, onSuccess, _.transactionErrorHandler


			defer.promise()


		
		# Get additional textbook options such as author name and textbook image url.
		# Here the url is modified to fetch textbook images from local directory.
		getTextbookOptions : (id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				options = author:'', attachmenturl:''

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
		




		#TODO: Incomplete task: Getting count of chapter statuses
		getCountOfChaptersStatuses : (textbook_id, division)->

			defer = $.Deferred()

			_.getStatusForTextbook(textbook_id, division)
			.then (status)->
				console.log 'getStatusForTextbook done'

				chapterStatusCount = 
					chapters_completed : _.size(status.completed)
					chapters_in_progress : _.size(status.in_progress)
					chapters_not_started : _.size(status.not_started)


				defer.resolve chapterStatusCount

			
			defer.promise()

		
		
		getStatusForTextbook : (textbook_id, division)->

			defer = $.Deferred()

			textbookStatus = completed:[], in_progress:[], not_started:[]

			_.getChaptersByParentId(textbook_id)
			.then (chapters)->
				console.log 'getChaptersByParentId done'

				forEach = (chapter, i)->

					chapterId = chapter.term_id

					_.getStatusForChapter(chapterId, division)
					.then (result)->
						console.log 'getStatusForChapter done'

						if _.size(result.all_modules) is _.size(result.completed)
							textbookStatus.completed.push(chapterId)

						else if _.size(result.in_progress) > 0
							textbookStatus.in_progress.push(chapterId)

						else textbookStatus.not_started.push(chapterId)


						i = i + 1
						if i < chapters.length
							forEach chapters[i], i
						else
							defer.resolve textbookStatus

				
				forEach chapters[0], 0


			defer.promise()



		getStatusForChapter : (chapter_id, division)->

			chapterStatus = all_modules:[], completed:[], in_progress:[], not_started:[]

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						pattern = '%"'+chapter_id+'"%'
						tx.executeSql("SELECT id FROM wp_content_collection WHERE 
							term_ids LIKE '"+pattern+"' AND status=?", ['publish']
							, onSuccess(d), _.deferredErrorHandler(d))


			onSuccess = (d)->
				(tx, data)->

					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)

						do(row, i)->
							chapterStatus.all_modules[i] = row['id']

							contentPieces = _.getContentPiecesAndDescription(row['id'])
							contentPieces.done (result)->

								content_pieces = _.unserialize(result.content_pieces)

								do(row, content_pieces)->
									moduleStatus = _.getDateAndStatus(row['id'], division, content_pieces)
									moduleStatus.done (result)->

										status = result.status

										if status is 'completed'
											chapterStatus.completed.push(row['id'])

										else if status is 'started'
											chapterStatus.in_progress.push(row['id'])

										else chapterStatus.not_started.push(row['id'])


					d.resolve chapterStatus

			$.when(runQuery()).done ->
				console.log 'getStatusForChapter transaction completed'
			.fail _.failureHandler


