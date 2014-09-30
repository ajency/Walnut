define(['underscore', 'unserialize', 'json2csvparse', 'jszip'], function(_) {
  return _.mixin({
    generateZipFile: function() {
      var questionResponseData;
      $('#syncSuccess').css("display", "block").text("Generating file...");
      questionResponseData = _.getDataFromQuestionResponse();
      return questionResponseData.done(function(question_response_data) {
        var questionResponseMetaData;
        questionResponseMetaData = _.getDataFromQuestionResponseMeta();
        return questionResponseMetaData.done(function(question_response_meta_data) {
          question_response_data = _.convertDataToCSV(question_response_data, 'question_response');
          question_response_meta_data = _.convertDataToCSV(question_response_meta_data, 'question_response_meta');
          return _.writeToZipFile(question_response_data, question_response_meta_data);
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
    writeToZipFile: function(question_response_data, question_response_meta_data) {
      var content, zip;
      zip = new JSZip();
      zip.file('' + _.getTblPrefix() + 'question_response.csv', question_response_data);
      zip.file('' + _.getTblPrefix() + 'question_response_meta.csv', question_response_meta_data);
      content = zip.generate({
        type: "blob"
      });
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        return fileSystem.root.getFile("SynapseAssets/SynapseData/csv-export-" + device.uuid + ".zip", {
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
      return _.updateSyncFlag('question_response');
    },
    updateSyncFlag: function(table_name) {
      return _.db.transaction(function(tx) {
        return tx.executeSql("UPDATE " + _.getTblPrefix() + table_name + " SET sync=? WHERE sync=?", [1, 0]);
      }, _.transactionErrorHandler, function(tx) {
        console.log('Updated sync flag in ' + table_name);
        if (table_name === 'question_response') {
          return _.updateSyncFlag('question_response_meta');
        } else {
          return setTimeout((function(_this) {
            return function() {
              return _.uploadGeneratedZipFile();
            };
          })(this), 2000);
        }
      });
    },
    getDataFromQuestionResponse: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "question_response WHERE sync=?", [0], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, question_response_data, row, _fn, _i, _ref;
          question_response_data = new Array();
          _fn = function(i, row) {
            return question_response_data[i] = [row.ref_id, row.teacher_id, row.content_piece_id, row.collection_id, row.division, row.question_response, row.time_taken, row.start_date, row.end_date, row.status];
          };
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            _fn(i, row);
          }
          return d.resolve(question_response_data);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getDataFromQuestionResponse transaction completed');
      }).fail(_.failureHandler);
    },
    getDataFromQuestionResponseMeta: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "question_response_meta WHERE sync=?", [0], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, question_response_meta_data, row, _fn, _i, _ref;
          question_response_meta_data = new Array();
          _fn = function(i, row) {
            return question_response_meta_data[i] = [row.qr_ref_id, row.meta_key, row.meta_value];
          };
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            _fn(i, row);
          }
          return d.resolve(question_response_meta_data);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getDataFromQuestionResponseMeta transaction completed');
      }).fail(_.failureHandler);
    }
  });
});
