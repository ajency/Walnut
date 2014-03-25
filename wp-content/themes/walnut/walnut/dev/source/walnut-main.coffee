# The main builder app entry point
# <ul>
# <li>-this file sets the requirejs configurations </li> 
# <li>-load all JS files</li>
# </ul>

require.config
	
	urlArgs : "ver=#{(new Date()).getTime()}"

	
	baseUrl : './wp-content/themes/walnut/walnut/dev/js'
	
	#Url for walnut app
	#baseUrl : '/dev/js'
	
	paths:
		jquery 				: 'plugins/jquery'
		jqueryui 			: 'plugins/jquery.ui'
		jqueryvalidate		: 'plugins/jquery.validate.min'
		underscore			: 'plugins/underscore'
		backbone    		: 'plugins/backbone'
		marionette  		: 'plugins/backbone.marionette'
		text				: 'plugins/text'
		app 				: 'walnut-app' 
		syphon				: 'plugins/backbone.syphon'
		sidr 				: 'plugins/jquery.sidr.min'
		slimroll			: 'plugins/jquery.slimscroll.min'
		breakpoints			: 'plugins/breakpoints'
		mustache			: 'plugins/mustache'
		core				: 'plugins/core'

	shim:
		underscore: 
			exports : '_'
		jquery 		: ['underscore']
		jqueryui 	: ['jquery']
		backbone: 
			deps 	: ['jquery','underscore']
			exports : 'Backbone'
		marionette : 
			deps 	: ['backbone']
			exports : 'Marionette'
		sidr 		: ['jquery']
		slimroll 		: ['jquery']
		core 		: ['sidr','jquery']
		breakpoints 		: ['jquery']
		jqueryvalidate: ['jquery']
		syphon		: ['backbone']
		app 		: ['plugins/walnut-pluginloader','config/walnut-configloader']

	

## Start with application
require [	'plugins/walnut-pluginloader'
			'config/walnut-configloader'
			'app'
			'apps/walnut-appsloader'
			'entities/walnut-entities-loader'
			], (plugins, configs, App)->

				App.start()
