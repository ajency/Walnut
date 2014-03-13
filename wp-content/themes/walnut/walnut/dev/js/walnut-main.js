require.config({
  urlArgs: "ver=" + ((new Date()).getTime()),
  baseUrl: './wp-content/themes/walnut/walnut/dev/js',
  paths: {
    jquery: 'plugins/jquery',
    jqueryui: 'plugins/jquery.ui',
    underscore: 'plugins/underscore',
    backbone: 'plugins/backbone',
    marionette: 'plugins/backbone.marionette',
    text: 'plugins/text',
    app: 'walnut-app'
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
    app: ['plugins/walnut-pluginloader', 'config/walnut-configloader']
  }
});

require(['plugins/walnut-pluginloader', 'config/walnut-configloader', 'app', 'apps/walnut-appsloader'], function(plugins, configs, App) {
  return App.start();
});
