# The main builder app entry point
# <ul>
# <li>-this file sets the requirejs configurations </li> 
# <li>-load all JS files</li>
# </ul>

require.config
	
	urlArgs : "ver=#{(new Date()).getTime()}"

	baseUrl : './wp-content/themes/walnut/walnut/dev/js'
	
	paths:
		jquery 				: 'plugins/jquery'
		jqueryui 			: 'plugins/jquery.ui'
		jqueryvalidate		: 'plugins/jquery.validate.min'
		bootstrap			: 'plugins/bootstrap.min'
		underscore			: 'plugins/underscore'
		underscorestring	: 'plugins/underscorestring'
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
		spin 				: 'plugins/spin'
		jqueryspin  		: 'plugins/jquery.spin'
		tablesorter			: 'plugins/jquery.tablesorter'
		tablesorter_pager	: 'plugins/jquery.tablesorter.pager'
		unveil				: 'plugins/jquery.unveil.min'
		detect				: 'plugins/detect'
		unserialize			: 'plugins/unserialize'

	shim:
		underscore: 
			exports : '_'
		jquery 			: ['underscore']
		jqueryui 		: ['jquery']
		bootstrap 		: ['jquery']
		underscorestring 	: ['underscore']
		backbone: 
			deps 	: ['jquery','underscore']
			exports : 'Backbone'
		marionette : 
			deps 	: ['backbone']
			exports : 'Marionette'
		sidr 			: ['jquery']
		tablesorter 		: ['jquery']
		tablesorter_pager 		: ['jquery','tablesorter']
		unveil 			: ['jquery']
		slimroll 		: ['jquery']
		core 			: ['sidr','jquery']
		breakpoints 		: ['jquery']
		mixitup 		: ['jquery']
		jqueryspin 		: ['spin']
		jqueryvalidate	: ['jquery']
		syphon			: ['backbone']
		app 			: ['plugins/walnut-pluginloader','config/walnut-configloader']

	

## Start with application
require [	'plugins/walnut-pluginloader'
			'config/walnut-configloader'
			'app'
			'apps/walnut-appsloader'
			'entities/walnut-entities-loader'
			'componentloader'
			], (plugins, configs, App)->
				
				App.start()
