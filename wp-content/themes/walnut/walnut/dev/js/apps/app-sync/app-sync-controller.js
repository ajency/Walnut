var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "app", "underscore", "csvparse", "archive", "json2csvparse", "Zip", "zipchk", "FileSaver"], function(Marionette, App, _, parse, getEntries) {
  var SynchronizationController;
  SynchronizationController = (function(_super) {
    __extends(SynchronizationController, _super);

    function SynchronizationController() {
      this.fileUnZip = __bind(this.fileUnZip, this);
      this.ZipFile = __bind(this.ZipFile, this);
      return SynchronizationController.__super__.constructor.apply(this, arguments);
    }

    SynchronizationController.prototype.initialize = function() {};

    SynchronizationController.prototype.startSync = function() {
      return this.Sync();
    };

    SynchronizationController.prototype.totalRecordsUpdate = function() {
      return _.db.transaction(function(tx) {
        return tx.executeSql("SELECT SUM(rows) AS total FROM (SELECT COUNT(*) AS rows FROM wp_training_logs WHERE sync=? UNION ALL SELECT COUNT(*) AS rows FROM wp_question_response WHERE sync=? UNION ALL SELECT COUNT(*) AS rows FROM wp_question_response_logs WHERE sync=?)", [0, 0, 0], function(tx, data) {
          return $('#SyncRecords').text(data.rows.item(0)['total']);
        }, _.transactionErrorhandler);
      }, _.transactionErrorhandler, function(tx) {
        return console.log('Fetched total records having sync flag=0');
      });
    };

    SynchronizationController.prototype.selectRecords = function() {
      var valuesAll, valuesAll1, valuesAll2;
      valuesAll = "";
      valuesAll1 = "";
      valuesAll2 = "";
      return _.db.transaction((function(_this) {
        return function(tx) {
          tx.executeSql("SELECT * FROM wp_training_logs WHERE sync=0 ", [], function(tx, results) {
            var data, i, row, training_data, _results;
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
                training_data = '{ "id": "' + row.id + '","division_id":"' + row.division_id + '", "collection_id": "' + row.collection_id + '", "teacher_id": "' + row.teacher_id + '", "date":"' + row.date + '", "status":"' + row.status + '"}';
                console.log("1st data is :" + training_data);
                _results.push(i++);
              }
              return _results;
            }
          }, _.transactionErrorhandler);
          tx.executeSql("SELECT * FROM wp_question_response WHERE sync=0 ", [], function(tx, results) {
            var i, quest_resp_data, row, _results;
            valuesAll1 = results.rows.length;
            console.log(valuesAll1);
            if (valuesAll === 0) {
              return console.log("No user found");
            } else {
              i = 0;
              _results = [];
              while (i < valuesAll) {
                row = results.rows.item(i);
                quest_resp_data = '{ "grp_name": "' + row.ref_id + '","grp_des":"' + row.content_piece_id + '", "grp_recuring": "' + row.collection_id + '", "grp_type": "' + row.division + '", "grp_currency":"' + row.question_response + '", "grp_chat":"' + row.time_taken + '","grp_chat":"' + row.start_date + '""grp_chat":"' + row.end_date + '""grp_chat":"' + row.status + '""grp_chat":"' + row.sync + '"}';
                console.log("2n Data is " + quest_resp_data);
                _results.push(i++);
              }
              return _results;
            }
          }, _.transactionErrorhandler);
          return tx.executeSql("SELECT * FROM wp_question_response_logs WHERE sync=0 ", [], function(tx, results) {
            var AllData, CSVdata, fullGrp, i, items, quesn_rep_logs, row;
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
              AllData = {
                "group": {
                  "training_data": items,
                  "quest_resp_data": items,
                  "quesn_rep_logs": items
                }
              };
              fullGrp = JSON.stringify(items);
              console.log("Ful Data is " + fullGrp);
              CSVdata = ConvertToCSV(fullGrp);
              console.log("CSV data is" + CSVdata);
              return _this.writeToFile(CSVdata);
            } else {
              i = 0;
              while (i < valuesAll) {
                row = results.rows.item(i);
                quesn_rep_logs = '{ "id": "' + row.qr_ref_id + '","collection_id": "' + row.start_time + '", "teacher_id": "' + row.sync + '"}';
                console.log("3rd data is " + quesn_rep_logs);
                i++;
              }
              AllData = training_data + quest_resp_data + quesn_rep_logs;
              AllData = {
                "group": {
                  "training_data": training_data,
                  "quest_resp_data": quest_resp_data,
                  "quesn_rep_logs": quesn_rep_logs
                }
              };
              fullGrp = JSON.stringify(AllData);
              alert(fullGrp);
              console.log("Ful Data is " + fullGrp);
              CSVdata = ConvertToCSV(fullGrp);
              console.log("CSV data is" + CSVdata);
              return _this.writeToFile(CSVdata);
            }
          }, _.transactionErrorhandler);
        };
      })(this), _.transactionErrorhandler, function(tx) {
        return console.log('Main transaction');
      });
    };

    SynchronizationController.prototype.writeToFile = function(CSVdata) {
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile("csvread.txt", {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            return fileEntry.createWriter(function(writer) {
              alert("file entry is" + fileEntry.toURL());
              console.log("file entry is" + fileEntry.toURL());
              writer.write(CSVdata);
              $('#JsonToCSV').attr("disabled", "disabled");
              $('#CSVupload').removeAttr("disabled");
              return _this.fileRead();
            }, _.fileTransferErrorHandler);
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
    };

    SynchronizationController.prototype.fileRead = function() {
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile("csvread.txt", {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            return fileEntry.file(function(file) {
              var reader;
              reader = new FileReader();
              reader.onloadend = function(evt) {
                var csvData;
                alert("result" + evt.target.result);
                csvData = evt.target.result;
                console.log("result" + evt.target.result);
                return _this.ZipFile(csvData);
              };
              return reader.readAsText(file);
            }, _.fileErrorHandler);
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
    };

    SynchronizationController.prototype.updateSync = function() {
      _.db.transaction(function(tx) {
        var i, row, _i, _ref, _results;
        alert("insert id " + results.insertId);
        _results = [];
        for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
          row = data[i];
          _results.push(tx.executeSql("UPDATE wp_training_logs SET (sync) VALUES (?)", [1]));
        }
        return _results;
      }, _.transactionErrorhandler, function(tx) {
        return console.log('Data updated successfully');
      });
      _.db.transaction(function(tx) {
        var i, row, _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
          row = data[i];
          _results.push(tx.executeSql("UPDATE wp_question_response SET (sync) VALUES (?)", [1]));
        }
        return _results;
      }, _.transactionErrorhandler, function(tx) {
        return console.log('Data updated successfully');
      });
      return _.db.transaction(function(tx) {
        var i, row, _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
          row = data[i];
          _results.push(tx.executeSql("UPDATE wp_question_response_logs SET (sync) VALUES (?)", [1]));
        }
        return _results;
      }, _.transactionErrorhandler, function(tx) {
        return console.log('Data updated successfully');
      });
    };

    SynchronizationController.prototype.ZipFile = function(csvData) {
      var content, zip;
      zip = new JSZip();
      zip.file("csvread.txt", csvData);
      content = zip.generate({
        type: "text/plain"
      });
      return this.saveZipData(content);
    };

    SynchronizationController.prototype.saveZipData = function(content) {
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile("hello.zip", {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            return fileEntry.createWriter(function(writer) {
              alert("file entry is" + fileEntry.toURL());
              console.log("file entry is" + fileEntry.toURL());
              writer.write(content);
              return _this.fileReadZip();
            }, _.fileTransferErrorHandler);
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
    };

    SynchronizationController.prototype.fileReadZip = function() {
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile("hello.zip", null, function(fileEntry) {
            return fileEntry.file(function(file) {
              var reader;
              reader = new FileReader();
              reader.onloadend = function(evt) {
                var csvData;
                alert("result" + evt.target.result);
                csvData = evt.target.result;
                console.log("result" + evt.target.result);
                return _this.fileUpload(fileEntry);
              };
              return reader.readAsText(file);
            }, _.fileErrorHandler);
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
    };

    SynchronizationController.prototype.dwnldUnZip = function() {
      var dwnldFileName, url;
      dwnldFileName = "logs.zip";
      url = encodeURI("http://synapsedu.info/wp-content/uploads/sites/3/tmp/csvs-1150220140526102131.zip");
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile(dwnldFileName, {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            alert("file is " + fileEntry.toURL());
            fileEntry = fileEntry.toURL();
            return _this.fileUnZip(url, fileEntry);
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
    };

    SynchronizationController.prototype.fileUnZip = function(url, filename) {
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fs) {
          var fileTransfer, zipPath;
          zipPath = filename;
          fileTransfer = new FileTransfer();
          return fileTransfer.download(url, zipPath, function(entry) {
            var fullpath, loader;
            console.log(entry.toURL() + "  Hello!");
            fullpath = entry.toURL();
            loader = new ZipLoader(fullpath);
            alert("loader" + fullpath);
            return $.each(loader.getEntries(fullpath), function(i, entry) {
              return console.log("Name: " + entry.name() + " Size: " + entry.size() + " is Directory: " + entry.isDirectory());
            });
          }, _.fileTransferErrorHandler);
        };
      })(this), _.fileErrorHandler);
    };

    SynchronizationController.prototype.fileUpload = function(fileEntry) {
      var ft, options, params;
      options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = fileEntry.substr(fileEntry.lastIndexOf('/') + 1);
      options.mimeType = "text/csv;";
      params = {};
      params.value1 = "test";
      params.value2 = "param";
      options.params = params;
      ft = new FileTransfer();
      return ft.upload(fileEntry, encodeURI("http://some.server.com/upload.php"), function(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        return console.log("Sent = " + r.bytesSent);
      }, function(error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        return console.log("upload error target " + error.target);
      }, options);
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
              _results.push(_this.downlaodFiles(files[i], fileEntry));
            }
            return _results;
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
    };

    SynchronizationController.prototype.downlaodFiles = function(files, fileEntry) {
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
        return this.sendParsedData(parsedData.results);
      };
      return reader.readAsText(file);
    };

    SynchronizationController.prototype.sendParsedData = function(data) {
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
