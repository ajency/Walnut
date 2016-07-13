var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/admin-content-modules/controller'], function(App, RegionController) {
  return App.module("AdminContentModulesApp", function(AdminContentModulesApp, App) {
    var AdminContentModulesRouter, Controller;
    AdminContentModulesRouter = (function(superClass) {
      extend(AdminContentModulesRouter, superClass);

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
