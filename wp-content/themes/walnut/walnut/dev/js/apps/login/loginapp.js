var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/login/logincontroller'], function(App) {
  return App.module("LoginApp", function(LoginApp, App) {
    var Controller, LoginRouter;
    LoginRouter = (function(superClass) {
      extend(LoginRouter, superClass);

      function LoginRouter() {
        return LoginRouter.__super__.constructor.apply(this, arguments);
      }

      LoginRouter.prototype.appRoutes = {
        'login': 'showLogin'
      };

      return LoginRouter;

    })(Marionette.AppRouter);
    Controller = {
      showLogin: function() {
        if ($.allowRoute('login')) {
          return new LoginApp.Controller.LoginController({
            region: App.loginRegion
          });
        }
      }
    };
    return LoginApp.on("start", function() {
      return new LoginRouter({
        controller: Controller
      });
    });
  });
});
