define ['underscore', 'jquery', 'fastclick'], (_, $, FastClick)->

	
	# Cordova device ready event

	onDeviceReady = ->

		# Open pre-populated SQLite database file.
		_.cordovaOpenPrepopulatedDatabase()

		# 'FastClick' helps to reduce the 400ms click delay.
		FastClick.attach(document.body)

		# Change 'AJAXURL' based on version name
		cordova.getAppVersion().then((version)->

			if version.indexOf('Production') is 0
				`AJAXURL = "http://synapselearning.net/wp-admin/admin-ajax.php";`

			if version.indexOf('Staging') is 0
				`AJAXURL = "http://synapsedu.info/wp-admin/admin-ajax.php";`
		)
	   

	
	document.addEventListener("deviceready", onDeviceReady, false)