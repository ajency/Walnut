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
        App.commands.setHandler("close:sync1:view", (function(_this) {
          return function() {
            return _this.view.close();
          };
        })(this));
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
        'click #JsonToCSV': 'startConversion',
        'click #syncNow': 'startSyncProcess',
        'click #CSVupload': 'fileUpload',
        'click #last5downloads': 'showlast5downloads'
      };

      AppSyncView.prototype.onShow = function() {
        var syncDetailsCount;
        App.breadcrumbRegion.close();
        navigator.splashscreen.hide();
        syncDetailsCount = _.getTotalSyncDetailsCount();
        return syncDetailsCount.done(function(count) {
          var syncController;
          if (count === 0) {
            $('#syncDateDwnld').text("--/--/--");
            $('#syncTimeDwnld').text("--:--");
            $('#syncDateUpld').text("--/--/--");
            $('#syncTimeUpld').text("--:--");
            $('#last5dwnlds').attr("disabled", "disabled");
            $("#UploadView *").attr("disabled", "disabled").off('click');
          } else {
            App.navigate('teachers/dashboard', {
              trigger: true
            });
          }
          syncController = App.request("get:sync:controller");
          return syncController.totalRecordsUpdate();
        });
      };

      AppSyncView.prototype.fileUpload = function() {
        var syncController;
        syncController = App.request("get:sync:controller");
        return syncController.getuploadURL();
      };

      AppSyncView.prototype.startConversion = function() {};

      AppSyncView.prototype.startSyncProcess = function() {
        if (_.isOnline()) {
          return App.navigate('sync3', {
            trigger: true
          });
        } else {
          return $('#NetwrkCnctnDwnld').css("display", "block");
        }
      };

      AppSyncView.prototype.showlast5downloads = function() {
        return App.navigate('sync2', {
          trigger: true
        });
      };

      return AppSyncView;

    })(Marionette.ItemView);
  });
});
