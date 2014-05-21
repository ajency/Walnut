var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "app", "underscore", "csvparse", "json2csvparse"], function(Marionette, App, _, parse, ConvertToCSV) {
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
      var valuesAll, valuesAll1, valuesAll2;
      valuesAll = "";
      valuesAll1 = "";
      valuesAll2 = "";
      return _.db.transaction(function(tx) {
        alert("SELECT");
        tx.executeSql("SELECT * FROM wp_training_logs WHERE sync=0 ", [], function(tx, results) {
          valuesAll = results.rows.length;
          return console.log(valuesAll);
        }, _.transactionErrorhandler);
        tx.executeSql("SELECT * FROM wp_question_response WHERE sync=0 ", [], function(tx, results) {
          valuesAll1 = results.rows.length;
          return console.log(valuesAll1);
        }, _.transactionErrorhandler);
        return tx.executeSql("SELECT * FROM wp_question_response_logs WHERE sync=0 ", [], function(tx, results) {
          var VALUESGT;
          valuesAll2 = results.rows.length;
          console.log(valuesAll2);
          VALUESGT = valuesAll + valuesAll1 + valuesAll2;
          return $('#SyncRecords').text(VALUESGT);
        }, _.transactionErrorhandler);
      });
    };

    SynchronizationController.prototype.Conversion = function() {
      var valuesAll, valuesAll1, valuesAll2;
      valuesAll = "";
      valuesAll1 = "";
      valuesAll2 = "";
      return _.db.transaction(function(tx) {
        alert("SELECT 4 Conversion");
        tx.executeSql("SELECT * FROM wp_training_logs WHERE sync=0 ", [], function(tx, results) {
          var data, data1, data2, data3, data4, data5, i, row, training_data, _results;
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
              data1 = row.division_id;
              data2 = row.collection_id;
              data3 = row.teacher_id;
              data4 = row.date;
              data5 = row.status;
              console.log(data);
              console.log(data1);
              console.log(data2);
              console.log(data3);
              console.log(data4);
              console.log(data5);
              console.log(i);
              training_data = '{ "id": "' + row.id + '","division_id":"' + row.division_id + '", "collection_id": "' + row.collection_id + '", "teacher_id": "' + row.teacher_id + '", "date":"' + row.date + '", "status":"' + row.status + '"}';
              console.log("1st data is :" + training_data);
              _results.push(i++);
            }
            return _results;
          }
        }, _.transactionErrorhandler);
        tx.executeSql("SELECT * FROM wp_question_response WHERE sync=0 ", [], function(tx, results) {
          var data, data1, data2, data3, data4, data5, data6, data7, data8, data9, i, quest_resp_data, row, _results;
          valuesAll1 = results.rows.length;
          console.log(valuesAll1);
          if (valuesAll === 0) {
            return console.log("No user found");
          } else {
            i = 0;
            _results = [];
            while (i < valuesAll) {
              row = results.rows.item(i);
              data = row.ref_id;
              data1 = row.content_piece_id;
              data2 = row.collection_id;
              data3 = row.division;
              data4 = row.question_response;
              data5 = row.time_taken;
              data6 = row.start_date;
              data7 = row.end_date;
              data8 = row.status;
              data9 = row.sync;
              console.log(data);
              console.log(data1);
              console.log(data2);
              console.log(data3);
              console.log(data4);
              console.log(data5);
              console.log(data6);
              console.log(data7);
              console.log(data8);
              console.log(data9);
              console.log(i);
              quest_resp_data = '{ "grp_name": "' + row.ref_id + '","grp_des":"' + row.content_piece_id + '", "grp_recuring": "' + row.collection_id + '", "grp_type": "' + row.division + '", "grp_currency":"' + row.question_response + '", "grp_chat":"' + row.time_taken + '","grp_chat":"' + row.start_date + '""grp_chat":"' + row.end_date + '""grp_chat":"' + row.status + '""grp_chat":"' + row.sync + '"}';
              console.log("2n Data is " + quest_resp_data);
              _results.push(i++);
            }
            return _results;
          }
        }, _.transactionErrorhandler);
        return tx.executeSql("SELECT * FROM wp_question_response_logs WHERE sync=0 ", [], function(tx, results) {
          var AllData, CSVdata, data, data1, data2, fullGrp, i, items, quesn_rep_logs, row;
          valuesAll2 = results.rows.length;
          console.log(valuesAll2);
          if (valuesAll === 0) {
            console.log("No user found");
            items = [
              {
                name: "Item 1",
                color: "Green",
                size: "X-Large"
              }, {
                name: "Item 2",
                color: "Green",
                size: "X-Large"
              }, {
                name: "Item 3",
                color: "Green",
                size: "X-Large"
              }
            ];
            fullGrp = JSON.stringify(items);
            console.log("Ful Data is " + fullGrp);
            CSVdata = this.ConvertToCSV(fullGrp);
            console.log("CSV data is" + CSVdata);
            alert("hello");
            return this.WriteToFile(CSVdata);
          } else {
            i = 0;
            while (i < valuesAll) {
              row = results.rows.item(i);
              data = row.qr_ref_id;
              data1 = row.start_time;
              data2 = row.sync;
              console.log(data);
              console.log(data1);
              console.log(data2);
              console.log(i);
              quesn_rep_logs = '{ "id": "' + row.qr_ref_id + '","collection_id": "' + row.start_time + '", "teacher_id": "' + row.sync + '"}';
              console.log("3rd data is " + quesn_rep_logs);
              i++;
            }
            AllData = {
              "group": {
                "training_data": training_data,
                "quest_resp_data": quest_resp_data,
                "quesn_rep_logs": quesn_rep_logs
              }
            };
            fullGrp = '&data=' + JSON.stringify(AllData);
            alert(fullGrp);
            console.log("Ful Data is " + fullGrp);
            CSVdata = ConvertToCSV(fullGrp);
            return console.log("CSV data is" + CSVdata);
          }
        }, _.transactionErrorhandler);
      });
    };

    SynchronizationController.prototype.WriteToFile = function(CSVdata) {
      alert("CSVdata is " + CSVdata);
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile("csvread.txt", {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            return fileEntry.createWriter(function(gotFileWriter) {
              return writer.write("some sample text" + CSVdata);
            }, _.fileErrorHandler);
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
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

    App.reqres.setHandler("get:sync:controller", function() {
      return new SynchronizationController;
    });

    return SynchronizationController;

  })(Marionette.Controller);
});
