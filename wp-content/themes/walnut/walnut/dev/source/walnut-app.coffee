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

			# If the UserId is null or 'null' i.e id not set in local storage then the app
			# is either installed for the first time or user has logged out.

			if _.isNull(_.getUserID()) or _.getUserID() is 'null'

				# If the blog_id is not set then the app is installed for the very first time.
				# Navigate to main login screen if blog id is null, else show list of users view.

				@rootRoute = 'app-login'
				@rootRoute = 'login' if _.isNull(_.getUserID())
				App.navigate(@rootRoute, trigger: true)
			else
				#If User ID is set, then navigate to dashboard.

				authController = App.request "get:auth:controller"
				authController.setUserModelForOfflineLogin()

			return

		else

			# check app login status
			xhr = $.get "#{AJAXURL}?action=get-user-data",
				{},
				(resp)=>
					if(resp.success)
						console.log resp
						user = App.request "get:user:model"
						#todo: fix user entity
						user.set resp.data.data
						school = App.request "get:current:school"
						App.execute "show:headerapp", region: App.headerRegion
						App.execute "show:leftnavapp", region: App.leftNavRegion
						App.execute "show:breadcrumbapp", region: App.breadcrumbRegion
						App.vent.trigger "show:dashboard" if @getCurrentRoute() is 'login'
						App.loginRegion.close()
					else
						App.vent.trigger "show:login"
				,'json'


	App.vent.on "show:dashboard", (user_role) =>
		user = App.request "get:user:model"

		user_role = user.get "roles"

		if _.platform() is 'DEVICE'

			# If the last sync operation is 'none' i.e sync is not performed for the first time
			# or if the operation is 'file_import' i.e sync process is not completed, then the user should
			# not be allowed to navigate else where in the app and only the sync screen should be visible
			# to the user.

			# userSynced = _.hasUserPreviouslySynced()
			# userSynced.done (synced)->
				
				if synced
					App.navigate('sync', trigger: true)
					
				else

					lastSyncOperation = _.getLastSyncOperation()
					lastSyncOperation.done (type_of_operation)->
						
						if type_of_operation is 'none' or type_of_operation isnt 'file_import'
							App.navigate('sync', trigger: true)
						else
							App.navigate('students/dashboard', trigger: true)

			

			
			# App.navigate('students/dashboard', trigger: true)
				

		else

			if user_role[0] == 'administrator'
				App.navigate('textbooks', trigger: true)

			else
				App.navigate('teachers/dashboard', trigger: true)

			if user.current_user_can('administrator') or user.current_user_can('school-admin')
				App.navigate('textbooks', trigger: true)

			if user.current_user_can 'teacher'
				App.navigate('teachers/dashboard', trigger: true)     

			if user.current_user_can 'student'
				App.navigate('students/dashboard', trigger: true)             

		# App.execute "show:breadcrumbapp", region: App.breadcrumbRegion
		App.execute "show:headerapp", region: App.headerRegion
		App.execute "show:leftnavapp", region: App.leftNavRegion

		if typeof(Pace) is not 'undefined'
			Pace.on 'hide', ()->
				$("#site_main_container").addClass("showAll");

	App.vent.on "show:login", ->
		App.leftNavRegion.close()
		App.headerRegion.close()
		App.mainContentRegion.close()
		# App.breadcrumbRegion.close()
		@rootRoute = 'login'
		# if not logged in change rootRoute to login
		App.navigate(@rootRoute, trigger: true)

	App


