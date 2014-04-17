##
## The main dashboard App
##
define ['marionette'], (Marionette)->

	window.App = new Marionette.Application
	
	# Main app regions
	App.addRegions
		leftNavRegion 		: '#left-nav-region'
		headerRegion  		: '#header-region'
		mainContentRegion 	: '#main-content-region'
		dialogRegion 		: '#dialog-region'
		loginRegion 		: '#login-region' 
		breadcrumbRegion	: '#breadcrumb-region'

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
		if typeof Pace isnt 'undefined'
			Pace.on 'hide', ()->
				$("#site_main_container").addClass( "showAll" );

		App.startHistory()

		
		#Changes needed to build walnut-app
		# loginStatus = window.localStorage.getItem("key")
		# if loginStatus is null or loginStatus is 'loggedout'
		# 	@rootRoute = 'login'
		# 	App.navigate(@rootRoute, trigger: true)
		# else
		# 	App.vent.trigger "show:dashboard"
		@rootRoute = 'login'
		App.navigate(@rootRoute, trigger: true)	
		return

        
		# check app login status
		xhr = $.get "#{AJAXURL}?action=get-user-data", 
				{}, 
				(resp)=>
					if(resp.success)
						console.log resp
						user = App.request "get:user:model"
						user.set resp.data
						school = App.request "get:current:school"
						App.execute "show:headerapp", region:App.headerRegion
						App.execute "show:leftnavapp", region:App.leftNavRegion	
						App.execute "show:breadcrumbapp", region:App.breadcrumbRegion
						App.vent.trigger "show:dashboard"  if @getCurrentRoute() is 'login'
						App.loginRegion.close()
					else 	
						App.vent.trigger "show:login"
				, 'json'
		
			
	App.vent.on "show:dashboard", ->
		if typeof Pace isnt 'undefined'
			Pace.restart();
			$("#site_main_container").removeClass( "showAll" );
		App.navigate('textbooks', trigger: true)
		App.execute "show:breadcrumbapp", region:App.breadcrumbRegion
		App.execute "show:headerapp", region:App.headerRegion
		App.execute "show:leftnavapp", region:App.leftNavRegion	

		if typeof Pace isnt 'undefined'
			Pace.on 'hide', ()->
				$("#site_main_container").addClass( "showAll" );

			
	App.vent.on "show:login", ->
		App.leftNavRegion.close()
		App.headerRegion.close()
		App.mainContentRegion.close()
		App.breadcrumbRegion.close()
		@rootRoute = 'login' 
		# if not logged in change rootRoute to login		
		App.navigate(@rootRoute, trigger: true)
			
	App


