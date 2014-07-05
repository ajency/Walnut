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

      LoginController.prototype.initialize = function(opts) {
        var view;
        this.username = opts.username;
        _.app_username = this.username;
        this.view = view = this._getLoginView();
        this.listenTo(view, 'authenticate:user', this.authenticateUser);
        this.listenTo(view, 'prepopulate:username', this.prepopulateUsername);
        this.listenTo(view, 'enable:disable:offline:login:type', this.enableDisableOfflineLoginType);
        if (_.platform() === 'BROWSER') {
          return this.show(view, {
            loading: true
          });
        } else {
          return this.show(view);
        }
      };

      LoginController.prototype._getLoginView = function() {
        return new LoginView;
      };

      LoginController.prototype.authenticateUser = function(data) {
        var authController, authOptions;
        authOptions = {
          url: AJAXURL + '?action=get-user-profile',
          data: data,
          success: (function(_this) {
            return function(resp) {
              var user;
              if (resp.error) {
                return _this.view.triggerMethod('login:fail', resp);
              } else {
                user = App.request("get:user:model");
                user.set(resp);
                _this.view.close();
                return App.vent.trigger('show:dashboard');
              }
            };
          })(this)
        };
        authController = App.request("get:auth:controller", authOptions);
        return authController.authenticate();
      };

      LoginController.prototype.prepopulateUsername = function() {
        if (!_.isUndefined(this.username)) {
          return $('#txtusername').val($.trim(this.username));
        }
      };

      LoginController.prototype.enableDisableOfflineLoginType = function() {
        if (_.isUndefined(this.username)) {
          return $('#onOffSwitch').prop({
            "disabled": true,
            "checked": true
          });
        } else {
          if (_.isOnline()) {
            return $('#onOffSwitch').prop({
              "disabled": false,
              "checked": false
            });
          } else {
            return $('#onOffSwitch').prop({
              "disabled": true,
              "checked": false
            });
          }
        }
      };

      return LoginController;

    })(RegionController);
    LoginView = (function(_super) {
      __extends(LoginView, _super);

      function LoginView() {
        return LoginView.__super__.constructor.apply(this, arguments);
      }

      LoginView.prototype.template = loginTpl;

      LoginView.prototype.className = '';

      LoginView.prototype.events = {
        'click #login-submit': 'submitLogin'
      };

      LoginView.prototype.onShow = function() {
        $('body').addClass('error-body no-top');
        $('.page-content').addClass('condensed');
        if (_.platform() === 'DEVICE') {
          _.setSynapseMediaDirectoryPathToLocalStorage();
          navigator.splashscreen.hide();
          _.setSchoolLogo();
          _.displayConnectionStatusOnMainLoginPage();
          _.cordovaOnlineOfflineEvents();
          this.trigger("prepopulate:username");
          return this.trigger("enable:disable:offline:login:type");
        }
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
        return this.$el.find('#login-form').before('<div id="invalid_login" class="alert alert-error"><span class="fa fa-warning"></span> ' + resp.error + '</div>');
      };

      return LoginView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:login:view:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.LoginController(opt);
    });
  });
});
