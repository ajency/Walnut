# The main builder app entry point
# <ul>
# <li>-this file sets the requirejs configurations </li> 
# <li>-load all JS files</li>
# </ul>

require.config
	
	urlArgs : "ver=#{(new Date()).getTime()}"

	AJAXURL : 'http://localhost/walnut/wp-admin/admin-ajax.php'

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
		componentloader 	: 'components/component-loader'
		mixitup				: 'plugins/jquery.mixitup.min'
		search_results		: 'plugins/search_results'
		spin 				: 'plugins/spin'
		jqueryspin  		: 'plugins/jquery.spin'

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
		mixitup 		: ['jquery']
		search_results 		: ['jquery','mixitup']
		jqueryspin 			: ['spin']
		jqueryvalidate: ['jquery']
		syphon		: ['backbone']
		app 		: ['plugins/walnut-pluginloader','config/walnut-configloader']

	

## Start with application
require [	'plugins/walnut-pluginloader'
			'config/walnut-configloader'
			'app'
			'apps/walnut-appsloader'
			'entities/walnut-entities-loader'
			'componentloader'
			], (plugins, configs, App)->

				App.start()
