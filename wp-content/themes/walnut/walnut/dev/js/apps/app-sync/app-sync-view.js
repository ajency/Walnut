var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/app-sync/templates/appsync.html'], function(App, RegionController, AppSyncTpl) {
  return App.module("AppSync.Controller", function(Controller, App) {
    var AppSyncView;
    Controller.AppSyncController = (function(_super) {
      __extends(AppSyncController, _super);

      function AppSyncController() {
        return AppSyncController.__super__.constructor.apply(this, arguments);
      }

      AppSyncController.prototype.initialize = function() {
        var view;
        this.view = view = this._getAppSyncView();
        return this.show(view);
      };

      AppSyncController.prototype._getAppSyncView = function() {
        return new AppSyncView;
      };

      return AppSyncController;

    })(RegionController);
    return AppSyncView = (function(_super) {
      __extends(AppSyncView, _super);

      function AppSyncView() {
        return AppSyncView.__super__.constructor.apply(this, arguments);
      }

      AppSyncView.prototype.template = AppSyncTpl;

      AppSyncView.prototype.events = {
        'click #syncStartContinue': 'startContinueSyncProcess',
        'click #syncMediaStart': 'startMediaSyncProcess'
      };

      AppSyncView.prototype.onShow = function() {
        App.breadcrumbRegion.close();
        _.cordovaHideSplashscreen();
        cordova.getAppVersion().then(function(version) {
          return $('#app-version').text("Version: " + version);
        });
        return App.request("get:sync:controller");
      };

      AppSyncView.prototype.startContinueSyncProcess = function() {
        var syncController;
        syncController = App.request("get:sync:controller");
        return syncController.startContinueDataSyncProcess();
      };

      AppSyncView.prototype.startMediaSyncProcess = function() {
        var syncController;
        syncController = App.request("get:sync:controller");
        return syncController.startMediaSyncProcess();
      };

      return AppSyncView;

    })(Marionette.ItemView);
  });
});
