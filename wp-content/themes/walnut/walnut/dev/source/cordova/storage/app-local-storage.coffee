define ['underscore'], ( _)->

	# Cordova local storage functions

	_.mixin

		cordovaLocalStorage : ->

			_.localStorage = window.localStorage


		# save/get logged in user ID
		setUserID : (id)->
			_.localStorage.setItem("user_id", id)

		getUserID : ->
			_.localStorage.getItem("user_id")

		
		# save/get table prefix
		setTblPrefix : (blog_id)->
			_.localStorage.setItem("table_prefix", 'wp_'+blog_id+'_')

		getTblPrefix : ->
			_.localStorage.getItem("table_prefix")


		# save/get school logo image source
		setSchoolLogoSrc : (src)->
			_.localStorage.setItem("school_logo_src", src)

		getSchoolLogoSrc : ->
			_.localStorage.getItem("school_logo_src")


		# save/get generated zip file path
		setGeneratedZipFilePath : (path)->
			_.localStorage.setItem("gererated_zip_file_path", path)

		getGeneratedZipFilePath : ->
			_.localStorage.getItem("gererated_zip_file_path")


		# save/get 'SynapseMedia' directory path
		setSynapseMediaDirectoryPath : (path)->
			_.localStorage.setItem("synapse_media_directory_path", path)

		getSynapseMediaDirectoryPath : ->
			_.localStorage.getItem("synapse_media_directory_path")


		# save/get sync request id
		setSyncRequestId : (id)->
			_.localStorage.setItem("sync_request_id", id)

		getSyncRequestId : ->
			_.localStorage.getItem("sync_request_id")

		# Check/Uncheck audio cues
		setAudioCues : (Value)->
			_.localStorage.setItem("check_uncheck_value", Value)

		getAudioCues : ->
			_.localStorage.getItem("check_uncheck_value")

		#Set the storage path selected by the user
		setStorageOption : (Value)->
			_.localStorage.setItem("storage_option", JSON.stringify(Value))

		getStorageOption : ->
			_.localStorage.getItem("storage_option")
