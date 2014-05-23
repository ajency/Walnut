var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/login/logincontroller', 'apps/login/app-login/app-login-controller'], function(App) {
  return App.module("LoginApp", function(LoginApp, App) {
    var Controller, LoginRouter;
    LoginRouter = (function(_super) {
      __extends(LoginRouter, _super);

      function LoginRouter() {
        return LoginRouter.__super__.constructor.apply(this, arguments);
      }

      LoginRouter.prototype.appRoutes = {
        'login': 'showLogin',
        'login/:user': 'showLoginWithUser',
        'app-login': 'appLogin'
      };

      return LoginRouter;

    })(Marionette.AppRouter);
    Controller = {
      showLogin: function() {
        var userdata;
        userdata = App.request("get:user:model");
        if (!userdata.get('ID')) {
          return new LoginApp.Controller.LoginController({
            region: App.loginRegion
          });
        }
      },
      showLoginWithUser: function(username) {
        var userdata;
        userdata = App.request("get:user:model");
        if (!userdata.get('ID')) {
          return new LoginApp.Controller.LoginController({
            region: App.loginRegion,
            username: username
          });
        }
      },
      appLogin: function() {
        var userdata;
        userdata = App.request("get:user:model");
        if (!userdata.get('ID')) {
          return new LoginApp.Controller.AppController({
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
