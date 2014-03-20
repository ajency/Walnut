define ['app'
		'plupload'
		'text!apps/media/upload/templates/upload.html'
		], (App, plupload, uploadTpl)->
	
			App.module 'Media.Upload.Views', (Views, App)->

				class Views.UploadView extends Marionette.ItemView

					template: uploadTpl 

					# setup plupload on show
					# the url for plupload will be async-upload.php(wordpress default)
					# this plupload configuration is copied over from wordpress core
					# Note: do not change these settings
					onShow:->
						#bind plupload script
						@uploader = new plupload.Uploader
												runtimes		: "gears,html5,flash,silverlight,browserplus"
												file_data_name	: "async-upload" # key passed to $_FILE.
												multiple_queues	: true
												browse_button	: "choosefiles"
												multipart 		: true
												urlstream_upload: true
												max_file_size 	: "10mb"
												url 			: UPLOADURL
												flash_swf_url	: SITEURL + "/wp-includes/js/plupload/plupload.flash.swf"
												silverlight_xap_url: SITEURL + "/wp-includes/js/plupload/plupload.silverlight.xap"
												filters: [
													title: "Image files"
													extensions: "jpg,gif,png"
												]
												multipart_params:
													action: "upload-attachment"
													_wpnonce: _WPNONCE
						
						
						@uploader.init()

						@uploader.bind "FilesAdded", (up, files)=>
							@uploader.start()
							@$el.find("#progress").show()
					  
						@uploader.bind "UploadProgress",(up, file)=>
							console.log file
							@$el.find(".progress-bar").css "width", file.percent + "%"
						
						@uploader.bind "Error", (up, err)=>
							up.refresh() # Reposition Flash/Silverlight

						@uploader.bind "FileUploaded", (up, file, response)=>
							@$el.find(".progress-bar").css "width", "0%"
							@$el.find("#progress").hide()
							response = JSON.parse(response.response)
							if response.success
								App.execute "new:media:added", response.data

					# destroyt the plupload instance on close to release memory
					onClose:->
						@uploader.destroy()
							
								