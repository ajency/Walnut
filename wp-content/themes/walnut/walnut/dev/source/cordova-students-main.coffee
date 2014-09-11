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
		detect: 'plugins/detect'
		datepicker: 'plugins/bootstrap-datepicker'
		jquery_listnav: 'plugins/jquery-listnav'
		screwbuttons: 'plugins/jquery.screwdefaultbuttonsV2'
		bridget: 'plugins/jquery.bridget'
		isotope: 'plugins/isotope.pkgd.min'
		kinetic: 'plugins/kinetic'
		kineticresize: 'plugins/kinetic.plugin.resize'
		checkbox: 'plugins/flatui-checkbox'
		holder: 'plugins/holder'
		panzer: 'plugins/panzer'
		panzerlist : 'plugins/panzerlist'
		timerplugin: 'plugins/jquery.countdown_plugin.min' #needed for jquerytimer to work
		countdowntimer: 'plugins/jquery.countdown.min'
		spinedit : 'plugins/bootstrap-spinedit'
		resizablecolumns : 'plugins/jquery.resizableColumns.min'
		bootbox : 'plugins/bootbox.min'
		unserialize         : 'plugins/unserialize'
		serialize           : 'plugins/serialize'
		fastclick           : 'plugins/fastclick'
		walnutGlobal        : 'plugins/walnutapp-global'
		jPages				: 'plugins/jPages.min'

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
		jqueryvalidate: ['jquery']
		syphon: ['backbone']
		datepicker: ['jquery', 'bootstrap']
		jquery_listnav: ['jquery']
		screwbuttons: ['jquery']
		checkbox: ['bootstrap']
		kineticresize: ['kinetic']
		bridget: ['jquery']
		isotope: ['jquery', 'bridget']
		panzer: ['jquery']
		panzerlist : ['jquery']
		timerplugin: ['jquery']
		countdowntimer: ['jquery','timerplugin']
		spinedit : ['jquery','bootstrap']
		resizablecolumns : ['jquery']
		bootbox : ['jquery','bootstrap']
		jPages: ['jquery']
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
