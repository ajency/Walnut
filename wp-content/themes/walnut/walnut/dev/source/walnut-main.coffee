# The main builder app entry point
# <ul>
# <li>-this file sets the requirejs configurations </li> 
# <li>-load all JS files</li>
# </ul>

require.config

	urlArgs: "ver=#{(new Date()).getTime()}"

	baseUrl: './wp-content/themes/walnut/walnut/dev/js'

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
		detect: 'plugins/detect'
		moment: 'plugins/moment.min'
		select2: 'plugins/select2'
		#datepicker: 'plugins/bootstrap-datepicker'
		new_moment: 'plugins/new_moment'
		datetimepicker: 'plugins/datetimepicker.min'
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
		jPages: 'plugins/jPages.min'
		modenizr: 'plugins/bookBlock/modernizr.custom'
		jquerypp : 'plugins/bookBlock/jquerypp.custom'
		bookblock : 'plugins/bookBlock/jquery.bookblock'

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
		slimroll: ['jquery']
		breakpoints: ['jquery']
		mixitup: ['jquery']
		jqueryspin: ['spin']
		jqueryvalidate: ['jquery']
		syphon: ['backbone']
		moment: ['jquery']
		select2: ['jquery', 'bootstrap']
		#datepicker: ['jquery', 'bootstrap']
		new_moment: ['jquery']
		datetimepicker: ['jquery', 'new_moment', 'bootstrap']
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
		jquerypp : ['jquery']
		bookblock :['jquery']
		app: ['plugins/walnut-pluginloader', 'config/walnut-configloader']

# Start with application
require [  'plugins/walnut-pluginloader'
		   'config/walnut-configloader'
		   'app'
		   'apps/walnut-appsloader'
		   'entities/walnut-entities-loader'
		   'componentloader'
], (plugins, configs, App)->
	App.start()
