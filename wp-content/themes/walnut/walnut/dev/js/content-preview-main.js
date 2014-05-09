require.config({
  urlArgs: "ver=" + ((new Date()).getTime()),
  baseUrl: '../wp-content/themes/walnut/walnut/dev/js',
  paths: {
    app: 'content-preview-app',
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
    plupload: 'plugins/plupload.full',
    syphon: 'plugins/backbone.syphon',
    underscorestring: 'plugins/underscorestring',
    entitiesloader: 'entities/content-preview-entities-loader',
    checkbox: 'plugins/flatui-checkbox',
    componentloader: 'components/preview-component-loader',
    spin: 'plugins/spin',
    jqueryspin: 'plugins/jquery.spin',
    ckeditor: 'plugins/ckeditor/ckeditor',
    screwbuttons: 'plugins/jquery.screwdefaultbuttonsV2',
    bridget: 'plugins/jquery.bridget',
    isotope: 'plugins/isotope.pkgd.min'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    jquery: ['underscore'],
    jqueryui: ['jquery'],
    jqueryresize: ['jquery', 'jqueryui'],
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
    bootstrap: ['jquery', 'jqueryui'],
    checkbox: ['bootstrap'],
    jqueryvalidate: ['jquery'],
    underscorestring: ['underscore'],
    syphon: ['backbone'],
    screwbuttons: ['jquery'],
    app: ['plugins/content-preview-pluginloader', 'config/content-preview-configloader'],
    bridget: ['jquery'],
    isotope: ['jquery', 'bridget']
  }
});

require(['plugins/content-preview-pluginloader', 'config/content-preview-configloader', 'app', 'entitiesloader', 'componentloader', 'apps/content-preview-appsloader'], function(plugins, configs, App) {
  return App.start();
});
