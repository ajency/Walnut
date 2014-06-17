define ['underscore', 'csvparse'], ( _, parse) ->

	#File import

	_.mixin

		startFileImport : ->

			$('#syncSuccess').css("display","block").text("Starting file import...")

			setTimeout(=>
				_.insertIntoWpClassDivisions()
			,2000)


		
		parseCSVToJSON : (fileName)->

			readFile = ->
				$.Deferred (d)->
					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fileSystem)->
						fileSystem.root.getFile("SynapseAssets/SynapseData/"+fileName, {create: false}
							, (fileEntry)->
								fileEntry.file((file)->

									reader = new FileReader()
									reader.onloadend = (evt)->
										csvString = evt.target.result
										parsedObj = $.parse(csvString, {header : false, dynamicTyping : false})
										parsedData = parsedObj.results

										do(parsedData)->
											_.each parsedData, (outerRow, i)->
												_.each outerRow, (innerRow, j)->
													# Replace back slash (/) with double quote (")
													parsedData[i][j] = parsedData[i][j].replace(/\\/g,'"')

										d.resolve parsedData

									reader.readAsText file

								, _.fileErrorHandler)
							, _.fileErrorHandler)
					, _.fileSystemErrorHandler)

			$.when(readFile()).done ->
				console.log 'parseCSVToJSON done for file '+fileName
			.fail _.failureHandler



		# Insert data into 13 tables
		insertIntoWpClassDivisions : ->

			$('#syncSuccess').css("display","block").text("Importing file...")

			getParsedData = parseCSVToJSON _.getTblPrefix()+'class_divisions.csv'
			getParsedData.done (data)->
				_.db.transaction((tx)->
					tx.executeSql("DELETE FROM "+_.getTblPrefix()+"class_divisions")
					
					_.each data, (row, i)->
						tx.executeSql("INSERT INTO "+_.getTblPrefix()+"class_divisions (id, division, class_id) 
							VALUES (?,?,?)", [row[0], row[1], row[2]])

				,_.transactionErrorhandler
				,(tx)->
					console.log 'Inserted data in '+_.getTblPrefix()+'class_divisions'
					_.insertIntoWpQuestionResponse()
				)


		insertIntoWpQuestionResponse : ->

			getParsedData = parseCSVToJSON _.getTblPrefix()+'question_response.csv'
			getParsedData.done (data)->
				_.db.transaction((tx)->
					tx.executeSql("DELETE FROM "+_.getTblPrefix()+"question_response")

					_.each data, (row, i)->
						tx.executeSql("INSERT INTO "+_.getTblPrefix()+"question_response (ref_id, teacher_id
							, content_piece_id, collection_id, division , question_response , time_taken 
							, start_date, end_date, status, sync) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
							, [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]
							, row[9], 1])

				,_.transactionErrorhandler
				,(tx)->
					console.log 'Inserted data in '+_.getTblPrefix()+'question_response'
					_.insertIntoWpCollectionMeta()
				)


		insertIntoWpCollectionMeta : ->

			getParsedData = parseCSVToJSON 'wp_collection_meta.csv'
			getParsedData.done (data)->
				_.db.transaction((tx)->
					tx.executeSql("DELETE FROM wp_collection_meta")

					_.each data, (row, i)->
						tx.executeSql("INSERT INTO wp_collection_meta (id, collection_id, meta_key, meta_value) 
							VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]])

				,_.transactionErrorhandler
				,(tx)->
					console.log 'Inserted data in wp_collection_meta'
					_.insertIntoWpContentCollection()
				)

		
		insertIntoWpContentCollection : ->

			getParsedData = parseCSVToJSON 'wp_content_collection.csv'
			getParsedData.done (data)->
				_.db.transaction((tx)->
					tx.executeSql("DELETE FROM wp_content_collection")

					_.each data, (row, i)->
						tx.executeSql("INSERT INTO wp_content_collection (id, name, created_on, created_by
							, last_modified_on, last_modified_by, published_on, published_by, status, type
							, term_ids, duration) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
							, [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9]
							, row[10], row[11]])

				,_.transactionErrorhandler
				,(tx)->
					console.log 'Inserted data in wp_content_collection'
					@sendParsedData6 file5 ,fileEntry
				)


		insertIntoWpOptions : ->

			getParsedData = parseCSVToJSON 'wp_options.csv'
			getParsedData.done (data)->
				_.db.transaction((tx)->
					tx.executeSql("DELETE FROM wp_options")

					_.each data, (row, i)->
						tx.executeSql("INSERT INTO wp_options (option_id, option_name, option_value, autoload) 
							VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]])

				,_.transactionErrorhandler
				,(tx)->
					console.log 'Inserted data in wp_options'
					_.insertIntoWpPostMeta()
				)


		insertIntoWpPostMeta : ->

			getParsedData = parseCSVToJSON 'wp_postmeta.csv'
			getParsedData.done (data)->
				_.db.transaction((tx)->
					tx.executeSql("DELETE FROM wp_postmeta")

					_.each data, (row, i)->
						tx.executeSql("INSERT INTO wp_postmeta (meta_id, post_id, meta_key, meta_value) 
							VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]])

				,_.transactionErrorhandler
				,(tx)->
					console.log 'Inserted data in wp_postmeta'
					_.insertIntoWpPosts()
				)


		insertIntoWpPosts : ->

			getParsedData = parseCSVToJSON 'wp_posts.csv'
			getParsedData.done (data)->
				_.db.transaction((tx)->
					tx.executeSql("DELETE FROM wp_posts")

					_.each data, (row, i)->
						tx.executeSql("INSERT INTO wp_posts (ID, post_author, post_date, post_date_gmt
							, post_content, post_title, post_excerpt, post_status, comment_status
							, ping_status, post_password, post_name, to_ping, pinged, post_modified
							, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order
							, post_type, post_mime_type, comment_count) 
							VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
							, [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9]
							, row[10], row[11], row[12], row[13], row[14], row[15], row[16], row[17], row[18]
							, row[19], row[20], row[21], row[22]])

				,_.transactionErrorhandler
				,(tx)->
					console.log 'Inserted data in wp_posts'
					_.insertIntoWpTermRelationships()
				)

		
		insertIntoWpTermRelationships : ->

			getParsedData = parseCSVToJSON 'wp_term_relationships.csv'
			getParsedData.done (data)->
				_.db.transaction((tx)->
					tx.executeSql("DELETE FROM wp_term_relationships")

					_.each data, (row, i)->
						tx.executeSql("INSERT INTO wp_term_relationships (object_id, term_taxonomy_id
							, term_order) VALUES (?,?,?)", [row[0], row[1], row[2]])

				,_.transactionErrorhandler
				,(tx)->
					console.log 'Inserted data in wp_term_relationships'
					_.insertIntoWpTermTaxonomy()
				)


		insertIntoWpTermTaxonomy : ->

			getParsedData = parseCSVToJSON 'wp_term_taxonomy.csv'
			getParsedData.done (data)->
				_.db.transaction((tx)->
					tx.executeSql("DELETE FROM wp_term_taxonomy")

					_.each data, (row, i)->
						tx.executeSql("INSERT INTO wp_term_taxonomy (term_taxonomy_id, term_id, taxonomy
							, description, parent, count) VALUES (?,?,?,?,?,?)"
							, [row[0], row[1], row[2], row[3], row[4], row[5]])

				,_.transactionErrorhandler
				,(tx)->
					console.log 'Inserted data in wp_term_taxonomy'
					_.insertIntoWpTerms()
				)


		insertIntoWpTerms : ->

			getParsedData = parseCSVToJSON 'wp_terms.csv'
			getParsedData.done (data)->
				_.db.transaction((tx)->
					tx.executeSql("DELETE FROM wp_terms")

					_.each data, (row, i)->
						tx.executeSql("INSERT INTO wp_terms (term_id, name, slug, term_group) 
							VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Inserted data in wp_terms'
					_.insertIntoWpTextbookRelationships()
				)


		insertIntoWpTextbookRelationships : ->

			















		
			

