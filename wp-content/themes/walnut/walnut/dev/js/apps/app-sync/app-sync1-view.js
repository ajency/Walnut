var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/app-sync/templates/appsync1.html'], function(App, RegionController, AppSyncTpl) {
  return App.module("AppSync.Controller", function(Controller, App) {
    var AppSyncView;
    Controller.AppSync1Controller = (function(_super) {
      __extends(AppSync1Controller, _super);

      function AppSync1Controller() {
        return AppSync1Controller.__super__.constructor.apply(this, arguments);
      }

      AppSync1Controller.prototype.initialize = function() {
        var view;
        this.view = view = this._getAppSyncView();
        return this.show(view, {
          loading: true
        });
      };

      AppSync1Controller.prototype._getAppSyncView = function() {
        return new AppSyncView;
      };

      return AppSync1Controller;

    })(RegionController);
    return AppSyncView = (function(_super) {
      __extends(AppSyncView, _super);

      function AppSyncView() {
        return AppSyncView.__super__.constructor.apply(this, arguments);
      }

      AppSyncView.prototype.template = AppSyncTpl;

      AppSyncView.prototype.events = {
        'click #syncNow': 'startSyncProcess',
        'click #upSync1': 'gotoSync3View'
      };

      AppSyncView.prototype.onShow = function() {
        var recordsToBeSynced;
        _.checkSynapseAssetsDirectory();
        App.breadcrumbRegion.close();
        navigator.splashscreen.hide();
        recordsToBeSynced = _.getTotalRecordsTobeSynced();
        return recordsToBeSynced.done((function(_this) {
          return function(count) {
            switch (count) {
              case 0:
                $('#totalRecordsToBeSynced').text('Data already upto date');
                $('#last5uploads').css("display", "none");
                $('#upSync1').css("display", "none");
                return $('#lastSyncUploadDetails').css("display", "none");
              default:
                $('#totalRecordsToBeSynced').text(count + ' record(s) to be synced');
                $('#last5uploads').css("display", "none");
                $('#upSync1').css("display", "block");
                return _this.updateLastSyncUploadDetails();
            }
          };
        })(this));
      };

      AppSyncView.prototype.startSyncProcess = function() {
        if (_.isOnline()) {
          return App.navigate('sync3', {
            trigger: true
          });
        } else {
          return $('#NetwrkCnctnDwnld').css("display", "block");
        }
      };

      AppSyncView.prototype.gotoSync3View = function() {
        if (_.isOnline()) {
          return App.navigate('sync3', {
            trigger: true
          });
        } else {
          return $('#networkConnectionUpload').css("display", "block");
        }
      };

      AppSyncView.prototype.updateLastSyncUploadDetails = function() {
        var lastSyncTimeStamp;
        $('#lastSyncUploadDetails').css("display", "block");
        lastSyncTimeStamp = _.getLastSyncTimeStamp('file_upload');
        return lastSyncTimeStamp.done(function(time_stamp) {
          if (time_stamp === '') {
            $('#syncDateUpload').text('-/-/-');
            return $('#syncTimeUpload').text('-:-');
          }
        });
      };

      return AppSyncView;

    })(Marionette.ItemView);
  });
});