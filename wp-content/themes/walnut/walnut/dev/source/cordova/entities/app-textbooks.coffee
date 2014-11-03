define ['underscore'], ( _) ->

	#Functions related to textbooks entity

	_.mixin


		cordovaTextbookCollection : (class_id, division)->

			defer = $.Deferred()

			result = []

			_.getTextbooksByClassIdAndDivision(class_id, division)
			.then (textbookData)->
				console.log 'getTextbooksByClassIdAndDivision done'

				length = textbookData.rows.length

				if length is 0
					defer.resolve result
				else
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

									_.getCountOfChaptersStatuses(row['term_id'], division)
									.then (chptStsCnt)->
										console.log 'getCountOfChaptersStatuses done'

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
											chapters_completed: chptStsCnt.completed
											chapters_in_progress: chptStsCnt.in_progress
											chapters_not_started: chptStsCnt.not_started

										i = i + 1
										if i < length
											forEach textbookData.rows.item(i), i
										else 
											defer.resolve result


					forEach textbookData.rows.item(0), 0
					

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


		
		getCountOfChaptersStatuses : (textbook_id, division)->

			defer = $.Deferred()

			_.getStatusForTextbook(textbook_id, division)
			.then (status)->
				console.log 'getStatusForTextbook done'

				chapterStatusCount = 
					completed : _.size(status.completed)
					in_progress : _.size(status.in_progress)
					not_started : _.size(status.not_started)


				defer.resolve chapterStatusCount

			
			defer.promise()

		
		
		getStatusForTextbook : (textbook_id, division)->

			defer = $.Deferred()

			textbookStatus = completed:[], in_progress:[], not_started:[]

			_.getChaptersByParentId(textbook_id)
			.then (chapters)->
				console.log 'getChaptersByParentId done'

				length = chapters.length

				if length is 0
					defer.resolve textbookStatus
				else 
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
							if i < length
								forEach chapters[i], i
							else
								defer.resolve textbookStatus

					
					forEach chapters[0], 0


			defer.promise()



		getStatusForChapter : (chapter_id, division)->

			defer = $.Deferred()

			chapterStatus = all_modules:[], completed:[], in_progress:[], not_started:[]

			onSuccess = (tx, data)->

				length = data.rows.length

				if length is 0
					defer.resolve chapterStatus
				else
					forEach = (row, i)->

						chapterStatus.all_modules[i] = row['id']

						_.getContentPiecesAndDescription(row['id'])
						.then (contentPiecesAndDescription)->
							console.log 'getContentPiecesAndDescription done'

							content_pieces = _.unserialize(contentPiecesAndDescription.content_pieces)

							_.getDateAndStatus(row['id'], division, content_pieces)
							.then (dateAndStatus)->
								console.log 'getDateAndStatus done'

								status = dateAndStatus.status

								if status is 'completed'
									chapterStatus.completed.push(row['id'])

								else if status is 'started'
									chapterStatus.in_progress.push(row['id'])

								else chapterStatus.not_started.push(row['id'])


								i = i + 1
								if i < length
									forEach data.rows.item(i), i 
								else
									defer.resolve chapterStatus


					forEach data.rows.item(0), 0


			_.db.transaction (tx)->

				pattern = '%"'+chapter_id+'"%'

				tx.executeSql "SELECT id 
								FROM wp_content_collection 
								WHERE term_ids 
								LIKE '"+pattern+"' 
								AND status=?"
								, ['publish']

				, onSuccess, _.transactionErrorHandler


			defer.promise()




		getTextBookByTextbookId : (id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

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

				tx.executeSql "SELECT * 
							FROM wp_terms t, wp_term_taxonomy tt 
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

			onSuccess = (tx, data)->

				result = []

				length = data.rows.length

				if length is 0
					defer.resolve result
				else
					forEach = (row, i)->

						result[i] =
							id: row['term_id']
							name: row['name']

						
						i = i + 1
						if i < length
							forEach data.rows.item(i), i 
						else
							defer.resolve result


					forEach data.rows.item(0), 0


			_.db.transaction (tx)->

				tx.executeSql "SELECT term_id, name 
								FROM wp_terms 
								WHERE term_id 
								IN ("+ids+")"
								, []

				, onSuccess, _.transactionErrorHandler

			defer.promise()


