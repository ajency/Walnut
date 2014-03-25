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
        this.listenTo(view, 'close', function() {
          return App.vent.trigger('show:dashboard');
        });
        return this.show(view, {
          loading: true
        });
      };

      LoginController.prototype._getLoginView = function() {
        return new LoginView;
      };

      LoginController.prototype.authenticateUser = function(data) {
        return $.middle_layer(AJAXURL + '?action=get-user-profile', {
          data: data
        }, (function(_this) {
          return function(response) {
            if (response.error) {
              return _this.view.triggerMethod('login:fail', response);
            } else {
              return _this.view.close();
            }
          };
        })(this));
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
          this.$el.find('#checking_login').remove();
          this.$el.find('#login-submit').append('<i id="checking_login" class="fa fa-spinner fa fa-1x fa-spin"></i>');
          data = Backbone.Syphon.serialize(this);
          return this.trigger("authenticate:user", data);
        }
      };

      LoginView.prototype.onLoginFail = function(resp) {
        this.$el.find('#checking_login, #invalid_login').remove();
        return this.$el.find('#login-form').before('<span id="invalid_login" class="btn btn-danger btn-cons">' + resp.error + '</span>');
      };

      return LoginView;

    })(Marionette.ItemView);
  });
});
