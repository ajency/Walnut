define ['underscore'], ( _)->

	# Cordova local storage functions

	_.mixin

		cordovaLocalStorage : ->

			_.localStorage = window.localStorage

		#save for trmporary purpose the cookies values
		setCookiesValue : (cookiesValue)->
			_.localStorage.setItem("CookiesVal", cookiesValue)


		getCookiesValue : ->
			_.localStorage.getItem("CookiesVal");


		# save/get logged in user ID
		setUserEmail : (u_email)->
			_.localStorage.setItem("user_email", u_email)

		getUserEmail : ->
			_.localStorage.getItem("user_email");


		# save/get logged in user ID
		setUserID : (id)->
			_.localStorage.setItem("user_id", id)

		getUserID : ->
			_.localStorage.getItem("user_id")


		# save/get logged in username
		setUserName : (name)->
			_.localStorage.setItem("user_name", name)

		getUserName : ->
			_.localStorage.getItem("user_name")    


		# save/get blog id
		setBlogID : (id)->
			_.localStorage.setItem("blog_id", id)

		getBlogID : ->
			_.localStorage.getItem("blog_id")


		# save/get blog name
		setBlogName : (name)->
			_.localStorage.setItem("blog_name", name)

		getBlogName : ->
			_.localStorage.getItem("blog_name")


		# save/get site url
		setSiteUrl : (url)->
			_.localStorage.setItem("site_url", url)

		getSiteUrl : ->
			_.localStorage.getItem("site_url")


		# save/get student division
		setStudentDivision : (division)->
			_.localStorage.setItem("student_division", division)

		getStudentDivision : ->
			_.localStorage.getItem("student_division")


		# save/get user capabilities
		setUserCapabilities : (allcaps)->
			_.localStorage.setItem("user_capabilities", JSON.stringify(allcaps))

		getUserCapabilities : ->
			JSON.parse(_.localStorage.getItem("user_capabilities"))


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