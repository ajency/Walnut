var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/login/templates/login.html'], function(App, RegionController, loginTpl) {
  return App.module("LoginApp.Controller", function(Controller, App) {
    var LoginView;
    Controller.LoginController = (function(_super) {
      __extends(LoginController, _super);

      function LoginController() {
        return LoginController.__super__.constructor.apply(this, arguments);
      }

      LoginController.prototype.initialize = function() {
        var view;
        view = this._getLoginView();
        return this.show(view);
      };

      LoginController.prototype._getLoginView = function() {
        return new LoginView;
      };

      return LoginController;

    })(RegionController);
    return LoginView = (function(_super) {
      __extends(LoginView, _super);

      function LoginView() {
        return LoginView.__super__.constructor.apply(this, arguments);
      }

      LoginView.prototype.template = loginTpl;

      LoginView.prototype.className = 'error-body no-top  pace-done';

      return LoginView;

    })(Marionette.ItemView);
  });
});
