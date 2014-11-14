define ['underscore', 'unserialize', 'json2csvparse', 'jszip'], ( _) ->

	#File generation 

	_.mixin

		generateZipFile : ->
			$('#storageOption').prop("disabled",true)
			
			$('#syncSuccess').css("display","block").text("Generating file...")

			quizQuestionResponseData = _.getDataFromQuizQuestionResponse()
			quizQuestionResponseData.done (quiz_question_response_data)->

				quizResponseSummaryData = _.getDataFromQuizResponseSummary()
				quizResponseSummaryData.done (quiz_response_summary_data)->

					quiz_question_response_data = _.convertDataToCSV(quiz_question_response_data, 'quiz_question_response')
					quiz_response_summary_data = 
					_.convertDataToCSV(quiz_response_summary_data, 'quiz_response_summary')

					_.writeToZipFile(quiz_question_response_data, quiz_response_summary_data)


		
		convertDataToCSV : (data, table_name)->

			data = JSON.stringify data
			csvData = ConvertToCSV data
			
			console.log 'CSV Data for '+table_name
			console.log csvData

			csvData




		writeToZipFile : (quiz_question_response_data, quiz_response_summary_data) ->

			zip = new JSZip()
			zip.file(''+_.getTblPrefix()+'quiz_question_response.csv', quiz_question_response_data)
			zip.file(''+_.getTblPrefix()+'quiz_response_summary.csv', quiz_response_summary_data)
			
			content = zip.generate({type:"blob"})


			value = _.getStorageOption()
			option = JSON.parse(value)
			if option.internal
				filepath = option.internal
			else if option.external
				filepath = option.external

			window.resolveLocalFileSystemURL('file://'+filepath+'' 
				,(fileSystem)->
					fileSystem.getFile("SynapseAssets/SynapseData/csv-export-"+device.uuid+".zip"
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
			
			_.updateSyncFlag('quiz_question_response')


		
		#Update 'sync' field to 1 in 'wp_quiz_question_response' and 'wp_question_response_meta' table 
		#after file generation.
		updateSyncFlag : (table_name)->

			_.db.transaction((tx)->
				tx.executeSql("UPDATE "+_.getTblPrefix()+table_name+" SET sync=? 
					WHERE sync=?", [1, 0])

			,_.transactionErrorhandler
			
			,(tx)->
				
				console.log 'Updated sync flag in '+table_name

				if table_name is 'quiz_question_response'
					_.updateSyncFlag('quiz_response_summary')

				else
					setTimeout(=>
						_.uploadGeneratedZipFile()
						#temporarily path changed
						# App.navigate('students/dashboard', trigger: true)
					,2000)
			)
		
		
		#Get all data from wp_quiz_question_response where sync=0
		getDataFromQuizQuestionResponse : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"quiz_question_response 
							WHERE sync=?", [0], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					quiz_question_response_data = new Array()

					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)

						do(i, row)->
							quiz_question_response_data[i] = [row.qr_id, row.summary_id
									, row.content_piece_id, row.question_response, row.time_taken
									, row.marks_scored, row.status]

					d.resolve quiz_question_response_data

			$.when(runQuery()).done ->
				console.log 'getDataFromQuizQuestionResponse transaction completed'
			.fail _.failureHandler


		#Get all data from wp_quiz_response_summary where sync=0
		getDataFromQuizResponseSummary : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"quiz_response_summary 
							WHERE sync=?", [0], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					quiz_response_summary_data = new Array()

					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)

						do(i, row)->
							quiz_response_summary_data[i] = [row.summary_id, row.collection_id
							, row.student_id, row.taken_on, row.quiz_meta]

					d.resolve quiz_response_summary_data

			$.when(runQuery()).done ->
				console.log 'getDataFromQuizResponseSummary transaction completed'
			.fail _.failureHandler