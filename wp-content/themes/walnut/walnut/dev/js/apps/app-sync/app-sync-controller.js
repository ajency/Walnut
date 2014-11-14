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
      var lastSyncOperation, value;
      value = _.getStorageOption();
      lastSyncOperation = _.getLastSyncOperation();
      return lastSyncOperation.done(function(typeOfOperation) {
        var option;
        switch (typeOfOperation) {
          case 'none':
            if (!_.isNull(value)) {
              option = JSON.parse(value);
              if (option.external) {
                return _.cordovaCheckIfPathExists(option.external).then(function(pathExists) {
                  if (!pathExists) {
                    $('#storageOption').prop("disabled", false);
                    $('#syncStartContinue').prop("disabled", true);
                    return $('#syncMediaStart').prop("disabled", true);
                  } else {
                    $('#storageOption').prop("disabled", false);
                    $('#syncButtonText').text('Start');
                    return $('#syncMediaStart').prop("disabled", true);
                  }
                });
              } else if (option.internal) {
                $('#syncButtonText').text('Start');
                return $('#syncMediaStart').prop("disabled", true);
              }
            } else {
              $('#storageOption').prop("disabled", false);
              $('#syncStartContinue').prop("disabled", true);
              return $('#syncMediaStart').prop("disabled", true);
            }
            break;
          case 'file_import':
            $('#syncButtonText').text('Start');
            if (!_.isNull(value)) {
              option = JSON.parse(value);
              if (option.external) {
                return _.cordovaCheckIfPathExists(option.external).then(function(pathExists) {
                  if (!pathExists) {
                    $('#storageOption').prop("disabled", false);
                    $('#syncStartContinue').prop("disabled", true);
                    return $('#syncMediaStart').prop("disabled", true);
                  } else {
                    $('#storageOption').prop("disabled", false);
                    return $('#syncButtonText').text('Start');
                  }
                });
              } else if (option.internal) {
                return $('#syncButtonText').text('Start');
              }
            } else {
              $('#storageOption').prop("disabled", false);
              $('#syncStartContinue').prop("disabled", true);
              return $('#syncMediaStart').prop("disabled", true);
            }
            break;
          case 'file_download':
            $('#syncButtonText').text('Continue');
            $('#syncMediaStart').prop("disabled", true);
            return $('#storageOption').prop("disabled", true);
          case 'file_generate':
            $('#syncButtonText').text('Continue');
            $('#syncMediaStart').prop("disabled", true);
            return $('#storageOption').prop("disabled", true);
          case 'file_upload':
            $('#syncButtonText').text('Continue');
            $('#syncMediaStart').prop("disabled", true);
            return $('#storageOption').prop("disabled", true);
        }
      });
    };

    SynchronizationController.prototype.startContinueDataSyncProcess = function() {
      $('#storageOption').prop("disabled", true);
      $('#totalRecords').css("display", "none");
      $('#lastDownload').css("display", "none");
      $('#syncError').css("display", "none");
      $('#syncMediaStart').prop("disabled", true);
      return _.createSynapseDataDirectory().done(function() {
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
                  return _.startFileImport();
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
      $('#storageOption').prop("disabled", true);
      $('#syncStartContinue').prop("disabled", true);
      $('#syncMediaError').css("display", "none");
      $('#syncMediaStart').css("display", "none");
      $('#syncMediaSuccess').css("display", "block").text("Started media sync...");
      return _.createDirectoriesForMediaSync().done(function() {
        return setTimeout((function(_this) {
          return function() {
            return _.startMediaSync();
          };
        })(this), 2000);
      });
    };

    return SynchronizationController;

  })(Marionette.Controller);
  return App.reqres.setHandler("get:sync:controller", function() {
    return new SynchronizationController;
  });
});
