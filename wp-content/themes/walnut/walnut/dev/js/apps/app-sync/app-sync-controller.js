var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "app", "underscore", "csvparse", "archive", "json2csvparse", "zip"], function(Marionette, App, _, parse, getEntries) {
  var SynchronizationController;
  SynchronizationController = (function(_super) {
    __extends(SynchronizationController, _super);

    function SynchronizationController() {
      this.sendParsedData14 = __bind(this.sendParsedData14, this);
      this.sendParsedData13 = __bind(this.sendParsedData13, this);
      this.sendParsedData12 = __bind(this.sendParsedData12, this);
      this.sendParsedData11 = __bind(this.sendParsedData11, this);
      this.sendParsedData10 = __bind(this.sendParsedData10, this);
      this.sendParsedData9 = __bind(this.sendParsedData9, this);
      this.sendParsedData8 = __bind(this.sendParsedData8, this);
      this.sendParsedData7 = __bind(this.sendParsedData7, this);
      this.sendParsedData6 = __bind(this.sendParsedData6, this);
      this.sendParsedData5 = __bind(this.sendParsedData5, this);
      this.sendParsedData4 = __bind(this.sendParsedData4, this);
      this.sendParsedData3 = __bind(this.sendParsedData3, this);
      this.sendParsedData15 = __bind(this.sendParsedData15, this);
      this.sendParsedData2 = __bind(this.sendParsedData2, this);
      this.sendParsedData1 = __bind(this.sendParsedData1, this);
      this.fileUpload = __bind(this.fileUpload, this);
      this.ZipFile = __bind(this.ZipFile, this);
      this.updateQuestRespnLogs = __bind(this.updateQuestRespnLogs, this);
      this.updateQuestRespn = __bind(this.updateQuestRespn, this);
      this.updateSync = __bind(this.updateSync, this);
      this.totalRecordsUpdate = __bind(this.totalRecordsUpdate, this);
      return SynchronizationController.__super__.constructor.apply(this, arguments);
    }

    SynchronizationController.prototype.initialize = function() {};

    SynchronizationController.prototype.startSync = function() {};

    SynchronizationController.prototype.totalRecordsUpdate = function() {
      return _.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("SELECT SUM(rows) AS total FROM (SELECT COUNT(*) AS rows FROM " + _.getTblPrefix() + "training_logs WHERE sync=? UNION ALL SELECT COUNT(*) AS rows FROM " + _.getTblPrefix() + "question_response WHERE sync=? UNION ALL SELECT COUNT(*) AS rows FROM " + _.getTblPrefix() + "question_response_logs WHERE sync=?)", [0, 0, 0], function(tx, data) {
            var totalRecords;
            totalRecords = data.rows.item(0)['total'];
            _.setTotalRecords(totalRecords);
            $('#SyncRecords').text(data.rows.item(0)['total']);
            return _this.chkTotalrecords(totalRecords);
          }, _.transactionErrorhandler);
        };
      })(this), _.transactionErrorhandler, (function(_this) {
        return function(tx) {
          return console.log('Fetched total records having sync flag=0');
        };
      })(this));
    };

    SynchronizationController.prototype.chkTotalrecords = function(total) {
      if (total === 0) {
        $('#JsonToCSV').attr("disabled", "disabled");
        $('#CSVupload').attr("disabled", "disabled");
        return $('#syncNow').removeAttr("disabled");
      } else {
        $('#JsonToCSV').removeAttr("disabled");
        $('#CSVupload').attr("disabled", "disabled");
        return $('#syncNow').attr("disabled", "disabled");
      }
    };

    SynchronizationController.prototype.selectRecords = function() {
      var valuesAll, valuesAll1, valuesAll2;
      valuesAll = "";
      valuesAll1 = "";
      valuesAll2 = "";
      return _.db.transaction((function(_this) {
        return function(tx) {
          tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "training_logs WHERE sync=0 ", [], function(tx, results) {
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
          tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "question_response WHERE sync=0 ", [], function(tx, results) {
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
                quest_resp_data = '{ "ref id": "' + row.ref_id + '","content id":"' + row.content_piece_id + '", "collection id": "' + row.collection_id + '", "division": "' + row.division + '", "question response":"' + row.question_response + '", "time taken":"' + row.time_taken + '","start date":"' + row.start_date + '""end date":"' + row.end_date + '""status":"' + row.status + '""sync":"' + row.sync + '"}';
                console.log("2n Data is " + quest_resp_data);
                _results.push(i++);
              }
              return _results;
            }
          }, _.transactionErrorhandler);
          return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "question_response_logs WHERE sync=0 ", [], function(tx, results) {
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
          return fileSystem.root.getFile("SynapseAssets/csvread.txt", {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            return fileEntry.createWriter(function(writer) {
              alert("file entry is" + fileEntry.toURL());
              console.log("file entry is" + fileEntry.toURL());
              writer.write(CSVdata);
              return _this.updateSync();
            }, _.fileTransferErrorHandler);
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
    };

    SynchronizationController.prototype.updateSync = function() {
      return _.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("UPDATE " + _.getTblPrefix() + "training_logs SET sync=1 WHERE sync=0");
        };
      })(this), _.transactionErrorhandler, (function(_this) {
        return function(tx) {
          console.log('Data updated successfully');
          return _this.updateQuestRespn();
        };
      })(this));
    };

    SynchronizationController.prototype.updateQuestRespn = function() {
      return _.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("UPDATE " + _.getTblPrefix() + "question_response SET sync=1 WHERE sync=0");
        };
      })(this), _.transactionErrorhandler, (function(_this) {
        return function(tx) {
          console.log('Data updated successfully');
          return _this.updateQuestRespnLogs();
        };
      })(this));
    };

    SynchronizationController.prototype.updateQuestRespnLogs = function() {
      return _.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("UPDATE " + _.getTblPrefix() + "question_response_logs SET sync=1 WHERE sync=0");
        };
      })(this), _.transactionErrorhandler, (function(_this) {
        return function(tx) {
          console.log('Data updated successfully');
          $('#SyncRecords').text(0);
          $('#JsonToCSV').attr("disabled", "disabled");
          $('#CSVupload').removeAttr("disabled");
          $('#syncNow').attr("disabled", "disabled");
          return _this.fileRead();
        };
      })(this));
    };

    SynchronizationController.prototype.fileRead = function() {
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile("SynapseAssets/csvread.txt", {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            return fileEntry.file(function(file) {
              var reader;
              reader = new FileReader();
              reader.onloadend = function(evt) {
                var csvData;
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

    SynchronizationController.prototype.ZipFile = function(csvData) {
      var content, zip;
      zip = new JSZip();
      zip.file("csvread.txt", csvData);
      content = zip.generate({
        type: "text/plain"
      });
      zip.file("csvread.txt").asText();
      return this.saveZipData(content);
    };

    SynchronizationController.prototype.saveZipData = function(content) {
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile("SynapseAssets/hello.zip", {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            return fileEntry.createWriter(function(writer) {
              alert("file entry is" + fileEntry.toURL());
              console.log("file entry is" + fileEntry.toURL());
              return writer.write(content);
            }, _.fileTransferErrorHandler);
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
    };

    SynchronizationController.prototype.fileReadZip = function() {
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile("SynapseAssets/hello.zip", null, function(fileEntry) {
            return fileEntry.file(function(file) {
              var reader;
              reader = new FileReader();
              reader.onloadend = function(evt) {
                var csvData;
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

    SynchronizationController.prototype.fileUpload = function(fileEntry) {
      var ft, options, params, uri;
      uri = encodeURI(_.getUploaduri());
      options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = fileEntry.substr(fileEntry.lastIndexOf('/') + 1);
      options.mimeType = "text/csv;";
      params = {};
      params.value1 = "test";
      params.value2 = "param";
      options.params = params;
      ft = new FileTransfer();
      return ft.upload(fileEntry, uri, (function(_this) {
        return function(r) {
          console.log("Code = " + r.responseCode);
          console.log("Response = " + r.response);
          console.log("Sent = " + r.bytesSent);
          return _this.chkForNewRecords;
        };
      })(this), function(error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        return console.log("upload error target " + error.target);
      }, options);
    };

    SynchronizationController.prototype.chkForNewRecords = function() {
      if (_.getTotalRecords() === null) {
        $('#JsonToCSV').attr("disabled", "disabled");
        $('#CSVupload').attr("disabled", "disabled");
        $('#syncNow').removeAttr("disabled");
        return this.updateUploadTime();
      } else {
        $('#JsonToCSV').removeAttr("disabled");
        $('#CSVupload').attr("disabled", "disabled");
        return $('#syncNow').attr("disabled", "disabled");
      }
    };

    SynchronizationController.prototype.updateUploadTime = function() {
      var timestamp;
      timestamp = _.getDwnldTimeStamp();
      if (_.getInitialSyncFlag() === null) {
        return _.db.transaction((function(_this) {
          return function(tx) {
            return tx.executeSql("INSERT INTO sync_details (type_of_operation, time_stamp) VALUES (?, ?)", [
              "UploadZip", {
                8: 36
              }
            ]);
          };
        })(this), _.transactionErrorhandler, (function(_this) {
          return function(tx) {
            console.log('Sync Data INSERTED successfully ');
            App.execute("close:sync:view");
            return _.setInitialSyncFlag('sync');
          };
        })(this));
      } else {
        return _.db.transaction(function(tx) {
          return tx.executeSql("UPDATE sync_details SET (type_of_operation,time_stamp) VALUES (?,?)", [
            "UploadZip", {
              8: 36
            }
          ]);
        }, _.transactionErrorhandler, function(tx) {
          console.log('Sync Data UPDATED successfully');
          App.execute("close:sync:view");
          return _.setInitialSyncFlag('sync');
        });
      }
    };

    SynchronizationController.prototype.dwnldUnZip = function() {
      var uri;
      uri = encodeURI(_.getDwnlduri());
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile("SynapseAssets/logs.zip", {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            var filePath, fileTransfer;
            filePath = fileEntry.toURL().replace("logs.zip", "");
            _.setFilePath(filePath);
            fileEntry.remove();
            fileTransfer = new FileTransfer();
            return fileTransfer.download(uri, filePath + "logs.zip", function(file) {
              console.log('Zip file downloaded');
              _this.updateDownloadTime();
              $('#getFiles').find('*').prop('disabled', true);
              $('#imprtFiles').find('*').prop('disabled', false);
              return _this.fileUnZip(filePath, file.toURL());
            }, _.fileTransferErrorHandler, true);
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
    };

    SynchronizationController.prototype.chkReader = function(file1) {
      var read;
      read = function() {
        return $.Deferred(function(d) {
          return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
            return function(fileSystem) {
              return fileSystem.root.getFile(file1, {
                create: false
              }, function(fileEntry) {
                return fileEntry.file(function(file) {
                  var reader;
                  console.log("is" + file);
                  reader = new FileReader();
                  reader.onloadend = function(evt) {
                    var csvString, parsedData;
                    csvString = evt.target.result;
                    parsedData = $.parse(csvString, {
                      header: false,
                      dynamicTyping: false
                    });
                    (function(parsedData) {
                      var i, j, _i, _ref, _results;
                      _results = [];
                      for (i = _i = 0, _ref = parsedData.results.length - 1; _i <= _ref; i = _i += 1) {
                        _results.push((function() {
                          var _j, _ref1, _results1;
                          _results1 = [];
                          for (j = _j = 0, _ref1 = parsedData.results[i].length - 1; _j <= _ref1; j = _j += 1) {
                            _results1.push(parsedData.results[i][j] = parsedData.results[i][j].replace(/\\/g, '"'));
                          }
                          return _results1;
                        })());
                      }
                      return _results;
                    })(parsedData);
                    return d.resolve(parsedData.results);
                  };
                  return reader.readAsText(file);
                }, _.fileErrorHandler);
              }, _.fileErrorHandler);
            };
          })(this), _.fileSystemErrorHandler);
        });
      };
      return $.when(read()).done(function() {
        return console.log('read done');
      }).fail(_.failureHandler);
    };

    SynchronizationController.prototype.fileUnZip = function(filePath, fullpath) {
      var success;
      filePath = filePath;
      fullpath = fullpath;
      console.log('Source: ' + fullpath);
      console.log('Destination: ' + filePath);
      success = (function(_this) {
        return function() {
          return console.log('Files unzipped');
        };
      })(this);
      return zip.unzip(fullpath, filePath, success);
    };

    SynchronizationController.prototype.readUnzipFile1 = function() {
      var file, filePath;
      filePath = _.getFilePath();
      file = "SynapseAssets/" + _.getTblPrefix() + "class_divisions.csv";
      return this.sendParsedData1(file, filePath);
    };

    SynchronizationController.prototype.sendParsedData1 = function(file, fileEntry) {
      var readData;
      fileEntry = fileEntry;
      readData = this.chkReader(file);
      return readData.done((function(_this) {
        return function(data) {
          console.log('Divisions parsed data');
          data;
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM " + _.getTblPrefix() + "class_divisions");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO " + _.getTblPrefix() + "class_divisions (id, division, class_id) VALUES (?, ?, ?)", [data[i][0], data[i][1], data[i][2]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file1;
            console.log('Data inserted successfully1');
            file1 = "SynapseAssets/" + _.getTblPrefix() + "question_response.csv";
            return _this.sendParsedData2(file1, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData2 = function(file1, fileEntry) {
      var readData;
      fileEntry = fileEntry;
      readData = this.chkReader(file1);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM " + _.getTblPrefix() + "question_response");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO " + _.getTblPrefix() + "question_response (content_piece_id, collection_id, division,question_response,time_taken,start_date,end_date,status,sync) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,?)", [data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], 1]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file14;
            console.log('Data inserted successfully2');
            file14 = "SynapseAssets/" + _.getTblPrefix() + "question_response_logs.csv";
            return _this.sendParsedData15(file14, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData15 = function(file14, fileEntry) {
      var readData;
      fileEntry = fileEntry;
      readData = this.chkReader(file14);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM " + _.getTblPrefix() + "question_response_logs");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO " + _.getTblPrefix() + "question_response_logs (start_time, sync) VALUES ( ?,?)", [data[i][1], 1]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file2;
            console.log('Data inserted successfully15');
            file2 = "SynapseAssets/" + _.getTblPrefix() + "training_logs.csv";
            return _this.sendParsedData3(file2, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData3 = function(file2, fileEntry) {
      var readData;
      readData = this.chkReader(file2);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM " + _.getTblPrefix() + "training_logs");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO " + _.getTblPrefix() + "training_logs (division_id, collection_id, teacher_id, date, status, sync) VALUES (?,?,?,?,?,?)", [data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], 1]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file3;
            console.log('Data inserted successfully3');
            file3 = "SynapseAssets/wp_collection_meta.csv";
            return _this.sendParsedData4(file3, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData4 = function(file3, fileEntry) {
      var readData;
      readData = this.chkReader(file3);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_collection_meta");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_collection_meta (id, collection_id, meta_key, meta_value) VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file4;
            console.log('Data inserted successfully4');
            file4 = "SynapseAssets/wp_content_collection.csv";
            return _this.sendParsedData5(file4, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData5 = function(file4, fileEntry) {
      var readData;
      readData = this.chkReader(file4);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_content_collection");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_content_collection (id, name, created_on, created_by, last_modified_on,last_modified_by,published_on,published_by, status,type, term_ids, duration) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], data[i][10], data[i][11]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file5;
            console.log('Data inserted successfully5');
            file5 = "SynapseAssets/wp_options.csv";
            return _this.sendParsedData6(file5, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData6 = function(file5, fileEntry) {
      var readData;
      readData = this.chkReader(file5);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_options");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_options (option_id, option_name, option_value, autoload) VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file6;
            console.log('Data inserted successfully6');
            file6 = "SynapseAssets/wp_postmeta.csv";
            return _this.sendParsedData7(file6, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData7 = function(file6, fileEntry) {
      var readData;
      readData = this.chkReader(file6);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_postmeta");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_postmeta (meta_id, post_id, meta_key,meta_value) VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file7;
            console.log('Data inserted successfully7');
            file7 = "SynapseAssets/wp_posts.csv";
            return _this.sendParsedData8(file7, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData8 = function(file7, fileEntry) {
      var readData;
      readData = this.chkReader(file7);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_posts");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_posts (ID,post_author,post_date,post_date_gmt,post_content,post_title,post_excerpt,post_status,comment_status,ping_status,post_password,post_name,to_ping,pinged,post_modified,post_modified_gmt,post_content_filtered,post_parent,guid,menu_order,post_type,post_mime_type,comment_count) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], data[i][10], data[i][11], data[i][12], data[i][13], data[i][14], data[i][15], data[i][16], data[i][17], data[i][18], data[i][19], data[i][20], data[i][21], data[i][22]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file8;
            console.log('Data inserted successfully8');
            file8 = "SynapseAssets/wp_term_relationships.csv";
            return _this.sendParsedData9(file8, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData9 = function(file8, fileEntry) {
      var readData;
      readData = this.chkReader(file8);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_term_relationships");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_term_relationships (object_id,term_taxonomy_id, term_order) VALUES (?, ?, ?)", [data[i][0], data[i][1], data[i][2]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file9;
            console.log('Data inserted successfully9');
            file9 = "SynapseAssets/wp_term_taxonomy.csv";
            return _this.sendParsedData10(file9, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData10 = function(file9, fileEntry) {
      var readData;
      readData = this.chkReader(file9);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_term_taxonomy");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_term_taxonomy (term_taxonomy_id, term_id, taxonomy, description, parent, count) VALUES (?, ?, ?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file10;
            console.log('Data inserted successfully10');
            file10 = "SynapseAssets/wp_terms.csv";
            return _this.sendParsedData11(file10, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData11 = function(file10, fileEntry) {
      var readData;
      readData = this.chkReader(file10);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_terms");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_terms (term_id, name, slug, term_group) VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file11;
            console.log('Data inserted successfully11');
            file11 = "SynapseAssets/wp_textbook_relationships.csv";
            return _this.sendParsedData12(file11, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData12 = function(file11, fileEntry) {
      var readData;
      readData = this.chkReader(file11);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_textbook_relationships");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_textbook_relationships (id, textbook_id, class_id, tags) VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file12;
            console.log('Data inserted successfully12');
            file12 = "SynapseAssets/wp_usermeta.csv";
            return _this.sendParsedData13(file12, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData13 = function(file12, fileEntry) {
      var readData;
      readData = this.chkReader(file12);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_usermeta");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file13;
            console.log('Data inserted successfully13');
            file13 = "SynapseAssets/wp_users.csv";
            return _this.sendParsedData14(file13, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData14 = function(file13, fileEntry) {
      var readData;
      readData = this.chkReader(file13);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_users");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_users (ID, user_login, user_pass, user_nicename,user_email,user_url,user_registered,user_activation_key, user_status,display_name, spam,deleted) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], data[i][10], data[i][11]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            console.log('Data inserted successfully14');
            $('#JsonToCSV').removeAttr("disabled");
            $('#CSVupload').attr("disabled", "disabled");
            $('#syncNow').attr("disabled", "disabled");
            return App.execute("close:sync3:view");
          });
        };
      })(this));
    };

    SynchronizationController.prototype.updateDownloadTime = function() {
      var timestamp;
      timestamp = _.getDwnldTimeStamp();
      return _.db.transaction(function(tx) {
        return tx.executeSql("INSERT INTO sync_details (type_of_operation, time_stamp) VALUES (?,?)", ['file_download', timestamp]);
      }, _.transactionErrorhandler, function(tx) {
        return console.log('Updated file download details');
      });
    };

    SynchronizationController.prototype.getLastTimeofDownSync = function() {
      return _.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("SELECT * FROM sync_details WHERE type_of_operation='DownZip' ORDER BY time_stamp DESC LIMIT 5 ", [], function(tx, results) {
            var stamp;
            return time(stamp = results);
          }, _.transactionErrorhandler);
        };
      })(this));
    };

    SynchronizationController.prototype.getLastTimeofUpSync = function() {
      return _.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("SELECT * FROM sync_details WHERE type_of_operation='UploadZip' ORDER BY time_stamp DESC LIMIT 5 ", [], function(tx, results) {
            var stamp;
            return time(stamp = results);
          }, _.transactionErrorhandler);
        };
      })(this));
    };

    SynchronizationController.prototype.getuploadURL = function() {
      return $.post(AJAXURL + '?action=get-sync-details', (function(_this) {
        return function(resp) {
          console.log('RESP');
          console.log(resp);
          if (resp.error) {
            return _this.onErrorResponse(resp.error);
          } else {
            _.setUploaduri(resp.login_details.ID);
            return _this.fileReadZip();
          }
        };
      })(this), 'json');
    };

    SynchronizationController.prototype.getDownloadURL = function() {
      var data;
      data = {
        blog_id: _.getBlogID(),
        last_sync: ''
      };
      return $.get(AJAXURL + '?action=sync-database', data, (function(_this) {
        return function(resp) {
          console.log('RESP');
          console.log(resp);
          _.setDwnlduri(resp.exported_csv_url);
          _.setDwnldTimeStamp(resp.sync_time);
          return _this.dwnldUnZip();
        };
      })(this), 'json');
    };

    return SynchronizationController;

  })(Marionette.Controller);
  return App.reqres.setHandler("get:sync:controller", function() {
    return new SynchronizationController;
  });
});