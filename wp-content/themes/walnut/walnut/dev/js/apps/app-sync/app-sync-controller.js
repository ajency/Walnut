var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "app", "underscore", "csvparse"], function(Marionette, App, _, parse) {
  var SynchronizationController;
  SynchronizationController = (function(_super) {
    __extends(SynchronizationController, _super);

    function SynchronizationController() {
      return SynchronizationController.__super__.constructor.apply(this, arguments);
    }

    SynchronizationController.prototype.initialize = function() {
      this.displayTotalRecordsToBeSynced();
      this.displayLastDownloadTimeStamp();
      return this.changeSyncButtonTextBasedOnLastSyncOperation();
    };

    SynchronizationController.prototype.displayTotalRecordsToBeSynced = function() {
      var totalRecordsTobeSynced;
      totalRecordsTobeSynced = _.getTotalRecordsTobeSynced();
      return totalRecordsTobeSynced.done(function(totalRecords) {
        if (totalRecords === 0) {
          return $('#totalRecordsToBeSynced').text("Data already upto date");
        } else {
          return $('#totalRecordsToBeSynced').text("" + totalRecords + " record(s) to be synced");
        }
      });
    };

    SynchronizationController.prototype.displayLastDownloadTimeStamp = function() {
      var lastSyncOperation;
      lastSyncOperation = _.getLastSyncOperation();
      return lastSyncOperation.done(function(typeOfOperation) {
        var lastDownloadTimeStamp;
        if (typeOfOperation === 'file_import') {
          lastDownloadTimeStamp = _.getLastDownloadTimeStamp();
          return lastDownloadTimeStamp.done(function(time_stamp) {
            var escaped;
            escaped = $('<div>').text("Last synced \n" + time_stamp + "").text();
            return $('#lastDownloadTimeStamp').html(escaped.replace(/\n/g, '<br />'));
          });
        } else {
          $('#totalRecords').css("display", "none");
          return $('#lastDownload').css("display", "none");
        }
      });
    };

    SynchronizationController.prototype.changeSyncButtonTextBasedOnLastSyncOperation = function() {
      var lastSyncOperation;
      lastSyncOperation = _.getLastSyncOperation();
      return lastSyncOperation.done(function(typeOfOperation) {
        switch (typeOfOperation) {
          case 'none':
            return $('#syncButtonText').text('Start');
          case 'file_import':
            return $('#syncButtonText').text('Start');
          case 'file_download':
            return $('#syncButtonText').text('Continue');
          case 'file_generate':
            $('#syncButtonText').text('Continue');
            return $('#syncMediaStart').prop("disabled", true);
          case 'file_upload':
            $('#syncButtonText').text('Continue');
            return $('#syncMediaStart').prop("disabled", true);
        }
      });
    };

    SynchronizationController.prototype.startContinueDataSyncProcess = function() {
      var synapseDataDirectory;
      $('#totalRecords').css("display", "none");
      $('#lastDownload').css("display", "none");
      $('#syncError').css("display", "none");
      synapseDataDirectory = _.createSynapseDataDirectory();
      return synapseDataDirectory.done(function() {
        var lastSyncOperation;
        lastSyncOperation = _.getLastSyncOperation();
        return lastSyncOperation.done(function(typeOfOperation) {
          switch (typeOfOperation) {
            case 'none':
              $('#syncStartContinue').css("display", "none");
              $('#syncSuccess').css("display", "block").text("Started data sync...");
              return setTimeout((function(_this) {
                return function() {
                  return _.getZipFileDownloadDetails();
                };
              })(this), 2000);
            case 'file_import':
              $('#syncStartContinue').css("display", "none");
              $('#syncSuccess').css("display", "block").text("Started data sync...");
              return setTimeout((function(_this) {
                return function() {
                  return _.generateZipFile();
                };
              })(this), 2000);
            case 'file_download':
              $('#syncStartContinue').css("display", "none");
              $('#syncSuccess').css("display", "block").text("Resuming data sync...");
              return setTimeout((function(_this) {
                return function() {
                  return App.navigate('students/dashboard', {
                    trigger: true
                  });
                };
              })(this), 2000);
            case 'file_generate':
              $('#syncStartContinue').css("display", "none");
              $('#syncSuccess').css("display", "block").text("Resuming data sync...");
              return setTimeout((function(_this) {
                return function() {
                  return _.uploadGeneratedZipFile();
                };
              })(this), 2000);
            case 'file_upload':
              $('#syncStartContinue').css("display", "none");
              $('#syncSuccess').css("display", "block").text("Resuming data sync...");
              return setTimeout((function(_this) {
                return function() {
                  return _.checkIfServerImportOperationCompleted();
                };
              })(this), 2000);
          }
        });
      });
    };

    SynchronizationController.prototype.startMediaSyncProcess = function() {
      $('#syncStartContinue').prop("disabled", true);
      $('#syncMediaError').css("display", "none");
      $('#syncMediaStart').css("display", "none");
      $('#syncMediaSuccess').css("display", "block").text("Started media sync...");
      return setTimeout((function(_this) {
        return function() {
          return _.startMediaSync();
        };
      })(this), 2000);
    };

    return SynchronizationController;

  })(Marionette.Controller);
  return App.reqres.setHandler("get:sync:controller", function() {
    return new SynchronizationController;
  });
});
