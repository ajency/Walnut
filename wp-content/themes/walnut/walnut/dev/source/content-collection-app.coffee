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

		Pace.on 'hide', ()->
			$("#site_main_container").addClass( "showAll" );

		App.startHistory()

		#@rootRoute = 'login' 
		# if not logged in change rootRoute to login		
		#App.navigate(@rootRoute, trigger: true)
		#return
        
		# check app login status
		xhr = $.get "#{AJAXURL}?action=get-user-data", 
		{}, 
		(resp)=>
			if(resp.success)
				user = App.request "get:user:model"
				user.set resp.data
				school = App.request "get:current:school"
				console.log 'show:content:collection'
				App.vent.trigger "show:content:collection"
				App.loginRegion.close()
			else 	
				App.vent.trigger "show:login"
		, 'json'
		
			
	App.vent.on "show:content:collection", ->

		App.execute "show:create:collection", 
						region : App.mainContentRegion
		
		App.execute "show:breadcrumbapp", region:App.breadcrumbRegion
		App.execute "show:headerapp", region:App.headerRegion
		App.execute "show:leftnavapp", region:App.leftNavRegion	

		Pace.on 'hide', ()->
			$("#site_main_container").addClass( "showAll" );

			
	App.vent.on "show:login", ->
		window.location = SITEURL+'#login'
			
	App

