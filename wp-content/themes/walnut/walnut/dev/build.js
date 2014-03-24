({
  baseUrl: './js',
  name: 'plugins/almond',
  include : 'walnut-main',
  optimize: 'none',
  wrap: false,
  out: '../production/walnut-main.js',
  paths: {
    jquery: 'plugins/jquery',
    jqueryui: 'plugins/jquery.ui',
    jqueryvalidate: 'plugins/jquery.validate.min',
    underscore: 'plugins/underscore',
    backbone: 'plugins/backbone',
    marionette: 'plugins/backbone.marionette',
    text: 'plugins/text',
    app: 'walnut-app',
    syphon: 'plugins/backbone.syphon',
    sidr: 'plugins/jquery.sidr.min',
    slimroll: 'plugins/jquery.slimscroll.min',
    breakpoints: 'plugins/breakpoints',
    mustache: 'plugins/mustache',
    core: 'plugins/core'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    jquery: ['underscore'],
    jqueryui: ['jquery'],
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    marionette: {
      deps: ['backbone'],
      exports: 'Marionette'
    },
    sidr: ['jquery'],
    slimroll: ['jquery'],
    core: ['sidr', 'jquery'],
    breakpoints: ['jquery'],
    jqueryvalidate: ['jquery'],
    syphon: ['backbone'],
    app: ['plugins/walnut-pluginloader', 'config/walnut-configloader']
  }
})