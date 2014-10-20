define ['underscore', 'bootbox'], ( _ ,bootbox ) ->

	#File upload

	_.mixin

		uploadGeneratedZipFile: ->
			userDetails = _.getUserDetails(_.getUserID())
			userDetails.done (userDetails)->
				blog_id = userDetails.blog_id

				$('#syncSuccess').css("display","block").text("Starting file upload...")
				
				zipFilePath = _.getGeneratedZipFilePath()

				uploadURI = encodeURI(AJAXURL + '?action=sync-app-data')

				options = new FileUploadOptions()

				options.fileKey = "file"
				options.fileName = zipFilePath.substr(zipFilePath.lastIndexOf('/') + 1)
				options.mimeType = "application/octet";
				
				params = blog_id : blog_id
				options.params = params

				fileTransfer = new FileTransfer()

				fileTransfer.upload(zipFilePath, uploadURI
					
					, (success)->

						response = JSON.parse success.response
						#This condition will check if the session id has expired 
						#and navigate the user to the log in page
						
						if response is 0
							
							userInfo = _.getUserDetails(_.getUserID())
							userInfo.done (user_Details)->
								_.removeCordovaBackbuttonEventListener()
								
								_.setUserID(null)
								_.setTblPrefix(null)

								user = App.request "get:user:model"
								user.clear()
								bootbox.alert "Hi, your session has expired. Please log in to continue"
								App.leftNavRegion.close()
								App.headerRegion.close()
								App.mainContentRegion.close()
								App.breadcrumbRegion.close()

								username = user_Details.username
								setTimeout(=>
									App.navigate "login/"+username, trigger:true
									$('#onOffSwitch').prop
										"disabled" : true, "checked" : true
								,1000)
								


						else
							_.setSyncRequestId response.sync_request_id

							_.onFileUploadSuccess()

						console.log "CODE: " + success.responseCode
						console.log "RESPONSE: " + success.response
						console.log "BYTES SENT: " + success.bytesSent

					, (error)->

						_.onDataSyncError(error, "An error occurred during file upload")

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
			userDetails = _.getUserDetails(_.getUserID())
			userDetails.done (userDetails)->
				blog_id = userDetails.blog_id

				escaped = $('<div>').text("Please wait...\nThis should take a few minutes").text()
				$('#syncSuccess').css("display","block").html(escaped.replace(/\n/g, '<br />'))

				setTimeout(=>

					data = blog_id : blog_id

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

					.fail ->
						_.onDataSyncError("none", "Could not connect to server")
		
				,10000)