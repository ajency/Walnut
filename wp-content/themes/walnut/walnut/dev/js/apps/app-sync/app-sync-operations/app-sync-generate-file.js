define(['underscore', 'unserialize', 'json2csvparse', 'jszip'], function(_) {
  return _.mixin({
    generateZipFile: function() {
      var questionResponseData;
      $('#syncSuccess').css("display", "block").text("Generating file...");
      questionResponseData = _.getDataFromQuestionResponse();
      return questionResponseData.done(function(question_response_data) {
        return _.convertDataToCSV(question_response_data);
      });
    },
    convertDataToCSV: function(questionResponseData) {
      var csvData;
      questionResponseData = JSON.stringify(questionResponseData);
      csvData = ConvertToCSV(questionResponseData);
      console.log("CSV Data");
      console.log(csvData);
      return _.writeToZipFile(csvData);
    },
    writeToZipFile: function(csvData) {
      var content, zip;
      zip = new JSZip();
      zip.file('' + _.getTblPrefix() + 'question_response.csv', csvData);
      content = zip.generate({
        type: "blob"
      });
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        return fileSystem.root.getFile("SynapseAssets/csv-export-" + device.uuid + ".zip", {
          create: true,
          exclusive: false
        }, function(fileEntry) {
          return fileEntry.createWriter(function(writer) {
            writer.write(content);
            return _.onFileGenerationSuccess();
          }, _.fileErrorHandler);
        }, _.fileErrorHandler);
      }, _.fileSystemErrorHandler);
    },
    onFileGenerationSuccess: function() {
      _.setGeneratedZipFlePath(fileEntry.toURL());
      _.updateSyncDetails('file_generate', _.getCurrentDateTime(2));
      $('#syncSuccess').css("display", "block").text("File generation completed...");
      return _.updateQuestionResponseSyncFlag();
    },
    updateQuestionResponseSyncFlag: function() {
      return _.db.transaction(function(tx) {
        return tx.executeSql("UPDATE " + _.getTblPrefix() + "question_response SET sync=? WHERE sync=", [1, 0]);
      }, _.transactionErrorhandler, function(tx) {
        setTimeout((function(_this) {
          return function() {
            return _.uploadGeneratedZipFile();
          };
        })(this), 2000);
        return console.log('updateQuestionResponseSyncFlag transaction completed');
      });
    },
    getDataFromQuestionResponse: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "question_response WHERE sync=0", [], onSuccess(d), _.deferredErrorHandler(d));
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
    }
  });
});
