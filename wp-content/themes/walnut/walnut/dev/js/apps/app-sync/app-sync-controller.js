var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "app", "underscore", "csvparse"], function(Marionette, App, _, parse) {
  var SynchronizationController;
  return SynchronizationController = (function(_super) {
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
        alert("SELECT");
        return tx.executeSql("SELECT * FROM wp_training_logs ", [], function(tx, results) {
          var valuesAll;
          valuesAll = results.rows.length;
          return console.log(valuesAll);
        }, _.transactionErrorhandler);
      });
    };

    SynchronizationController.prototype.Sync = function() {
      var files;
      files = ["http://synapsedu.info/wp_35_training_logs.csv", "http://synapsedu.info/wp_35_question_response.csv", "wp_35_question_response_logs.csv"];
      alert(files);
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile("StudentsLogs.txt", {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            var filePath, fileTransfer, uri;
            fileTransfer = new FileTransfer();
            uri = files;
            filePath = fileEntry.toURL();
            return fileTransfer.download(uri, filePath, function(file) {
              console.log('File downloaded');
              return _this.readAsText(file);
            }, _.fileTransferErrorHandler, true);
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
    };

    SynchronizationController.prototype.readAsText = function(file) {
      var currentFileIndex, i, reader, _i, _ref;
      for (i = _i = 0, _ref = file.length - 1; _i <= _ref; i = _i += 1) {
        currentFileIndex = i;
        console.log("initiate download of file index " + i + " File Name: " + files[i]);
        files[i];
      }
      console.log("read files");
      reader = new FileReader();
      reader.onloadend = function(evt) {
        var csvString, parsedData;
        csvString = evt.target.result;
        parsedData = $.parse(csvString, {
          header: false,
          dynamicTyping: false
        });
        return this.SendParsedData(parsedData.results);
      };
      return reader.readAsText(file);
    };

    SynchronizationController.prototype.SendParsedData = function(data) {
      return _.db.transaction(function(tx) {
        var i, row, _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
          row = data[i];
          _results.push(tx.executeSql("INSERT INTO wp_training_logs (division_id, collection_id, teacher_id, date, status, sync) VALUES (?, ?, ?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], 1]));
        }
        return _results;
      }, _.transactionErrorhandler, function(tx) {
        console.log('Data inserted successfully');
        return this.readValues;
      });
    };

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

    App.reqres.setHandler("get:sync:controller", function() {
      return new SynchronizationController;
    });

    return SynchronizationController;

  })(Marionette.Controller);
});
