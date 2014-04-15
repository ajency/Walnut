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
		jqueryresize		: 'plugins/jquery.ba-resize.min'
		kinetic				: 'plugins/kinetic'
		kineticresize		: 'plugins/kinetic.plugin.resize'
		jqueryvalidate		: 'plugins/jquery.validate.min'
		underscore			: 'plugins/underscore'
		backbone    		: 'plugins/backbone'
		bootstrap   		: 'plugins/bootstrap'
		bootstrapslider		: 'plugins/bootstrap-slider'
		marionette  		: 'plugins/backbone.marionette'
		text				: 'plugins/text'
		mustache			: 'plugins/mustache'
		holder				: 'plugins/holder'
		app 				: 'content-creator-app' 
		plupload			: 'plugins/plupload.full'
		syphon				: 'plugins/backbone.syphon'
		underscorestring	: 'plugins/underscorestring'
		entitiesloader 		: 'entities/content-creator-entities-loader'
		checkbox			: 'plugins/flatui-checkbox'
		componentloader 	: 'components/builder-component-loader'
		spin 				: 'plugins/spin'
		jqueryspin  		: 'plugins/jquery.spin'
		jquerycolor			: 'plugins/jquery.minicolors.min'
		jqueryknob			: 'plugins/jquery.knob'
		ckeditor			: 'plugins/ckeditor/ckeditor'
		# bootstrapselect 	: 'plugins/bootstrapselect'
		select2       : 'plugins/select2.min'

	shim:
		underscore: 
			exports : '_'
		jquery 		: ['underscore']
		jqueryui 	: ['jquery']
		jqueryresize : ['jquery','jqueryui']
		jquerycolor : ['jquery']
		jqueryknob	: ['jquery']
		kineticresize : ['kinetic']
		backbone: 
			deps 	: ['jquery','underscore']
			exports : 'Backbone'
		marionette : 
			deps 	: ['backbone']
			exports : 'Marionette'
		plupload    : 
			deps : ['jquery']
			exports : 'plupload'
		bootstrap : ['jquery','jqueryui']
		bootstrapslider :['bootstrap']
		# bootstrapselect : ['bootstrap']
		checkbox  : ['bootstrap']
		jqueryvalidate: ['jquery']
		underscorestring : ['underscore']
		syphon		: ['backbone']
		select2      : ['jquery','bootstrap']
		app 		: ['plugins/content-creator-pluginloader','config/content-creator-configloader']

	

## Start with application
require [	'plugins/content-creator-pluginloader'
			'configs/content-creator-configloader'
			'app'
			'entitiesloader'
			'componentloader'
			'apps/content-creator-appsloader'
			], (plugins, configs, App)->

				App.start() 
