# The main builder app entry point
# <ul>
# <li>-this file sets the requirejs configurations </li> 
# <li>-load all JS files</li>
# </ul>

require.config

    urlArgs: "ver=#{(new Date()).getTime()}"

    # baseUrl: './wp-content/themes/walnut/walnut/dev/js'

    # baseUrl for walnut app
    baseUrl : '/dev/js'

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
        core: 'plugins/core'
        componentloader: 'components/component-loader'
        mixitup: 'plugins/jquery.mixitup.min'
        spin: 'plugins/spin'
        jqueryspin: 'plugins/jquery.spin'
        tablesorter: 'plugins/jquery.tablesorter'
        tablesorter_pager: 'plugins/jquery.tablesorter.pager'
        unveil: 'plugins/jquery.unveil.min'
        detect: 'plugins/detect'
        moment: 'plugins/moment.min'
        select2: 'plugins/select2.min'
        datepicker: 'plugins/bootstrap-datepicker'
        timepicker: 'plugins/bootstrap-timepicker.min'
        timecircles: 'plugins/TimeCircles'
        jquery_listnav: 'plugins/jquery-listnav'
        screwbuttons: 'plugins/jquery.screwdefaultbuttonsV2'
        bridget: 'plugins/jquery.bridget'
        isotope: 'plugins/isotope.pkgd.min'
        kinetic				: 'plugins/kinetic'
        kineticresize		: 'plugins/kinetic.plugin.resize'
        checkbox			: 'plugins/flatui-checkbox'
        holder				: 'plugins/holder'
        unserialize			: 'plugins/unserialize'
        serialize			: 'plugins/serialize'
        selectordie			: 'plugins/selectordie.min'
        csvparse			: 'plugins/jquery.parse'
        json2csvparse       : 'plugins/json2csv'
        Zip                 : 'plugins/jszip'
        zipchk              : 'plugins/lz-string-1.3.3'
        FileSaver           : 'plugins/FileSaver'
        archive             : 'plugins/archive'




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
        core: ['sidr', 'jquery']
        breakpoints: ['jquery']
        mixitup: ['jquery']
        jqueryspin: ['spin']
        jqueryvalidate: ['jquery']
        syphon: ['backbone']
        moment: ['jquery']
        select2: ['jquery', 'bootstrap']
        datepicker: ['jquery', 'bootstrap']
        timepicker: ['jquery', 'bootstrap']
        timecircles: ['jquery']
        jquery_listnav: ['jquery']
        screwbuttons : ['jquery']
        checkbox  : ['bootstrap']
        kineticresize : ['kinetic']
        bridget : ['jquery']
        isotope : ['jquery','bridget']
        selectordie		: ['jquery']
        csvparse		: ['jquery']
        json2csvparse   : ['jquery']

        app: ['plugins/walnut-pluginloader', 'config/walnut-configloader']


## Start with application
require [  'plugins/walnut-pluginloader'
           'config/walnut-configloader'
           'app'
           'controllers/authenticationcontroller'
           'apps/walnut-appsloader'
           'entities/walnut-entities-loader'
           'componentloader'
], (plugins, configs, App)->
    App.start()
