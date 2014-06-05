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
        'click #syncStartContinue': 'startContinueSyncProcess'
      };

      AppSyncView.prototype.onShow = function() {
        var lastSyncOperation, totalRecordsTobeSynced;
        App.breadcrumbRegion.close();
        totalRecordsTobeSynced = _.getTotalRecordsTobeSynced();
        totalRecordsTobeSynced.done(function(totalRecords) {
          if (totalRecords === 0) {
            return $('#totalRecordsToBeSynced').text("Data already upto date");
          } else {
            return $('#totalRecordsToBeSynced').text("" + totalRecords + " record(s) to be synced");
          }
        });
        lastSyncOperation = _.getLastSyncOperation();
        return lastSyncOperation.done(function(typeOfOperation) {
          console.log('typeOfOperation: ' + typeOfOperation);
          switch (typeOfOperation) {
            case 'none':
              return $('#syncButtonText').text('Start');
            case 'file_import':
              return $('#syncButtonText').text('Start');
            case 'file_download':
              return $('#syncButtonText').text('Continue');
            case 'file_generate':
              return $('#syncButtonText').text('Continue');
            case 'file_upload':
              return $('#syncButtonText').text('Continue');
          }
        });
      };

      AppSyncView.prototype.startContinueSyncProcess = function() {
        var lastSyncOperation;
        lastSyncOperation = _.getLastSyncOperation();
        return lastSyncOperation.done(function(typeOfOperation) {
          switch (typeOfOperation) {
            case 'none':
              $('#syncStartContinue').css("display", "none");
              $('#syncSuccess').css("display", "block").text("Started sync process...");
              return setTimeout((function(_this) {
                return function() {
                  var syncController;
                  syncController = App.request("get:sync:controller");
                  return syncController.getDownloadURL();
                };
              })(this), 3000);
            case 'file_import':
              $('#syncStartContinue').css("display", "none");
              $('#syncSuccess').css("display", "block").text("Started sync process...");
              setTimeout((function(_this) {
                return function() {
                  var syncController;
                  $('#syncSuccess').css("display", "block").text("Generating file...");
                  syncController = App.request("get:sync:controller");
                  return syncController.updateSyncDetails('file_generate', _.getCurrentDateTime(2));
                };
              })(this), 2000);
              setTimeout((function(_this) {
                return function() {
                  var syncController;
                  syncController = App.request("get:sync:controller");
                  syncController.updateSyncDetails('file_generate', _.getCurrentDateTime(2));
                  return $('#syncSuccess').css("display", "block").text("File generation completed...");
                };
              })(this), 4000);
              setTimeout((function(_this) {
                return function() {
                  return $('#syncSuccess').css("display", "block").text("Starting file upload...");
                };
              })(this), 6000);
              setTimeout((function(_this) {
                return function() {
                  var syncController;
                  syncController = App.request("get:sync:controller");
                  syncController.updateSyncDetails('file_upload', _.getCurrentDateTime(2));
                  return $('#syncSuccess').css("display", "block").text("File upload completed...");
                };
              })(this), 8000);
              return setTimeout((function(_this) {
                return function() {
                  var syncController;
                  syncController = App.request("get:sync:controller");
                  return syncController.getDownloadURL();
                };
              })(this), 10000);
            case 'file_download':
              $('#syncStartContinue').css("display", "none");
              $('#syncSuccess').css("display", "block").text("Resuming sync process...");
              return setTimeout((function(_this) {
                return function() {
                  var syncController;
                  syncController = App.request("get:sync:controller");
                  return syncController.readUnzipFile1();
                };
              })(this), 3000);
            case 'file_generate':
              $('#syncStartContinue').css("display", "none");
              $('#syncSuccess').css("display", "block").text("Resuming sync process...");
              setTimeout((function(_this) {
                return function() {
                  return $('#syncSuccess').css("display", "block").text("Starting file upload...");
                };
              })(this), 3000);
              setTimeout((function(_this) {
                return function() {
                  var syncController;
                  syncController = App.request("get:sync:controller");
                  syncController.updateSyncDetails('file_upload', _.getCurrentDateTime(2));
                  return $('#syncSuccess').css("display", "block").text("File upload completed...");
                };
              })(this), 5000);
              return setTimeout((function(_this) {
                return function() {
                  var syncController;
                  syncController = App.request("get:sync:controller");
                  return syncController.getDownloadURL();
                };
              })(this), 7000);
            case 'file_upload':
              $('#syncStartContinue').css("display", "none");
              $('#syncSuccess').css("display", "block").text("Resuming sync process...");
              return setTimeout((function(_this) {
                return function() {
                  var syncController;
                  syncController = App.request("get:sync:controller");
                  return syncController.getDownloadURL();
                };
              })(this), 3000);
          }
        });
      };

      return AppSyncView;

    })(Marionette.ItemView);
  });
});
