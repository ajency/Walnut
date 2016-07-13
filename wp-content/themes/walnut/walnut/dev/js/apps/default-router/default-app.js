var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module("DefaultApp", function(DefaultApp, App) {
    var Controller, DefaultAppRouter;
    DefaultAppRouter = (function(superClass) {
      extend(DefaultAppRouter, superClass);

      function DefaultAppRouter() {
        return DefaultAppRouter.__super__.constructor.apply(this, arguments);
      }

      DefaultAppRouter.prototype.appRoutes = {
        'route-not-found': 'routeNotFound'
      };

      return DefaultAppRouter;

    })(Marionette.AppRouter);
    Controller = {
      routeNotFound: function() {
        return App.execute("show:404:app", {
          region: App.mainContentRegion
        });
      }
    };
    return DefaultApp.on("start", function() {
      return new DefaultAppRouter({
        controller: Controller
      });
    });
  });
});
