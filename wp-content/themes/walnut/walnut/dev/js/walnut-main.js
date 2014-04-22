require.config({
  urlArgs: "ver=" + ((new Date()).getTime()),
  baseUrl: './wp-content/themes/walnut/walnut/dev/js',
  paths: {
    jquery: 'plugins/jquery',
    jqueryui: 'plugins/jquery.ui',
    jqueryvalidate: 'plugins/jquery.validate.min',
    bootstrap: 'plugins/bootstrap.min',
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
    componentloader: 'components/component-loader',
    mixitup: 'plugins/jquery.mixitup.min',
    spin: 'plugins/spin',
    jqueryspin: 'plugins/jquery.spin',
    tablesorter: 'plugins/jquery.tablesorter',
    tablesorter_pager: 'plugins/jquery.tablesorter.pager',
    unveil: 'plugins/jquery.unveil.min',
    detect: 'plugins/detect',
    moment: 'plugins/moment.min',
    select2: 'plugins/select2.min',
    datepicker: 'plugins/bootstrap-datepicker',
    timepicker: 'plugins/bootstrap-timepicker.min'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    jquery: ['underscore'],
    jqueryui: ['jquery'],
    bootstrap: ['jquery'],
    underscorestring: ['jquery', 'underscore'],
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    marionette: {
      deps: ['backbone'],
      exports: 'Marionette'
    },
    sidr: ['jquery'],
    tablesorter: ['jquery'],
    tablesorter_pager: ['jquery', 'tablesorter'],
    unveil: ['jquery'],
    slimroll: ['jquery'],
    core: ['sidr', 'jquery'],
    breakpoints: ['jquery'],
    mixitup: ['jquery'],
    jqueryspin: ['spin'],
    jqueryvalidate: ['jquery'],
    syphon: ['backbone'],
    moment: ['jquery'],
    select2: ['jquery', 'bootstrap'],
    datepicker: ['jquery', 'bootstrap'],
    timepicker: ['jquery', 'bootstrap'],
    app: ['plugins/walnut-pluginloader', 'config/walnut-configloader']
  }
});

require(['plugins/walnut-pluginloader', 'config/walnut-configloader', 'app', 'apps/walnut-appsloader', 'entities/walnut-entities-loader', 'componentloader'], function(plugins, configs, App) {
  return App.start();
});
