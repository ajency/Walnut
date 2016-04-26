({
    baseUrl: './js',
    name: 'plugins/almond',
    include: 'walnut-main',
    //optimize: 'none',
    wrap: false,
    out: '../production/walnut-main.js',
    paths: {
        pace: 'plugins/pace',
        jquery: 'plugins/jquery',
        jqueryui: 'plugins/jquery.ui',
        bootstrap: 'plugins/bootstrap',
        jqueryvalidate: 'plugins/jquery.validate.min',
        underscore: 'plugins/underscore',
        underscorestring: 'plugins/underscorestring',
        backbone: 'plugins/backbone',
        marionette: 'plugins/backbone.marionette',
        text: 'plugins/text',
        app: 'walnut-app',
        syphon: 'plugins/backbone.syphon',
        sidr: 'plugins/jquery.sidr.min',
        slimroll: 'plugins/jquery.slimscroll.min',
        breakpoints: 'plugins/breakpoints',
        mustache: 'plugins/mustache',
        core: 'plugins/core',
        mixitup: 'plugins/jquery.mixitup.min',
        spin: 'plugins/spin',
        jqueryspin: 'plugins/jquery.spin',
        componentloader: 'components/component-loader',
        unveil: 'plugins/jquery.unveil.min',
        detect: 'plugins/detect',
        tablesorter: 'plugins/jquery.tablesorter',
        tablesorter_pager: 'plugins/jquery.tablesorter.pager',
        moment: 'plugins/moment.min',
        select2             : 'plugins/select2',
        datepicker          : 'plugins/bootstrap-datepicker',
        datetimepicker      : 'plugins/bootstrap-datetimepicker.min',
        timepicker          : 'plugins/bootstrap-timepicker.min',
        timecircles         : 'plugins/TimeCircles',
        jquery_listnav      : 'plugins/jquery-listnav',
        screwbuttons        : 'plugins/jquery.screwdefaultbuttonsV2',
        bridget             : 'plugins/jquery.bridget',
        isotope             : 'plugins/isotope.pkgd.min',
        mmenu               : 'plugins/jquery.mmenu.min.all',
        kinetic				: 'plugins/kinetic',
        kineticresize		: 'plugins/kinetic.plugin.resize',
        checkbox			: 'plugins/flatui-checkbox',
        holder				: 'plugins/holder',
        panzer              : 'plugins/panzer',
        panzerlist          : 'plugins/panzerlist',
        timerplugin         : 'plugins/jquery.countdown_plugin.min',
        countdowntimer      : 'plugins/jquery.countdown.min',
        spinedit            : 'plugins/bootstrap-spinedit',
        resizablecolumns : 'plugins/jquery.resizableColumns.min',
        bootbox : 'plugins/bootbox.min',
        jPages: 'plugins/jPages.min',
        modenizr: 'plugins/bookBlock/modernizr.custom',
        jquerypp : 'plugins/bookBlock/jquerypp.custom',
        bookblock : 'plugins/bookBlock/jquery.bookblock'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        jquery: ['underscore'],
        jqueryui: ['jquery'],
        bootstrap: ['jquery'],
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        marionette: {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        tablesorter: ['jquery'],
        tablesorter_pager: ['jquery', 'tablesorter'],
        sidr: ['jquery'],
        unveil: ['jquery'],
        slimroll: ['jquery'],
        core: ['sidr', 'jquery'],
        breakpoints: ['jquery'],
        jqueryvalidate: ['jquery'],
        syphon: ['backbone'],
        underscorestring: ['underscore'],
        mixitup: ['jquery'],
        moment: ['jquery'],
        mmenu: ['jquery'],
        select2: ['jquery', 'bootstrap'],
        datepicker: ['jquery', 'bootstrap'],
        datetimepicker: ['jquery', 'bootstrap'],
        timepicker: ['jquery', 'bootstrap'],
        jquerytimer: ['jquery'],
        jquery_listnav: ['jquery'],
        screwbuttons : ['jquery'],
        checkbox  : ['bootstrap'],
        kineticresize : ['kinetic'],
        bridget : ['jquery'],
        isotope : ['jquery','bridget'],
        panzer: ['jquery'],
        panzerlist : ['jquery'],
        timerplugin: ['jquery'],
        countdowntimer: ['jquery','timerplugin'],
        spinedit            : ['jquery','bootstrap'],
        resizablecolumns : ['jquery'],
        bootbox : ['jquery','bootstrap'],
        jPages: ['jquery'],
        jquerypp : ['jquery'],
        bookblock :['jquery'],
        app: ['plugins/walnut-pluginloader', 'config/walnut-configloader']
    }
})