define ['underscore'], ( _) ->

	#File upload

	_.mixin

		uploadGeneratedZipFile: ->

			$('#syncSuccess').css("display","block").text("Starting file upload...")
			
			zipFilePath = _.getGeneratedZipFilePath()

			uploadURI = encodeURI(AJAXURL + '?action=sync-app-data')

			options = new FileUploadOptions()

			options.fileKey = "file"
			options.fileName = zipFilePath.substr(zipFilePath.lastIndexOf('/') + 1)
			options.mimeType = "application/octet";
			
			params = blog_id : _.getBlogID()
			options.params = params

			fileTransfer = new FileTransfer()

			fileTransfer.upload(zipFilePath, uploadURI
				
				, (success)->

					response = JSON.parse success.response
					_.setSyncRequestId response.sync_request_id

					_.onFileUploadSuccess()

					console.log "CODE: " + success.responseCode
					console.log "RESPONSE: " + success.response
					console.log "BYTES SENT: " + success.bytesSent

				, (error)->

					_.onFileUploadError()

					console.log "UPLOAD ERROR SOURCE" + error.source
					console.log "UPLOAD ERROR TARGET" + error.target

				, options)


		
		onFileUploadSuccess : ->

			_.updateSyncDetails('file_upload', _.getCurrentDateTime(2))

			$('#syncSuccess').css("display","block").text("File upload completed...")

			setTimeout(=>
				_.checkIfServerImportOperationCompleted()
			,2000)


		
		checkIfServerImportOperationCompleted : ->

			$('#syncSuccess').css("display","block").text("Please wait...")

			setTimeout(=>

				data = blog_id : _.getBlogID()

				$.get AJAXURL + '?action=check-app-data-sync-completion&sync_request_id='+_.getSyncRequestId(),
					data,
					(resp)=>
						console.log 'Sync completion response'
						console.log resp

						if not resp
							_.checkIfServerImportOperationCompleted()
						else
							_.getZipFileDownloadDetails()
					,
					'json'
	
			,10000)



		onFileUploadError : ->

			$('#syncSuccess').css("display","none")

			$('#syncStartContinue').css("display","block")
			$('#syncButtonText').text('Try again')

			$('#syncError').css("display","block")
			.text("An error occurred during file upload")