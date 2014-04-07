({
  baseUrl: './js',
  name: 'plugins/almond',
  include : 'walnut-main',
  //optimize: 'none',
  wrap: false,
  out: '../production/walnut-main.js',
  paths: {
    pace        : 'plugins/pace',
    jquery: 'plugins/jquery',
    jqueryui: 'plugins/jquery.ui',
    bootstrap     : 'plugins/bootstrap',
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
    mixitup       : 'plugins/jquery.mixitup.min',
    spin        : 'plugins/spin',
    jqueryspin      : 'plugins/jquery.spin',
    componentloader   : 'components/component-loader',
    unveil        : 'plugins/jquery.unveil.min',
    detect: 'plugins/detect',
    tablesorter     : 'plugins/jquery.tablesorter',
    tablesorter_pager : 'plugins/jquery.tablesorter.pager',
    moment            :'plugins/moment.min',
    select2       : 'plugins/select2.min'
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
    tablesorter_pager: ['jquery','tablesorter'],
    sidr: ['jquery'],
    unveil: ['jquery'],
    slimroll: ['jquery'],
    core: ['sidr', 'jquery'],
    breakpoints: ['jquery'],
    jqueryvalidate: ['jquery'],
    syphon: ['backbone'],
    underscorestring: ['underscore'],
    mixitup     : ['jquery'],
    moment      : ['jquery'],
    select2      : ['jquery','bootstrap'],
    app: ['plugins/walnut-pluginloader', 'config/walnut-configloader'],
  }
})