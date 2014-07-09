define ['underscore'], ( _) ->

	#Functions related to textbooks entity

	_.mixin

		getTextbooksByClassIdAndDivision : (class_id, division)->

			runQuery = ->

				textbook_ids = ''
				textbookIds = _.getTextBookIds()
				textbookIds.done (ids)=>
					textbook_ids = ids

				$.Deferred (d)->
					_.db.transaction (tx)->
						pattern = '%"'+class_id+'"%'
						tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt 
							LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id 
							WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0
							AND wtr.class_id LIKE '"+pattern+"' AND wtr.textbook_id IN ("+textbook_ids+")"
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

												do(row, i, modules_count, options, chapter_count)->
													chapterStatusCount = _.getCountOfChaptersStatuses(row['term_id'], division)
													chapterStatusCount.done (chapter_status_count)->
														console.log 'chapterStatusCount'
														console.log chapter_status_count

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


					d.resolve(result)
			
			$.when(runQuery()).done (data)->
				console.log 'getTextbooksByClassIdAndDivision transaction completed'
			.fail _.failureHandler


		# chapterStatusCount = _.getCountOfChaptersStatuses(99, 12341531)
		# chapterStatusCount.done (chapter_status_count)->
		# 	console.log 'chapterStatusCount'
		# 	console.log chapter_status_count

					



		getTextBookIds : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT meta_value FROM wp_usermeta 
							WHERE meta_key=? AND user_id=?", ['textbooks', _.getUserID()]
							, onSuccess(d), _.deferredErrorHandler(d))
			
			onSuccess = (d)->
				(tx, data)->
					ids = _.unserialize(data.rows.item(0)['meta_value'])
					ids = _.compact ids
					d.resolve ids

			$.when(runQuery()).done ->
				console.log 'getTextBookIds transaction completed'
			.fail _.failureHandler


		
		getModulesCount : (textbook_id)->

			pattern = '%"'+textbook_id+'"%'

			runQuery =->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT COUNT(id) AS count FROM wp_content_collection 
							WHERE term_ids LIKE '"+pattern+"' AND status=?", ['publish']
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->
				(tx,data)->
					modules_count = data.rows.item(0)['count']
					d.resolve(modules_count)

			$.when(runQuery()).done ->
				console.log 'getModulesCount transaction completed'
			.fail _.failureHandler


		#Get additional textbook options
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


		
		getCountOfChaptersStatuses : (textbook_id, division)->

			runFunc = ->
				$.Deferred (d)->

					textbookStatus = _.getStatusForTextbook(textbook_id, division)
					textbookStatus.done (data)->

						chapterStatusCount = 
							chapters_completed : _.size(data.completed)
							chapters_in_progress : _.size(data.in_progress)
							chapters_not_started : _.size(data.not_started)

						d.resolve chapterStatusCount

			$.when(runFunc()).done ->
				console.log 'getCountOfChaptersStatuses done'
			.fail _.failureHandler

		
		
		getStatusForTextbook : (textbook_id, division)->

			textbookStatus = completed:[], in_progress:[], not_started:[]

			runFunc = ->
				$.Deferred (d)->
					getChapters = _.getChaptersByParentId(textbook_id)
					getChapters.done (chapters)->

						_.each chapters, (chapter, i)->
							chapterId = chapter.term_id

							do(chapterId)->
								chapterStatus = _.getStatusForChapter(chapterId)
								chapterStatus.done (result)->

									if _.size(result.all_modules) is _.size(result.completed)
										textbookStatus.completed.push(chapterId)

									else if _.size(result.in_progress) > 0
										textbookStatus.in_progress.push(chapterId)

									else textbookStatus.not_started.push(chapterId)

						d.resolve textbookStatus

			$.when(runFunc()).done ->
				console.log 'getStatusForTextbook done'
			.fail _.failureHandler



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