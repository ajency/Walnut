# The main builder app entry point
# <ul>
# <li>-this file sets the requirejs configurations </li> 
# <li>-load all JS files</li>
# </ul>
require.config 
	
	urlArgs : "ver=#{(new Date()).getTime()}"
	
	baseUrl : '../wp-content/themes/walnut/walnut/dev/js'
	
	paths:
		jquery 				: 'plugins/jquery'
		jqueryui 			: 'plugins/jquery.ui'
		jqueryvalidate		: 'plugins/jquery.validate.min'
		underscore			: 'plugins/underscore'
		backbone    		: 'plugins/backbone'
		marionette  		: 'plugins/backbone.marionette'
		text				: 'plugins/text'
		app 				: 'content-creator-app' 
		syphon				: 'plugins/backbone.syphon'
		entitiesloader 		: 'entities/content-creator-entities-loader'
		

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
		jqueryvalidate: ['jquery']
		syphon		: ['backbone']
		app 		: ['plugins/content-creator-pluginloader','config/content-creator-configloader']

	

## Start with application
require [	'plugins/content-creator-pluginloader'
			'config/content-creator-configloader'
			'app'
			'entitiesloader'
			'apps/content-creator-appsloader'
			], (plugins, configs, App)->

				App.start()
