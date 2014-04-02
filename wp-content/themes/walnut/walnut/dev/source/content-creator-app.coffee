define ['marionette'], (Marionette)->

	window.App = new Marionette.Application
	
	# Main app regions
	App.addRegions
		leftNavRegion 		: '#left-nav-region'
		headerRegion  		: '#header-region'
		mainContentRegion 	: '#main-content-region'
		dialogRegion 		: Marionette.Region.Dialog.extend el : '#dialog-region'
		settingsRegion 	  	: Marionette.Region.Settings.extend el : '#settings-region'
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
		App.navigate(@rootRoute, trigger: true) unless @getCurrentRoute()

	App.on 'start', ->
		# start the content creator app
		App.execute "show:content:creator", 
						region : App.mainContentRegion
		
		App.execute "show:headerapp", region:App.headerRegion
		App.execute "show:leftnavapp", region:App.leftNavRegion
		App.execute "show:breadcrumbapp", region:App.breadcrumbRegion
		# start header app

		# start left nav app
			
	App