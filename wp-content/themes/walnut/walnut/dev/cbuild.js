({
    baseUrl: './js',
    name: 'plugins/almond',
    include: 'content-creator-main',
    exclude: ['plugins/ckeditor/ckeditor'],
    //optimize: 'none',
    wrap: false,
    out: '../production/content-creator-main.js',
    paths: {
        jquery: 'plugins/jquery',
        jqueryui: 'plugins/jquery.ui',
        jqueryresize: 'plugins/jquery.ba-resize.min',
        kinetic: 'plugins/kinetic',
        kineticresize: 'plugins/kinetic.plugin.resize',
        jqueryvalidate: 'plugins/jquery.validate.min',
        underscore: 'plugins/underscore',
        backbone: 'plugins/backbone',
        bootstrap: 'plugins/bootstrap',
        marionette: 'plugins/backbone.marionette',
        text: 'plugins/text',
        mustache: 'plugins/mustache',

        holder: 'plugins/holder',
        app: 'content-creator-app',
        plupload: 'plugins/plupload.full',
        syphon: 'plugins/backbone.syphon',
        underscorestring: 'plugins/underscorestring',
        entitiesloader: 'entities/content-creator-entities-loader',
        componentloader: 'components/builder-component-loader',
        checkbox: 'plugins/flatui-checkbox',
        spin: 'plugins/spin',
        jqueryspin: 'plugins/jquery.spin',
        bootstrapslider: 'plugins/bootstrap-slider',
        jquerycolor: 'plugins/jquery.minicolors.min',
        jqueryknob: 'plugins/jquery.knob',
        ckeditor: 'plugins/ckeditor/ckeditor',
        select2: 'plugins/select2.min',
        tagsinput: 'plugins/bootstrap-tagsinput.min',
        screwbuttons: 'plugins/jquery.screwdefaultbuttonsV2',
        babysitter: 'plugins/backbone.babysitter.min',
        videojs: 'plugins/video',
        videojsplaylist : 'plugins/videojs-playlists.min',
        panzer: 'plugins/panzer',
        panzerlist : 'plugins/panzerlist',
        sidr: 'plugins/jquery.sidr.min',
        mmenu: 'plugins/jquery.mmenu.min.all',

        // wordpress cropping js
        imageareaselect : '../../../../../../wp-includes/js/imgareaselect/jquery.imgareaselect.min',
        imageedit : '../../../../../../wp-admin/js/image-edit',
        json2 : '../../../../../../wp-includes/js/json2',
        svgpainter : '../../../../../../wp-admin/js/svg-painter'

    },
    shim: {
        underscore: {
            exports: '_'
        },
        jquery: ['underscore'],
        jqueryui: ['jquery'],
        jqueryresize: ['jquery', 'jqueryui'],
        jquerycolor: ['jquery'],
        jqueryknob: ['jquery'],
        kineticresize: ['kinetic'],
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        marionette: {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        plupload: {
            deps: ['jquery'],
            exports: 'plupload'
        },
        bootstrap: ['jquery'],
        mmenu: ['jquery'],
        jqueryvalidate: ['jquery'],
        underscorestring: ['underscore'],
        syphon: ['backbone'],
        checkbox: ['bootstrap'],
        select2: ['jquery', 'bootstrap'],
        tagsinput: ['jquery', 'bootstrap'],
        screwbuttons: ['jquery'],
        babysitter: ['backbone'],
        videojsplaylist : ['videojs'],
        panzer: ['jquery'],
        panzerlist : ['jquery'],
        sidr: ['jquery'],
        app: ['plugins/content-creator-pluginloader', 'config/content-creator-configloader']
    }
})