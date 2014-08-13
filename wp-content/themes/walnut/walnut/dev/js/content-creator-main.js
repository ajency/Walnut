require.config({
  urlArgs: "ver=" + ((new Date()).getTime()),
  baseUrl: '../wp-content/themes/walnut/walnut/dev/js',
  paths: {
    jquery: 'plugins/jquery',
    jqueryui: 'plugins/jquery.ui',
    jqueryresize: 'plugins/jquery.ba-resize.min',
    kinetic: 'plugins/kinetic',
    kineticresize: 'plugins/kinetic.plugin.resize',
    jqueryvalidate: 'plugins/jquery.validate.min',
    underscore: 'plugins/underscore',
    backbone: 'plugins/backbone',
    babysitter: 'plugins/backbone.babysitter.min',
    bootstrap: 'plugins/bootstrap',
    bootstrapslider: 'plugins/bootstrap-slider',
    marionette: 'plugins/backbone.marionette',
    text: 'plugins/text',
    mustache: 'plugins/mustache',
    holder: 'plugins/holder',
    app: 'content-creator-app',
    plupload: 'plugins/plupload.full',
    syphon: 'plugins/backbone.syphon',
    underscorestring: 'plugins/underscorestring',
    entitiesloader: 'entities/content-creator-entities-loader',
    checkbox: 'plugins/flatui-checkbox',
    componentloader: 'components/builder-component-loader',
    spin: 'plugins/spin',
    jqueryspin: 'plugins/jquery.spin',
    jquerycolor: 'plugins/jquery.minicolors.min',
    jqueryknob: 'plugins/jquery.knob',
    ckeditor: 'plugins/ckeditor/ckeditor',
    select2: 'plugins/select2.min',
    tagsinput: 'plugins/bootstrap-tagsinput.min',
    screwbuttons: 'plugins/jquery.screwdefaultbuttonsV2',
    videojs: 'plugins/video',
    videojsplaylist: 'plugins/videojs-playlists.min',
    panzer: 'plugins/panzer',
    panzerlist: 'plugins/panzerlist',
    sidr: 'plugins/jquery.sidr.min',
    imageareaselect: '../../../../../../wp-includes/js/imgareaselect/jquery.imgareaselect.min',
    imageedit: '../../../../../../wp-admin/js/image-edit',
    json2: '../../../../../../wp-includes/js/json2',
    svgpainter: '../../../../../../wp-admin/js/svg-painter'
  },
  shim: {
    imageedit: ['jquery', 'json2', 'imageareaselect'],
    imageareaselect: ['jquery'],
    svgpainter: ['jquery'],
    underscore: {
      exports: '_'
    },
    jquery: ['underscore'],
    jqueryui: ['jquery'],
    jqueryresize: ['jquery', 'jqueryui'],
    jquerycolor: ['jquery'],
    jqueryknob: ['jquery'],
    kineticresize: ['kinetic'],
    sidr: ['jquery'],
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    babysitter: ['backbone'],
    marionette: {
      deps: ['backbone'],
      exports: 'Marionette'
    },
    plupload: {
      deps: ['jquery'],
      exports: 'plupload'
    },
    bootstrap: ['jquery', 'jqueryui'],
    bootstrapslider: ['bootstrap'],
    checkbox: ['bootstrap'],
    jqueryvalidate: ['jquery'],
    underscorestring: ['underscore'],
    syphon: ['backbone'],
    select2: ['jquery', 'bootstrap'],
    tagsinput: ['jquery', 'bootstrap'],
    screwbuttons: ['jquery'],
    panzer: ['jquery'],
    panzerlist: ['jquery'],
    videojsplaylist: ['videojs'],
    app: ['plugins/content-creator-pluginloader', 'config/content-creator-configloader']
  }
});

require(['plugins/content-creator-pluginloader', 'config/content-creator-configloader', 'app', 'entitiesloader', 'componentloader', 'apps/content-creator-appsloader'], function(plugins, configs, App) {
  return App.start();
});
