var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "app", "underscore", "csvparse"], function(Marionette, App, _, parse) {
  var SynchronizationController;
  SynchronizationController = (function(_super) {
    __extends(SynchronizationController, _super);

    function SynchronizationController() {
      return SynchronizationController.__super__.constructor.apply(this, arguments);
    }

    SynchronizationController.prototype.initialize = function() {};

    SynchronizationController.prototype.startSync = function() {
      return this.Sync();
    };

    SynchronizationController.prototype.TotalRecordsUpdate = function() {
      return _.db.transaction(function(tx) {
        return tx.executeSql("SELECT SUM(rows) AS total FROM ( SELECT COUNT(*) AS rows FROM wp_training_logs WHERE sync=? UNION ALL SELECT COUNT(*) AS rows FROM wp_question_response WHERE sync=? UNION ALL SELECT COUNT(*) AS rows FROM wp_question_response_logs WHERE sync=?)", [0, 0, 0], function(tx, data) {
          var total;
          total = data.rows.item(0)['total'];
          return $('#SyncRecords').text(total);
        }, _.transactionErrorhandler);
      }, _.transactionErrorhandler, function(tx) {
        return console.log('Fetched all records where sync=0');
      });
    };

    SynchronizationController.prototype.Sync = function() {
      var currData, files;
      files = ["http://synapsedu.info/wp_35_training_logs.csv", "http://synapsedu.info/wp_35_question_response.csv", "http://synapsedu.info/wp_35_question_response_logs.csv"];
      currData = 0;
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile("StudentsLogs.csv", {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            var currentFileIndex, filePath1, i, _i, _ref, _results;
            filePath1 = ["/WpTrainingLogs.csv", "/wp_35_question_response.csv", "/wp_35_question_response_logs.csv"];
            _results = [];
            for (i = _i = 0, _ref = files.length - 1; _i <= _ref; i = _i += 1) {
              currentFileIndex = i;
              alert("val" + i);
              alert("new file is" + filePath1[i]);
              alert("file is " + fileEntry.toURL());
              fileEntry = fileUrl + filePath1[i];
              alert("file entry" + fileEntry);
              console.log("initiate download of file index " + i + " File Name: " + files[i]);
              _results.push(_this.DownlaodFiles(files[i], fileEntry));
            }
            return _results;
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
    };

    SynchronizationController.prototype.DownlaodFiles = function(files, fileEntry) {
      var filePath, fileTransfer, uri;
      fileTransfer = new FileTransfer();
      uri = files;
      filePath = fileEntry;
      alert(filePath);
      return fileTransfer.download(uri, filePath, (function(_this) {
        return function(file) {
          console.log('File downloaded' + file);
          return _this.readAsText(file);
        };
      })(this), _.fileTransferErrorHandler, true);
    };

    SynchronizationController.prototype.readAsText = function(file) {
      var reader;
      console.log("read files" + file.toURL());
      reader = new FileReader();
      reader.onloadend = function(evt) {
        var csvString, parsedData;
        alert("result" + evt.target.result);
        alert("csvString" + csvString);
        csvString = evt.target.result;
        parsedData = $.parse(csvString, {
          header: false,
          dynamicTyping: false
        });
        console.log("result is " + parsedData.results);
        return this.SendParsedData(parsedData.results);
      };
      return reader.readAsText(file);
    };

    SynchronizationController.prototype.SendParsedData = function(data) {
      _.db.transaction(function(tx) {
        var i, row, _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
          row = data[i];
          _results.push(tx.executeSql("INSERT INTO wp_training_logs (division_id, collection_id, teacher_id, date, status, sync) VALUES (?, ?, ?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], 1]));
        }
        return _results;
      }, _.transactionErrorhandler, function(tx) {
        return console.log('Data inserted successfully');
      });
      _.db.transaction(function(tx) {
        var i, row, _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
          row = data[i];
          _results.push(tx.executeSql("INSERT INTO wp_question_response (ref_id,content_piece_id,collection_id,division,question_response,time_taken,start_date,end_date,status,sync) VALUES (?, ?, ?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], 1]));
        }
        return _results;
      }, _.transactionErrorhandler, function(tx) {
        return console.log('Data inserted successfully');
      });
      return _.db.transaction(function(tx) {
        var i, row, _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
          row = data[i];
          _results.push(tx.executeSql("INSERT INTO wp_question_response_logs (qr_ref_id, start_time, sync) VALUES (?, ?, ?, ?, ?, ?)", [data[i][1], data[i][2], 1]));
        }
        return _results;
      }, _.transactionErrorhandler, function(tx) {
        return console.log('Data inserted successfully');
      });
    };

    SynchronizationController.readValues;

    SynchronizationController.prototype.readValues = function() {
      return window.db.transaction(function(transaction) {
        alert("SELECT");
        return transaction.executeSql("SELECT * FROM wp_training_logs ", [], function(transaction, results) {
          var data, data1, data2, data3, data4, data5, i, row, valuesAll, _results;
          valuesAll = results.rows.length;
          console.log(valuesAll);
          if (valuesAll === 0) {
            return console.log("No user found");
          } else {
            i = 0;
            _results = [];
            while (i < valuesAll) {
              row = results.rows.item(i);
              data = row.id;
              data1 = results.rows.item(i).division_id;
              data2 = results.rows.item(i).collection_id;
              data3 = results.rows.item(i).teacher_id;
              data4 = results.rows.item(i).date;
              data5 = results.rows.item(i).status;
              console.log(data);
              console.log(data1);
              console.log(data2);
              console.log(data3);
              console.log(data4);
              console.log(data5);
              console.log(i);
              _results.push(i++);
            }
            return _results;
          }
        }, _.transactionErrorhandler);
      });
    };

    return SynchronizationController;

  })(Marionette.Controller);
  return App.reqres.setHandler("get:sync:controller", function() {
    return new SynchronizationController;
  });
});
