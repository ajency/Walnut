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
        'change #storageOption': 'selectStorageOption',
        'click #syncStartContinue': 'startContinueSyncProcess',
        'click #syncMediaStart': 'startMediaSyncProcess'
      };

      AppSyncView.prototype.onShow = function() {
        $('#storageOption').prop("disabled", false);
        _.getDeviceStorageOptions().then(function(storageOptions) {
          var externalPath, internalPath, option, value;
          value = _.getStorageOption();
          option = JSON.parse(value);
          if (_.isNull(option)) {
            $("#storageOption").append('<option selected> Select your storage option</option>');
            $('#syncStartContinue').prop("disabled", true);
            $('#syncMediaStart').prop("disabled", true);
          } else {
            $("#storageOption").append('<option> Select your storage option</option>');
            $('#syncStartContinue').prop("disabled", false);
          }
          if (storageOptions.External) {
            internalPath = storageOptions.Internal;
            externalPath = storageOptions.External;
            if (!_.isNull(option) && option.internal) {
              $("#storageOption").append('<option selected value="' + internalPath + '">Internal Path :"' + internalPath + '"</option>');
              return $("#storageOption").append('<option value="' + externalPath + '">External Path :"' + externalPath + '"</option>');
            } else if (!_.isNull(option) && option.external) {
              $("#storageOption").append('<option value="' + internalPath + '">Internal Path :"' + internalPath + '"</option>');
              return $("#storageOption").append('<option selected value="' + externalPath + '">External Path :"' + externalPath + '"</option>');
            } else {
              $("#storageOption").append('<option value="' + internalPath + '">Internal Path :"' + internalPath + '"</option>');
              return $("#storageOption").append('<option value="' + externalPath + '">External Path :"' + externalPath + '"</option>');
            }
          } else {
            internalPath = storageOptions.Internal;
            if (!_.isNull(option) && option.internal) {
              return $("#storageOption").append('<option selected value="' + internalPath + '">Internal Path :"' + internalPath + '"</option>');
            } else {
              return $("#storageOption").append('<option value="' + internalPath + '">Internal Path :"' + internalPath + '"</option>');
            }
          }
        });
        _.cordovaHideSplashscreen();
        _.disableCordovaBackbuttonNavigation();
        cordova.getAppVersion().then(function(version) {
          return $('#app-version').text("Version: " + version);
        });
        return App.request("get:sync:controller");
      };

      AppSyncView.prototype.selectStorageOption = function() {
        var localStoragePath, storagePath, storagePathValue;
        storagePathValue = $("#storageOption").val();
        storagePath = $("#storageOption option:selected").text();
        if (storagePath.indexOf('Internal') === 0) {
          localStoragePath = {
            internal: storagePathValue
          };
        } else {
          localStoragePath = {
            external: storagePathValue
          };
        }
        _.setStorageOption(localStoragePath);
        return _.setSynapseMediaDirectoryPathToLocalStorage().then(function(path) {
          $('#storageOption').prop("disabled", true);
          $('#syncStartContinue').prop("disabled", false);
          return console.log('setSynapseMediaDirectoryPathToLocalStorage done');
        });
      };

      AppSyncView.prototype.startContinueSyncProcess = function() {
        var syncController;
        if (_.isOnline()) {
          this.connectionErrorMessage(false);
          syncController = App.request("get:sync:controller");
          return syncController.startContinueDataSyncProcess();
        } else {
          return this.connectionErrorMessage(true);
        }
      };

      AppSyncView.prototype.startMediaSyncProcess = function() {
        var syncController;
        if (_.isOnline()) {
          this.connectionErrorMessage(false);
          syncController = App.request("get:sync:controller");
          return syncController.startMediaSyncProcess();
        } else {
          return this.connectionErrorMessage(true);
        }
      };

      AppSyncView.prototype.connectionErrorMessage = function(display) {
        if (display) {
          $('#syncInternetConnection').css("display", "block").addClass("shake");
          return setTimeout((function(_this) {
            return function() {
              return $('#syncInternetConnection').removeClass("shake");
            };
          })(this), 1000);
        } else {
          return $('#syncInternetConnection').css("display", "none");
        }
      };

      return AppSyncView;

    })(Marionette.ItemView);
  });
});
