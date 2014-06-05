define ['underscore', 'unserialize', 'json2csvparse', 'zip'], ( _) ->

	#File generation 

	_.mixin

		#get all data from wp_question_response where sync=0
		getDataFromQuestionResponse : ->
			alert "1"
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
							question_response_data[i] = [row.ref_id, row.content_piece_id
									, row.collection_id, row.division, row.question_response
									, row.time_taken, row.start_date, row.end_date
									, row.status, row.sync]

					d.resolve question_response_data

			$.when(runQuery()).done ->
				alert "getDataFromQuestionResponse transaction completed"
				console.log 'getDataFromQuestionResponse transaction completed'
				_.getDataFromQuestionResponse1()
			.fail _.failureHandler

		getDataFromQuestionResponse1 : ->
			alert "2"
			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"question_response ", [], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					question_response_data = new Array()

					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)

						do(i, row)->
							question_response_data[i] = [row.ref_id, row.content_piece_id
									, row.collection_id, row.division, row.question_response
									, row.time_taken, row.start_date, row.end_date
									, row.status, row.sync]

					d.resolve question_response_data

			$.when(runQuery()).done ->
				alert 'getDataFromQuestionResponse transaction completed for all data'
				console.log 'getDataFromQuestionResponse transaction completed for all data'
				_.getDataFromQuestionResponse2()
			.fail _.failureHandler

		getDataFromQuestionResponse2 : ->
			alert "3"
			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"question_response 
							WHERE sync=1", [], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					question_response_data = new Array()

					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)

						do(i, row)->
							question_response_data[i] = [row.ref_id, row.content_piece_id
									, row.collection_id, row.division, row.question_response
									, row.time_taken, row.start_date, row.end_date
									, row.status, row.sync]

					d.resolve question_response_data

			$.when(runQuery()).done ->
				alert 'getDataFromQuestionResponse transaction completed for all  sync 1'
				console.log 'getDataFromQuestionResponse transaction completed for sync 1'
			.fail _.failureHandler


		convertDataToCSV : ->

			questionResponseData = _.getDataFromQuestionResponse()
			questionResponseData.done (question_response_data)->
						
				csvData = ConvertToCSV JSON.stringify(question_response_data)
				console.log "CSV Data"
				console.log csvData

				_.createZipFile(csvData)


		createZipFile : (csvData) ->

			zip = new JSZip()
			zip.file(''+_.getTblPrefix()+'question_response.csv', csvData)
			content = zip.generate({type:"text/plain"})

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
				,(fileSystem)->
					fileSystem.root.getFile("SynapseAssets/csv-export.zip"
						, {create: true, exclusive: false}
						
						,(fileEntry)->
							fileEntry.createWriter(
								(writer)->
									writer.write(content)

								, _.fileErrorHandler)
							
						, _.fileErrorHandler)

				, _.fileSystemErrorHandler)