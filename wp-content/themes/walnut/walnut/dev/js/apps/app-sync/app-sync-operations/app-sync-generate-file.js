define(['underscore', 'unserialize', 'json2csvparse', 'jszip'], function(_) {
  return _.mixin({
    generateZipFile: function() {
      var quizQuestionResponseData;
      $('#storageOption').prop("disabled", true);
      $('#syncSuccess').css("display", "block").text("Generating file...");
      quizQuestionResponseData = _.getDataFromQuizQuestionResponse();
      return quizQuestionResponseData.done(function(quiz_question_response_data) {
        var quizResponseSummaryData;
        quizResponseSummaryData = _.getDataFromQuizResponseSummary();
        return quizResponseSummaryData.done(function(quiz_response_summary_data) {
          quiz_question_response_data = _.convertDataToCSV(quiz_question_response_data, 'quiz_question_response');
          quiz_response_summary_data = _.convertDataToCSV(quiz_response_summary_data, 'quiz_response_summary');
          return _.writeToZipFile(quiz_question_response_data, quiz_response_summary_data);
        });
      });
    },
    convertDataToCSV: function(data, table_name) {
      var csvData;
      data = JSON.stringify(data);
      csvData = ConvertToCSV(data);
      console.log('CSV Data for ' + table_name);
      console.log(csvData);
      return csvData;
    },
    writeToZipFile: function(quiz_question_response_data, quiz_response_summary_data) {
      var content, filepath, option, value, zip;
      zip = new JSZip();
      zip.file('' + _.getTblPrefix() + 'quiz_question_response.csv', quiz_question_response_data);
      zip.file('' + _.getTblPrefix() + 'quiz_response_summary.csv', quiz_response_summary_data);
      content = zip.generate({
        type: "blob"
      });
      value = _.getStorageOption();
      option = JSON.parse(value);
      if (option.internal) {
        filepath = option.internal;
      } else if (option.external) {
        filepath = option.external;
      }
      return window.resolveLocalFileSystemURL('file://' + filepath + '', function(fileSystem) {
        return fileSystem.getFile("SynapseAssets/SynapseData/csv-export-" + device.uuid + ".zip", {
          create: true,
          exclusive: false
        }, function(fileEntry) {
          return fileEntry.createWriter(function(writer) {
            writer.write(content);
            _.setGeneratedZipFilePath(fileEntry.toURL());
            return _.onFileGenerationSuccess();
          }, _.fileErrorHandler);
        }, _.fileErrorHandler);
      }, _.fileSystemErrorHandler);
    },
    onFileGenerationSuccess: function() {
      _.updateSyncDetails('file_generate', _.getCurrentDateTime(2));
      $('#syncSuccess').css("display", "block").text("File generation completed...");
      return _.updateSyncFlag('quiz_question_response');
    },
    updateSyncFlag: function(table_name) {
      return _.db.transaction(function(tx) {
        return tx.executeSql("UPDATE " + _.getTblPrefix() + table_name + " SET sync=? WHERE sync=?", [1, 0]);
      }, _.transactionErrorhandler, function(tx) {
        console.log('Updated sync flag in ' + table_name);
        if (table_name === 'quiz_question_response') {
          return _.updateSyncFlag('quiz_response_summary');
        } else {
          return setTimeout((function(_this) {
            return function() {
              return _.uploadGeneratedZipFile();
            };
          })(this), 2000);
        }
      });
    },
    getDataFromQuizQuestionResponse: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "quiz_question_response WHERE sync=?", [0], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, quiz_question_response_data, row, _fn, _i, _ref;
          quiz_question_response_data = new Array();
          _fn = function(i, row) {
            return quiz_question_response_data[i] = [row.qr_id, row.summary_id, row.content_piece_id, row.question_response, row.time_taken, row.marks_scored, row.status];
          };
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            _fn(i, row);
          }
          return d.resolve(quiz_question_response_data);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getDataFromQuizQuestionResponse transaction completed');
      }).fail(_.failureHandler);
    },
    getDataFromQuizResponseSummary: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "quiz_response_summary WHERE sync=?", [0], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, quiz_response_summary_data, row, _fn, _i, _ref;
          quiz_response_summary_data = new Array();
          _fn = function(i, row) {
            return quiz_response_summary_data[i] = [row.summary_id, row.collection_id, row.student_id, row.taken_on, row.quiz_meta];
          };
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            _fn(i, row);
          }
          return d.resolve(quiz_response_summary_data);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getDataFromQuizResponseSummary transaction completed');
      }).fail(_.failureHandler);
    }
  });
});
