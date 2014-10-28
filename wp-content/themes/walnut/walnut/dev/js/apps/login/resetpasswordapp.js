var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module('RestPasswordApp', function(RestPasswordApp, App) {
    var RestPasswordView;
    RestPasswordApp.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getRestPasswordView = __bind(this._getRestPasswordView, this);
        this.resetUserPassword = __bind(this.resetUserPassword, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function() {
        this.view = this._getRestPasswordView();
        this.show(this.view);
        this.listenTo(this.view, 'close:popup:dialog', function() {
          return this.region.closeDialog();
        });
        return this.listenTo(this.view, 'reset:user:password', this.resetUserPassword);
      };

      Controller.prototype.resetUserPassword = function(email) {
        var connection_resp;
        console.log(email);
        connection_resp = $.middle_layer(AJAXURL + '?action=reset-user-password', {
          'email': email
        }, (function(_this) {
          return function(response) {
            if (response.error) {
              return _this.view.triggerMethod('reset:error', response.error);
            } else {
              return _this.view.triggerMethod("reset:mail:sent", email);
            }
          };
        })(this));
        if (connection_resp === "connection_error") {
          return this.view.triggerMethod('connection:fail');
        }
      };

      Controller.prototype._getRestPasswordView = function() {
        return new RestPasswordView();
      };

      return Controller;

    })(RegionController);
    RestPasswordView = (function(_super) {
      __extends(RestPasswordView, _super);

      function RestPasswordView() {
        return RestPasswordView.__super__.constructor.apply(this, arguments);
      }

      RestPasswordView.prototype.template = '<div class="row"> <div id="reset-password-form"> <form> <div class="col-md-12"> <label for="name">Your Email Address:</label> <input required="required" id="email" name="email" type="email" class="form-control"> <div class="error"></div> <button id="reset-password" class="btn btn-success btn-cons pull-right m-t-10" type="submit">Reset Password </button> </div> </form> </div> <div id="success-div" class="none"> <div class="col-md-12"> <div id="success_msg"></div> <button data-dismiss="modal" class="btn btn-success btn-cons pull-right m-t-10">OK</button> </div> </div> </div>';

      RestPasswordView.prototype.initialize = function() {
        return this.dialogOptions = {
          modal_title: 'Reset Password',
          modal_size: 'small'
        };
      };

      RestPasswordView.prototype.events = function() {
        return {
          'click #reset-password': 'validateEmail'
        };
      };

      RestPasswordView.prototype.validateEmail = function(e) {
        var email;
        e.preventDefault();
        if (!this.$el.find('form').valid()) {
          return this.$el.find('.error').html('Please enter a valid email address');
        } else {
          email = this.$el.find('#email').val();
          this.$el.find('.error').html('');
          return this.trigger('reset:user:password', email);
        }
      };

      RestPasswordView.prototype.onResetMailSent = function(email) {
        this.$el.find('#reset-password-form').remove();
        this.$el.find('#success-div').show();
        return this.$el.find('#success_msg').html('Successfully sent password reset link to ' + email);
      };

      RestPasswordView.prototype.onResetError = function(error_msg) {
        return this.$el.find('.error').html(error_msg);
      };

      return RestPasswordView;

    })(Marionette.CompositeView);
    return App.commands.setHandler('show:reset:password:popup', function(options) {
      return new RestPasswordApp.Controller(options);
    });
  });
});
