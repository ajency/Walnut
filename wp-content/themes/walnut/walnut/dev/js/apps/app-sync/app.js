var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/app-sync/app-sync1-view', 'apps/app-sync/app-sync2-view', 'apps/app-sync/app-sync3-view', 'apps/app-sync/app-sync-controller', 'apps/app-sync/app-sync-underscore'], function(App) {
  return App.module("AppSync", function(AppSync, App) {
    var AppSyncRouter, Controller;
    AppSyncRouter = (function(_super) {
      __extends(AppSyncRouter, _super);

      function AppSyncRouter() {
        return AppSyncRouter.__super__.constructor.apply(this, arguments);
      }

      AppSyncRouter.prototype.appRoutes = {
        'sync1': 'showAppSync1',
        'sync2': 'showAppSync2',
        'sync3': 'showAppSync3'
      };

      return AppSyncRouter;

    })(Marionette.AppRouter);
    Controller = {
      showAppSync1: function() {
        console.log('Router: ' + App.getCurrentRoute());
        return new AppSync.Controller.AppSync1Controller({
          region: App.mainContentRegion
        });
      },
      showAppSync2: function() {
        return new AppSync.Controller.AppSync2Controller({
          region: App.mainContentRegion
        });
      },
      showAppSync3: function() {
        return new AppSync.Controller.AppSync3Controller({
          region: App.mainContentRegion
        });
      }
    };
    return AppSync.on("start", function() {
      return new AppSyncRouter({
        controller: Controller
      });
    });
  });
});
