define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    onDataSyncError: function(error, message) {
      if (error !== 'none') {
        console.log('ERROR: ' + error.code);
      }
      $('#syncSuccess').css("display", "none");
      $('#syncStartContinue').css("display", "block");
      $('#syncButtonText').text("Try again");
      return $('#syncError').css("display", "block").text("" + message);
    },
    onMediaSyncError: function(error, message) {
      if (error !== 'none') {
        console.log('ERROR: ' + error.code);
      }
      $('#syncMediaSuccess').css("display", "none");
      $('#syncMediaStart').css("display", "block");
      $('#syncMediaButtonText').text("Try again");
      return $('#syncMediaError').css("display", "block").text("" + message);
    },
    getLastSyncOperation: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT type_of_operation FROM sync_details WHERE user_id=? ORDER BY id DESC LIMIT 1", [_.getUserID()], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var last_operation;
          last_operation = 'none';
          if (data.rows.length !== 0) {
            last_operation = data.rows.item(0)['type_of_operation'];
          }
          return d.resolve(last_operation);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getLastSyncOperation transaction completed');
      }).fail(_.failureHandler);
    },
    hasUserPreviouslySynced: function() {
      var onSuccess, runQuery, synced;
      synced = false;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT id FROM sync_details WHERE user_id=?", [_.getUserID()], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          if (data.rows.length !== 0) {
            synced = true;
          }
          return d.resolve(synced);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('hasUserPreviouslySynced transaction completed');
      }).fail(_.failureHandler);
    },
    getTotalRecordsTobeSynced: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT SUM(rows) AS total FROM (SELECT COUNT(*) AS rows FROM " + _.getTblPrefix() + "quiz_question_response WHERE sync=? UNION ALL SELECT COUNT(*) AS rows FROM " + _.getTblPrefix() + "quiz_response_summary WHERE sync=?)", [0, 0], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var totalRecords;
          totalRecords = data.rows.item(0)['total'];
          return d.resolve(totalRecords);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getTotalRecordsTobeSynced transaction completed');
      }).fail(_.failureHandler);
    },
    getLastDownloadTimeStamp: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT time_stamp FROM sync_details WHERE type_of_operation=? AND user_id=? ORDER BY id DESC LIMIT 1", ['file_download', _.getUserID()], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var time_stamp;
          time_stamp = '';
          if (data.rows.length !== 0) {
            time_stamp = data.rows.item(0)['time_stamp'];
          }
          return d.resolve(time_stamp);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getLastDownloadTimeStamp transaction completed');
      }).fail(_.failureHandler);
    },
    updateSyncDetails: function(operation, time_stamp) {
      return _.db.transaction(function(tx) {
        return tx.executeSql("INSERT INTO sync_details (type_of_operation, time_stamp, user_id) VALUES (?,?,?)", [operation, time_stamp, _.getUserID()]);
      }, _.transactionErrorhandler, function(tx) {
        return console.log('Updated sync details for ' + operation);
      });
    },
    clearSynapseDataDirectory: function() {
      var filepath, option, value;
      value = _.getStorageOption();
      option = JSON.parse(value);
      if (option.internal) {
        filepath = option.internal;
      } else if (option.external) {
        filepath = option.external;
      }
      return window.resolveLocalFileSystemURL('file://' + filepath + '', function(fileSystem) {
        return fileSystem.getDirectory("SynapseAssets/SynapseData", {
          create: false,
          exclusive: false
        }, function(directoryEntry) {
          var reader;
          reader = directoryEntry.createReader();
          return reader.readEntries(function(entries) {
            var i, _i, _ref, _results;
            _results = [];
            for (i = _i = 0, _ref = entries.length - 1; _i <= _ref; i = _i += 1) {
              entries[i].remove();
              if (i === entries[i].length - 1) {
                _results.push(console.log("Deleted all files from 'SynapseData' directory"));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }, _.directoryErrorHandler);
        }, _.directoryErrorHandler);
      }, _.fileSystemErrorHandler);
    },
    getAvailableDeviceStorageSize: function() {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          return cordova.exec(function(freeSpace) {
            return d.resolve(freeSpace);
          }, function() {
            return console.log('DeviceStorageSize Failed');
          }, "File", "getFreeDiskSpace", []);
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('getDeviceAvailableStorageSize done');
      }).fail(_.failureHandler);
    },
    getTextbookIdsByClassID: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          var classID;
          classID = _.getClassIdForUser();
          return classID.done(function(class_id) {
            return _.db.transaction(function(tx) {
              var pattern;
              pattern = '%"' + class_id + '"%';
              return tx.executeSql("SELECT textbook_id FROM wp_textbook_relationships WHERE class_id LIKE '%" + pattern + "%'", [], onSuccess(d), _.deferredErrorHandler(d));
            });
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, textbook_ids, _i, _ref;
          textbook_ids = new Array();
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            textbook_ids[i] = data.rows.item(i)['textbook_id'];
          }
          return d.resolve(textbook_ids);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getTextbookIdsByClassID transaction completed');
      }).fail(_.failureHandler);
    }
  });
});
