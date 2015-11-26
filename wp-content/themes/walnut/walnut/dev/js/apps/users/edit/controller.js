var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/users/edit/edituser'], function(App, RegionController) {
  return App.module('UsersApp.Edit', function(EditApp, App) {
    return EditApp.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._showView = __bind(this._showView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var userModel;
        if (options.id) {
          userModel = App.request("get:user:by:id", options.id);
          return App.execute("when:fetched", userModel, (function(_this) {
            return function() {
              return _this._showView(userModel);
            };
          })(this));
        } else {
          userModel = App.request("new:user");
          return this._showView(userModel);
        }
      };

      Controller.prototype._showView = function(userModel) {
        this.view = new EditApp.Views.EditUser({
          model: userModel
        });
        return this.show(this.view);
      };

      return Controller;

    })(RegionController);
  });
});
