define ['underscore', 'bootbox'], ( _ ,bootbox ) ->

	#File download

	_.mixin

		getZipFileDownloadDetails : ->

			$('#syncSuccess').css("display","block").text("Starting file download...")

			userDetails = _.getUserDetails(_.getUserID())
			userDetails.done (userDetails)->
				blog_id = userDetails.blog_id

				lastDownloadTimestamp = _.getLastDownloadTimeStamp()
				lastDownloadTimestamp.done (time_stamp)->

					data = blog_id: blog_id, last_sync: time_stamp
						, user_id: _.getUserID()
						, sync_type : "student_app"

					console.log JSON.stringify data

					#TODO: Change action name for import.
					$.get AJAXURL + '?action=sync-database',
							data,
							(resp)=>
								
								console.log JSON.stringify resp
								if resp is 0
									
									userInfo = _.getUserDetails(_.getUserID())
									userInfo.done (user_Details)->
										_.removeCordovaBackbuttonEventListener()
										
										_.setUserID(null)
										_.setTblPrefix(null)

										user = App.request "get:user:model"
										user.clear()

										App.leftNavRegion.close()
										App.headerRegion.close()
										App.mainContentRegion.close()
										App.breadcrumbRegion.close()

										bootbox.alert "Hi, your session has expired. Please log in to continue"
										username = user_Details.username
										setTimeout(=>
											App.navigate "login/"+username, trigger:true
											$('#onOffSwitch').prop
												"disabled" : true, "checked" : true
										,1000)
								else
									console.log 'getZipFileDownloadDetails response'
									console.log JSON.stringify resp
									_.downloadZipFile resp

							,
							'json'

					.fail ->
						_.onDataSyncError("none", "Could not connect to server")


		
		downloadZipFile : (resp)->

			$('#syncSuccess').css("display","block").text("Downloading file...")
			uri = encodeURI resp.exported_csv_url

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0
				,(fileSystem)=>
					fileSystem.root.getFile("SynapseAssets/SynapseData/csv-synapse.zip"
						, {create: true, exclusive: false}

						,(fileEntry)->
							filePath = fileEntry.toURL().replace("csv-synapse.zip", "")

							fileEntry.remove()

							fileTransfer = new FileTransfer()
							
							fileTransfer.download(uri, filePath+"csv-synapse.zip" 
								,(file)->
									_.onFileDownloadSuccess(file.toURL(), filePath, resp.last_sync)
								
								,(error)->
									_.onDataSyncError(error, "An error occurred during file download")

								, true)

						,_.fileErrorHandler)

				, _.fileSystemErrorHandler)


		
		onFileDownloadSuccess : (source, destination, last_sync)->

			console.log 'Downloaded Zip file successfully'
			

			# Unzip downloaded file
			onFileUnzipSuccess = ->

				console.log 'Files unzipped successfully'

				_.updateSyncDetails('file_download', last_sync)
				
				$('#syncSuccess').css("display","block").text("File download completed")
				
				setTimeout(=>
					_.startFileImport()
				,2000)
				
				
			zip.unzip(source, destination, onFileUnzipSuccess)