var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/app-sync/app-sync-view', 'apps/app-sync/app-sync-controller', 'apps/app-sync/app-sync-underscore', 'apps/app-sync/app-sync-generate-file'], function(App) {
  return App.module("AppSync", function(AppSync, App) {
    var AppSyncRouter, Controller;
    AppSyncRouter = (function(_super) {
      __extends(AppSyncRouter, _super);

      function AppSyncRouter() {
        return AppSyncRouter.__super__.constructor.apply(this, arguments);
      }

      AppSyncRouter.prototype.appRoutes = {
        'sync': 'showAppSync'
      };

      return AppSyncRouter;

    })(Marionette.AppRouter);
    Controller = {
      showAppSync: function() {
        return new AppSync.Controller.AppSyncController({
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
