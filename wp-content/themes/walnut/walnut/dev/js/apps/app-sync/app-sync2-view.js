var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/app-sync/templates/appsync2.html'], function(App, RegionController, AppSyncTpl) {
  return App.module("AppSync.Controller", function(Controller, App) {
    var AppSyncView;
    Controller.AppSync2Controller = (function(_super) {
      __extends(AppSync2Controller, _super);

      function AppSync2Controller() {
        return AppSync2Controller.__super__.constructor.apply(this, arguments);
      }

      AppSync2Controller.prototype.initialize = function() {
        var view;
        this.view = view = this._getAppSyncView();
        return this.show(view, {
          loading: true
        });
      };

      AppSync2Controller.prototype._getAppSyncView = function() {
        return new AppSyncView;
      };

      return AppSync2Controller;

    })(RegionController);
    return AppSyncView = (function(_super) {
      __extends(AppSyncView, _super);

      function AppSyncView() {
        return AppSyncView.__super__.constructor.apply(this, arguments);
      }

      AppSyncView.prototype.template = AppSyncTpl;

      AppSyncView.prototype.onShow = function() {};

      return AppSyncView;

    })(Marionette.ItemView);
  });
});