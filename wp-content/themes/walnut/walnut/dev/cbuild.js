({
  baseUrl: './js',
  name: 'plugins/almond',
  include : 'content-creator-main',
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
    componentloader   : 'components/builder-component-loader',
    checkbox      : 'plugins/flatui-checkbox',
    spin        : 'plugins/spin',
    jqueryspin      : 'plugins/jquery.spin',
    bootstrapslider   : 'plugins/bootstrap-slider',
    jquerycolor     : 'plugins/jquery.minicolors.min'
    
  },
  shim: {
    underscore: {
      exports: '_'
    },
    jquery: ['underscore'],
    jqueryui: ['jquery'],
    jqueryresize: ['jquery', 'jqueryui'],
    jquerycolor :['jquery'],
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
    jqueryvalidate: ['jquery'],
    underscorestring: ['underscore'],
    syphon: ['backbone'],
    checkbox  : ['bootstrap'],
    app: ['plugins/content-creator-pluginloader', 'config/content-creator-configloader']
  }
})