require.config({
  urlArgs: "ver=1",
  baseUrl: '../wp-content/themes/walnut/walnut/dev/js',
  paths: {
    pace: 'plugins/pace',
    jquery: 'plugins/jquery',
    jqueryui: 'plugins/jquery.ui',
    jqueryresize: 'plugins/jquery.ba-resize.min',
    kinetic: 'plugins/kinetic',
    kineticresize: 'plugins/kinetic.plugin.resize',
    jqueryvalidate: 'plugins/jquery.validate.min',
    underscore: 'plugins/underscore',
    backbone: 'plugins/backbone',
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
    jqueryknob: 'plugins/jquery.knob'
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
    bootstrap: ['jquery', 'jqueryui'],
    bootstrapslider: ['bootstrap'],
    checkbox: ['bootstrap'],
    jqueryvalidate: ['jquery'],
    underscorestring: ['underscore'],
    syphon: ['backbone'],
    app: ['plugins/content-creator-pluginloader', 'config/content-creator-configloader']
  }
});

require(['plugins/content-creator-pluginloader', 'configs/content-creator-configloader', 'app', 'entitiesloader', 'componentloader', 'apps/content-creator-appsloader'], function(plugins, configs, App) {
  return App.start();
});
