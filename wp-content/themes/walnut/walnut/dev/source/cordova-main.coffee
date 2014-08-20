# The main builder app entry point
# <ul>
# <li>-this file sets the requirejs configurations </li> 
# <li>-load all JS files</li>
# </ul>

require.config

	urlArgs: "ver=#{(new Date()).getTime()}"

	# baseUrl: './wp-content/themes/walnut/walnut/dev/js'

	# Url for Synapse App
	baseUrl: '/dev/js'

	paths:
		jquery: 'plugins/jquery'
		jqueryui: 'plugins/jquery.ui'
		jqueryvalidate: 'plugins/jquery.validate.min'
		bootstrap: 'plugins/bootstrap.min'
		underscore: 'plugins/underscore'
		underscorestring: 'plugins/underscorestring'
		backbone: 'plugins/backbone'
		marionette: 'plugins/backbone.marionette'
		text: 'plugins/text'
		app: 'walnut-app'
		syphon: 'plugins/backbone.syphon'
		sidr: 'plugins/jquery.sidr.min'
		slimroll: 'plugins/jquery.slimscroll.min'
		breakpoints: 'plugins/breakpoints'
		mustache: 'plugins/mustache'
		componentloader: 'components/component-loader'
		mixitup: 'plugins/jquery.mixitup.min'
		spin: 'plugins/spin'
		jqueryspin: 'plugins/jquery.spin'
		tablesorter: 'plugins/jquery.tablesorter'
		tablesorter_pager: 'plugins/jquery.tablesorter.pager'
		unveil: 'plugins/jquery.unveil.min'
		moment: 'plugins/moment.min'
		select2: 'plugins/select2.min'
		datepicker: 'plugins/bootstrap-datepicker'
		timepicker: 'plugins/bootstrap-timepicker.min'
		jquery_listnav: 'plugins/jquery-listnav'
		bridget: 'plugins/jquery.bridget'
		checkbox: 'plugins/flatui-checkbox'
		holder: 'plugins/holder'
		detect: 'plugins/detect'
		unserialize         : 'plugins/unserialize'
		serialize           : 'plugins/serialize'
		fastclick           : 'plugins/fastclick'
		walnutGlobal        : 'plugins/walnutapp-global'

	shim:
		underscore:
			exports: '_'
		jquery: ['underscore']
		jqueryui: ['jquery']
		bootstrap: ['jquery']
		underscorestring: ['jquery', 'underscore']
		backbone:
			deps: ['jquery', 'underscore']
			exports: 'Backbone'
		marionette:
			deps: ['backbone']
			exports: 'Marionette'
		sidr: ['jquery']
		tablesorter: ['jquery']
		tablesorter_pager: ['jquery', 'tablesorter']
		unveil: ['jquery']
		slimroll: ['jquery']
		breakpoints: ['jquery']
		mixitup: ['jquery']
		jqueryspin: ['spin']
		moment: ['jquery']
		select2: ['jquery', 'bootstrap']
		datepicker: ['jquery', 'bootstrap']
		timepicker: ['jquery', 'bootstrap']
		jquery_listnav: ['jquery']
		checkbox: ['bootstrap']
		jqueryvalidate: ['jquery']
		syphon: ['backbone']
		bridget: ['jquery']
		app: ['plugins/cordova-pluginloader', 'config/walnut-configloader']


## Start with application
require [  'plugins/cordova-pluginloader'
		   'config/walnut-configloader'
		   'cordova/cordova-apploader'
		   'app'
		   'entities/walnut-entities-loader'
		   'apps/cordova-walnut-appsloader'
		   'controllers/authenticationcontroller'
		   'componentloader'
], (plugins, configs, cordova, App)->
	App.start()
