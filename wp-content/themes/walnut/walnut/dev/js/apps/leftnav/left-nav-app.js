var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/leftnav/leftnavcontroller'], function(App) {
  return App.module("LeftNavApp", function(LeftNavApp, App) {
    var Controller, LeftNavRouter;
    LeftNavRouter = (function(_super) {
      __extends(LeftNavRouter, _super);

      function LeftNavRouter() {
        return LeftNavRouter.__super__.constructor.apply(this, arguments);
      }

      LeftNavRouter.prototype.appRoutes = {
        '': 'showLeftNav'
      };

      return LeftNavRouter;

    })(Marionette.AppRouter);
    Controller = {
      showLeftNav: function() {
        return new LeftNavApp.Controller.LeftNavController({
          region: App.leftNavRegion
        });
      }
    };
    return LeftNavApp.on("start", function() {
      return new LeftNavRouter({
        controller: Controller
      });
    });
  });
});
