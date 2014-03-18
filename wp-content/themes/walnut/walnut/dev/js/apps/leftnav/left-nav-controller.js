var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/login/templates/login.html'], function(App, RegionController, loginTpl) {
  return App.module("LeftNavApp.Controller", function(Controller, App) {
    var LoginView;
    Controller.LeftNavController = (function(_super) {
      __extends(LeftNavController, _super);

      function LeftNavController() {
        return LeftNavController.__super__.constructor.apply(this, arguments);
      }

      LeftNavController.prototype.initialize = function() {
        var view;
        this.view = view = this._getLeftNavView();
        return this.show(view);
      };

      LeftNavController.prototype._getLeftNavView = function() {
        return new LeftNavView;
      };

      return LeftNavController;

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
