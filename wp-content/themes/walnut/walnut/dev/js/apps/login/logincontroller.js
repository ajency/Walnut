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
        this.view = view = this._getLoginView();
        this.listenTo(view, 'authenticate:user', this.authenticateUser);
        this.listenTo(view, 'close', function() {
          return App.vent.trigger('show:dashboard');
        });
        this.listenTo(view, 'prepopulate:username', this.prepopulateUsername);
        this.listenTo(view, 'disable:offline:login:type', this.disableOfflineLoginType);
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
                return _this.view.close();
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

      LoginController.prototype.disableOfflineLoginType = function() {
        if (_.isUndefined(this.username)) {
          $("#online").prop("checked", true);
          $("#offline").prop("checked", false);
          return $('#offline').prop("disabled", true);
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
          _.createSynapseImagesDirectory();
          this.trigger("prepopulate:username");
          _.setMainLogo();
          if (_.isOnline()) {
            $('#connectionStatus').text('Available');
          } else {
            $('#connectionStatus').text('Unavailable');
            $('#online').prop("disabled", true);
          }
          this.trigger("disable:offline:login:type");
          return navigator.splashscreen.hide();
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
