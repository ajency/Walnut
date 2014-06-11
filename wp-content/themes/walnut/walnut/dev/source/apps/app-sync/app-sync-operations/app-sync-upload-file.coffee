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
				syncController = App.request "get:sync:controller"
				syncController.getDownloadURL()
	
			,2000)


		onFileUploadError : ->

			$('#syncSuccess').css("display","none")

			$('#syncStartContinue').css("display","block")
			$('#syncButtonText').text('Try again')

			$('#syncError').css("display","block")
			.text("An error occurred during file upload")