var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/login/templates/login.html'], function(App, RegionController, loginTpl) {
  return App.module("LoginApp.Controller", function(Controller, App) {
    var LoginView;
    Controller.LoginController = (function(_super) {
      __extends(LoginController, _super);

      function LoginController() {
        this.authenticateUser = __bind(this.authenticateUser, this);
        return LoginController.__super__.constructor.apply(this, arguments);
      }

      LoginController.prototype.initialize = function() {
        var view;
        this.view = view = this._getLoginView();
        this.listenTo(view, 'authenticate:user', this.authenticateUser);
        return this.show(view);
      };

      LoginController.prototype._getLoginView = function() {
        return new LoginView;
      };

      LoginController.prototype.authenticateUser = function(data) {
        return $.get(AJAXURL + '?action=get-user-profile', {
          data: data
        }, function(response) {
          return this.view.close();
        }, 'json');
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

      LoginView.prototype.events = {
        'click #login-submit': 'submitLogin'
      };

      LoginView.prototype.submitLogin = function(e) {
        var data;
        e.preventDefault();
        if (this.$el.find('form').valid()) {
          data = Backbone.Syphon.serialize(this);
          return this.trigger("authenticate:user", data);
        }
      };

      return LoginView;

    })(Marionette.ItemView);
  });
});
