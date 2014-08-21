require.config({
  urlArgs: "ver=" + ((new Date()).getTime()),
  baseUrl: '/dev/js',
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
    componentloader: 'components/component-loader',
    mixitup: 'plugins/jquery.mixitup.min',
    spin: 'plugins/spin',
    jqueryspin: 'plugins/jquery.spin',
    tablesorter: 'plugins/jquery.tablesorter',
    tablesorter_pager: 'plugins/jquery.tablesorter.pager',
    unveil: 'plugins/jquery.unveil.min',
    moment: 'plugins/moment.min',
    select2: 'plugins/select2.min',
    jquery_listnav: 'plugins/jquery-listnav',
    unserialize: 'plugins/unserialize',
    serialize: 'plugins/serialize',
    fastclick: 'plugins/fastclick',
    walnutGlobal: 'plugins/walnutapp-global'
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
    breakpoints: ['jquery'],
    mixitup: ['jquery'],
    jqueryspin: ['spin'],
    moment: ['jquery'],
    select2: ['jquery', 'bootstrap'],
    jquery_listnav: ['jquery'],
    jqueryvalidate: ['jquery'],
    syphon: ['backbone'],
    app: ['plugins/cordova-pluginloader', 'config/walnut-configloader']
  }
});

require(['plugins/cordova-pluginloader', 'config/walnut-configloader', 'cordova/cordova-apploader', 'app', 'entities/walnut-entities-loader', 'apps/cordova-walnut-appsloader', 'controllers/authenticationcontroller', 'componentloader'], function(plugins, configs, cordova, App) {
  return App.start();
});
