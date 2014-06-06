define ['underscore', 'unserialize', 'json2csvparse', 'jszip'], ( _) ->

	#File generation 

	_.mixin

		generateZipFile : ->

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

								, _.fileErrorHandler)
							
						, _.fileErrorHandler)

				, _.fileSystemErrorHandler)
		
		
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
									, row.end_date, row.status, row.sync]

					d.resolve question_response_data

			$.when(runQuery()).done ->
				console.log 'getDataFromQuestionResponse transaction completed'
			.fail _.failureHandler