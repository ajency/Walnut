define(['underscore', 'unserialize', 'json2csvparse', 'zip'], function(_) {
  return _.mixin({
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
            return question_response_data[i] = [row.ref_id, row.content_piece_id, row.collection_id, row.division, row.question_response, row.time_taken, row.start_date, row.end_date, row.status, row.sync];
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
    convertDataToCSV: function() {
      var questionResponseData;
      questionResponseData = _.getDataFromQuestionResponse();
      return questionResponseData.done(function(question_response_data) {
        var csvData;
        csvData = ConvertToCSV(JSON.stringify(question_response_data));
        console.log("CSV Data");
        console.log(csvData);
        return _.createZipFile(csvData);
      });
    },
    createZipFile: function(csvData) {
      var content, zip;
      zip = new JSZip();
      zip.file('' + _.getTblPrefix() + 'question_response.csv', csvData);
      content = zip.generate({
        type: "text/plain"
      });
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        return fileSystem.root.getFile("SynapseAssets/csv-export.zip", {
          create: true,
          exclusive: false
        }, function(fileEntry) {
          return fileEntry.createWriter(function(writer) {
            return writer.write(content);
          }, _.fileErrorHandler);
        }, _.fileErrorHandler);
      }, _.fileSystemErrorHandler);
    }
  });
});
