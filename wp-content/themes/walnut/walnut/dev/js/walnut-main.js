require.config({
  urlArgs: "ver=" + ((new Date()).getTime()),
  baseUrl: './wp-content/themes/walnut/walnut/dev/js',
  paths: {
    pace: 'plugins/pace',
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
    search_results: 'plugins/search_results',
    spin: 'plugins/spin',
    jqueryspin: 'plugins/jquery.spin',
<<<<<<< HEAD
    unveil: 'plugins/jquery.unveil.min',
    detect: 'plugins/detect'
=======
    detect: 'plugins/detect',
    unveil: 'plugins/jquery.unveil.min'
>>>>>>> 877861fde745e966b10661f2169a67d4996e938b
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
    sidr: ['jquery'],
    unveil: ['jquery'],
    slimroll: ['jquery'],
    core: ['sidr', 'jquery'],
    breakpoints: ['jquery'],
    mixitup: ['jquery'],
    search_results: ['jquery', 'mixitup'],
    jqueryspin: ['spin'],
    jqueryvalidate: ['jquery'],
    syphon: ['backbone'],
    underscorestring: ['underscore'],
    app: ['plugins/walnut-pluginloader', 'config/walnut-configloader']
  }
});

require(['plugins/walnut-pluginloader', 'config/walnut-configloader', 'app', 'apps/walnut-appsloader', 'entities/walnut-entities-loader', 'componentloader'], function(plugins, configs, App) {
  return App.start();
});
