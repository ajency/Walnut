##
## The main dashboard App
##
define ['marionette'], (Marionette)->
	window.App = new Marionette.Application

# Main app regions
	App.addRegions
		leftNavRegion: '#left-nav-region'
		headerRegion: '#header-region'
		mainContentRegion: '#main-content-region'
		popupRegion:  '#dialog-region'
		dialogRegion: Marionette.Region.Dialog.extend el: '#dialog-region'
		loginRegion: '#login-region'
		breadcrumbRegion: '#breadcrumb-region'

	# The default route for app
	App.rootRoute = ""

	# loginRoute in case session expires
	App.loginRoute = "login"

	# Reqres handler to return a default region. If a controller is not explicitly specified a
	# region it will trigger default region handler
	App.reqres.setHandler "default:region", ->
		App.mainContentRegion

	# App command to handle async request and action to be performed after that
	# entities are the the dependencies which trigger a fetch to server.
	App.commands.setHandler "when:fetched", (entities, callback) ->
		xhrs = _.chain([entities]).flatten().pluck("_fetch").value()
		$.when(xhrs...).done ->
			callback()

	# Registers a controller instance
	App.commands.setHandler "register:instance", (instance, id) ->
		App.register instance, id

	# Unregisters a controller instance
	App.commands.setHandler "unregister:instance", (instance, id) ->
		App.unregister instance, id

	App.on "initialize:after", (options) ->

		App.startHistory()

		if _.platform() is 'DEVICE'

			onDeviceReady = =>

				# Open pre-populated SQLite database file.
				_.cordovaOpenPrepopulatedDatabase()

				# Cordova local storage
				_.cordovaLocalStorage()

				# 'FastClick' helps to reduce the 400ms click delay.
				FastClick.attach(document.body)

				# Change 'AJAXURL' based on version name
				cordova.getAppVersion().then((version)->

					if version.indexOf('Production') is 0
						`AJAXURL = "http://synapselearning.net/wp-admin/admin-ajax.php";`

					if version.indexOf('Staging') is 0
						`AJAXURL = "http://synapsedu.info/wp-admin/admin-ajax.php";`
				)

				# If the UserId is null or 'null' i.e id not set in local storage then the app
				# is either installed for the first time or user has logged out.

				if _.isNull(_.getUserID()) or _.getUserID() is 'null'
					# If the blog_id is not set then the app is installed for the very first time.
					# Navigate to main login screen if blog id is null, else show list of users view.
					@rootRoute = 'app-login'
					@rootRoute = 'login' if _.isNull _.getBlogID()
					App.navigate(@rootRoute, trigger: true)

				else
					#If User ID is set, then navigate to dashboard.
					user = App.request "get:user:model"
					user.set 'ID' : ''+_.getUserID()
					App.vent.trigger "show:dashboard"
					App.loginRegion.close() 


			document.addEventListener("deviceready", onDeviceReady, false)

			return

		else
		
			if USER? and USER.ID
				user = App.request "get:user:model" 
				App.execute "show:headerapp", region: App.headerRegion
				App.execute "show:leftnavapp", region: App.leftNavRegion
				App.execute "show:breadcrumbapp", region: App.breadcrumbRegion
				App.vent.trigger "show:dashboard" if @getCurrentRoute() is 'login'
				App.loginRegion.close()

			else
				App.vent.trigger "show:login"


	App.vent.on "show:dashboard", (user_role) =>

		if _.platform() is 'DEVICE'

			# If the last sync operation is 'none' i.e sync is not performed for the first time
			# or if the operation is 'file_import' i.e sync process is not completed, then the user should
			# not be allowed to navigate else where in the app and only the sync screen should be visible
			# to the user.

			_.getLastSyncOperation().done (typeOfOperation)->

				console.log 'getLastSyncOperation done [walnut-app.coffee]'
				
				if typeOfOperation is 'none' or typeOfOperation isnt 'file_import'
					App.navigate('sync', trigger: true)
				else
					App.navigate('teachers/dashboard', trigger: true)

		else

			user = App.request "get:user:model"

			if user.current_user_can('administrator') or user.current_user_can('school-admin')
				App.navigate('textbooks', trigger: true)

			if user.current_user_can 'teacher'
				App.navigate('teachers/dashboard', trigger: true)     

			if user.current_user_can 'student'
				App.navigate('students/dashboard', trigger: true)             

		App.execute "show:breadcrumbapp", region: App.breadcrumbRegion
		App.execute "show:headerapp", region: App.headerRegion
		App.execute "show:leftnavapp", region: App.leftNavRegion

		if typeof Pace isnt 'undefined'
			Pace.on 'hide', ()->
				$("#site_main_container").addClass("showAll");

	
	App.vent.on "show:login", ->
		App.leftNavRegion.close()
		App.headerRegion.close()
		App.mainContentRegion.close()
		App.breadcrumbRegion.close()
		@rootRoute = 'login'
		# if not logged in change rootRoute to login
		App.navigate(@rootRoute, trigger: true)

	App


