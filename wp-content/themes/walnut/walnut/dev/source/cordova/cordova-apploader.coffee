define ['cordova/app-error-handlers'
		
		#cordova database, local and persistent storage
		'cordova/storage/app-database-storage'
		'cordova/storage/app-local-storage'
		'cordova/storage/app-persistent-filesystem-storage'

		'cordova/app-functions'
		# 'cordova/app-file-download'
		# 'cordova/app-content-loader'
		
		#cordova on device ready
		'cordova/app-on-load'

		#cordova app entities
		'cordova/entities/cordova-app-entities-loader'
		], ->