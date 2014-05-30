var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/app-sync/templates/appsync3.html'], function(App, RegionController, AppSyncTpl) {
  return App.module("AppSync.Controller", function(Controller, App) {
    var AppSyncView;
    Controller.AppSync3Controller = (function(_super) {
      __extends(AppSync3Controller, _super);

      function AppSync3Controller() {
        return AppSync3Controller.__super__.constructor.apply(this, arguments);
      }

      AppSync3Controller.prototype.initialize = function() {
        var view;
        this.view = view = this._getAppSyncView();
        return this.show(view, {
          loading: true
        });
      };

      AppSync3Controller.prototype._getAppSyncView = function() {
        return new AppSyncView;
      };

      return AppSync3Controller;

    })(RegionController);
    return AppSyncView = (function(_super) {
      __extends(AppSyncView, _super);

      function AppSyncView() {
        return AppSyncView.__super__.constructor.apply(this, arguments);
      }

      AppSyncView.prototype.template = AppSyncTpl;

      AppSyncView.prototype.events = {
        'click #DownloadNow': 'startDownload',
        'click #importNow': 'startImport'
      };

      AppSyncView.prototype.onShow = function() {
        var syncDetailsCount;
        navigator.splashscreen.hide();
        syncDetailsCount = _.getTotalSyncDetailsCount();
        return syncDetailsCount.done(function(count) {
          if (count === 0) {
            $('#imprtDateTime').hide();
            $('#progressBarDwnld').hide();
            $('#progressBarImprt').hide();
            $('#progressBarUpld').hide();
            $("#imprtFiles *").attr("disabled", "disabled").off('click');
            return $("#syncUpld3 *").attr("disabled", "disabled").off('click');
          } else {
            return App.navigate('teachers/dashboard', {
              trigger: true
            });
          }
        });
      };

      AppSyncView.prototype.startDownload = function() {
        var syncController;
        syncController = App.request("get:sync:controller");
        return syncController.dwnldUnZip();
      };

      AppSyncView.prototype.startImport = function() {
        var syncController;
        syncController = App.request("get:sync:controller");
        return syncController.readUnzipFile1();
      };

      return AppSyncView;

    })(Marionette.ItemView);
  });
});
