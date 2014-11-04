var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/admin-content-modules/controller'], function(App, RegionController) {
  return App.module("AdminContentModulesApp", function(AdminContentModulesApp, App) {
    var AdminContentModulesRouter, Controller;
    AdminContentModulesRouter = (function(_super) {
      __extends(AdminContentModulesRouter, _super);

      function AdminContentModulesRouter() {
        return AdminContentModulesRouter.__super__.constructor.apply(this, arguments);
      }

      AdminContentModulesRouter.prototype.appRoutes = {
        'admin/view-all-modules': 'adminViewModules'
      };

      return AdminContentModulesRouter;

    })(Marionette.AppRouter);
    Controller = {
      adminViewModules: function() {
        if ($.allowRoute('admin/view-all-modules')) {
          return new AdminContentModulesApp.View.AdminModulesController({
            region: App.mainContentRegion
          });
        } else {
          return App.execute("show:no:permissions:app", {
            region: App.mainContentRegion
          });
        }
      }
    };
    return AdminContentModulesApp.on("start", function() {
      return new AdminContentModulesRouter({
        controller: Controller
      });
    });
  });
});
