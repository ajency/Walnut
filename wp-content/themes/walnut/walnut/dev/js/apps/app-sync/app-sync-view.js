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
        this.listenTo(view, 'close:view', this.closeView);
        this.listenTo(view, 'close', function() {
          return App.navigate('teachers/dashboard', {
            trigger: true
          });
        });
        App.commands.setHandler("close:sync:view", function() {
          return this.view.close();
        });
        return this.show(view, {
          loading: true
        });
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
        'click #JsonToCSV': 'startConversion',
        'click #syncNow': 'startSyncProcess',
        'click #CSVupload': 'fileUpload'
      };

      AppSyncView.prototype.onShow = function() {
        var syncController;
        $('#syncText').text('');
        syncController = App.request("get:sync:controller");
        return syncController.totalRecordsUpdate();
      };

      AppSyncView.prototype.fileUpload = function() {};

      AppSyncView.prototype.startConversion = function() {
        var syncController;
        syncController = App.request("get:sync:controller");
        return syncController.selectRecords();
      };

      AppSyncView.prototype.startSyncProcess = function() {
        var syncController;
        $('i').addClass('fa-spin');
        $('#syncText').text('Syncing now...');
        syncController = App.request("get:sync:controller");
        return syncController.startSync();
      };

      return AppSyncView;

    })(Marionette.ItemView);
  });
});
