define ['underscore', 'unserialize', 'json2csvparse', 'jszip'], ( _) ->

	#File generation 

	_.mixin

		generateZipFile : ->

			$('#syncSuccess').css("display","block").text("Generating file...")

			questionResponseData = _.getDataFromQuestionResponse()
			questionResponseData.done (question_response_data)->

				questionResponseMetaData = _.getDataFromQuestionResponseMeta()
				questionResponseMetaData.done (question_response_meta_data)->

					question_response_data = _.convertDataToCSV(question_response_data, 'question_response')
					question_response_meta_data = 
					_.convertDataToCSV(question_response_meta_data, 'question_response_meta')

					_.writeToZipFile(question_response_data, question_response_meta_data)


		convertDataToCSV : (data, table_name)->

			data = JSON.stringify data
			csvData = ConvertToCSV data
			
			console.log 'CSV Data for '+table_name
			console.log csvData

			csvData



		writeToZipFile : (question_response_data, question_response_meta_data) ->

			zip = new JSZip()
			zip.file(''+_.getTblPrefix()+'question_response.csv', question_response_data)
			zip.file(''+_.getTblPrefix()+'question_response_meta.csv', question_response_meta_data)
			content = zip.generate({type:"blob"})

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
				,(fileSystem)->
					fileSystem.root.getFile("SynapseAssets/SynapseData/csv-export-"+device.uuid+".zip"
						, {create: true, exclusive: false}
						
						,(fileEntry)->
							fileEntry.createWriter(
								(writer)->
									writer.write(content)
									
									_.setGeneratedZipFilePath fileEntry.toURL()

									_.onFileGenerationSuccess()

								, _.fileErrorHandler)
							
						, _.fileErrorHandler)

				, _.fileSystemErrorHandler)


		
		onFileGenerationSuccess : ->

			_.updateSyncDetails('file_generate', _.getCurrentDateTime(2))
			
			$('#syncSuccess').css("display","block").text("File generation completed...")
			
			_.updateSyncFlag('question_response')


		
		#Update 'sync' field to 1 in 'wp_question_response' and 'wp_question_response_meta' table 
		#after file generation.
		updateSyncFlag : (table_name)->

			_.db.transaction((tx)->
				tx.executeSql("UPDATE "+_.getTblPrefix()+table_name+" SET sync=? 
					WHERE sync=?", [1, 0])

			,_.transactionErrorhandler
			
			,(tx)->
				
				console.log 'Updated sync flag in '+table_name

				if table_name is 'question_response'
					_.updateSyncFlag('question_response_meta')

				else
					setTimeout(=>
						_.uploadGeneratedZipFile()
					,2000)
			)
		
		
		#Get all data from wp_question_response where sync=0
		getDataFromQuestionResponse : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"question_response 
							WHERE sync=?", [0], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					question_response_data = new Array()

					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)

						do(i, row)->
							question_response_data[i] = [row.ref_id, row.teacher_id
									, row.content_piece_id, row.collection_id, row.division
									, row.question_response, row.time_taken, row.start_date
									, row.end_date, row.status]

					d.resolve question_response_data

			$.when(runQuery()).done ->
				console.log 'getDataFromQuestionResponse transaction completed'
			.fail _.failureHandler


		#Get all data from wp_question_response_meta where sync=0
		getDataFromQuestionResponseMeta : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"question_response_meta 
							WHERE sync=?", [0], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					question_response_meta_data = new Array()

					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)

						do(i, row)->
							question_response_meta_data[i] = [row.qr_ref_id, row.meta_key, row.meta_value]

					d.resolve question_response_meta_data

			$.when(runQuery()).done ->
				console.log 'getDataFromQuestionResponseMeta transaction completed'
			.fail _.failureHandler