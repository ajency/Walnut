define ['underscore', 'unserialize', 'json2csvparse', 'jszip'], ( _) ->

	#File generation 

	_.mixin

		generateZipFile : ->

			$('#syncSuccess').css("display","block").text("Generating file...")

			questionResponseData = _.getDataFromQuestionResponse()
			questionResponseData.done (question_response_data)->

				_.convertDataToCSV question_response_data



		convertDataToCSV : (questionResponseData)->

			questionResponseData = JSON.stringify questionResponseData
			csvData = ConvertToCSV questionResponseData
			
			console.log "CSV Data"
			console.log csvData

			_.writeToZipFile csvData



		writeToZipFile : (csvData) ->

			zip = new JSZip()
			zip.file(''+_.getTblPrefix()+'question_response.csv', csvData)
			content = zip.generate({type:"blob"})

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
				,(fileSystem)->
					fileSystem.root.getFile("SynapseAssets/csv-export-"+device.uuid+".zip"
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
			
			_.updateQuestionResponseSyncFlag()


		
		#Update 'sync' field to 1 in 'wp_question_response' table after file generation.
		updateQuestionResponseSyncFlag : ->

			_.db.transaction((tx)->
				tx.executeSql("UPDATE "+_.getTblPrefix()+"question_response 
					SET sync=? WHERE sync=?", [1, 0])

			,_.transactionErrorhandler
			
			,(tx)->

				setTimeout(=>
					_.uploadGeneratedZipFile()
		
				,2000)

				console.log 'updateQuestionResponseSyncFlag transaction completed'
			)
		
		
		#Get all data from wp_question_response where sync=0
		getDataFromQuestionResponse : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"question_response 
							WHERE sync=0", [], onSuccess(d), _.deferredErrorHandler(d))

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