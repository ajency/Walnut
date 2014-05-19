define(['underscore', 'marionette', 'backbone', 'jquery', 'csvparse'], function(_, Marionette, Backbone, $, parse) {
  _.createTables = function(db) {
    return db.transaction(function(transaction) {
      alert("create database");
      return transaction.executeSql('CREATE TABLE IF NOT EXISTS newdata(id INTEGER PRIMARY KEY, division_id INTEGER ,collection_id INTEGER,teacher_id INTEGER, date VARCHAR, status TEXT)');
    }, _.transactionErrorhandler, function(data) {
      alert("Success");
      return console.log('Success create');
    });
  };
  _.prePopulate = function(data) {
    return _.db.transaction(function(tx) {
      var i, row, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
        row = data[i];
        _results.push(tx.executeSql("INSERT INTO wp_training_logs ( division_id, collection_id, teacher_id, date,status,sync) VALUES (?, ?, ?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], 1]));
      }
      return _results;
    }, _.transactionErrorhandler, function(tx) {
      return console.log('Data inserted successfully');
    });
  };
  _.readValues = function() {
    return window.db.transaction(function(transaction) {
      alert("SELECT");
      return transaction.executeSql("SELECT * FROM newdata ", [], function(transaction, results) {
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
  _.PageLoading = function() {
    return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      return fileSystem.root.getFile("StudentsLogs.txt", {
        create: true,
        exclusive: false
      }, function(fileEntry) {
        var filePath, fileTransfer, uri;
        fileTransfer = new FileTransfer();
        uri = encodeURI("http://synapsedu.info/wp_35_training_logs.csv");
        filePath = fileEntry.toURL();
        return fileTransfer.download(uri, filePath, function(file) {
          return _.readAsText(file);
        }, _.fileTransferErrorHandler);
      }, _.fileErrorHandler);
    }, _.fileSystemErrorHandler);
  };
  _.fail = function(error) {
    alert("error");
    return console.log("error" + error.code);
  };
  _.gotFS = function(fileSystem) {
    return fileSystem.root.getFile("StudentsLogs.txt", {
      create: true,
      exclusive: false
    }, gotFileEntry, fail);
  };
  _.gotFileEntry = function(fileEntry) {
    var filePath, fileTransfer, uri;
    fileTransfer = new FileTransfer();
    uri = encodeURI("http://synapsedu.info/wp_35_training_logs.csv");
    filePath = fileEntry.toURL();
    return fileTransfer.download(uri, filePath, function(entry) {
      alert("Downloaded");
      fileEntry.file(gotFile, fail);
      return console.log("download complete: " + entry.fullPath);
    }, function(error) {
      console.log("download error source " + error.source);
      console.log("download error target " + error.target);
      return console.log("upload error code" + error.code);
    }, true);
  };
  _.gotFile = function(file) {
    return readAsText(file);
  };
  return _.readAsText = function(file) {
    var reader;
    reader = new FileReader();
    reader.onloadend = function(evt) {
      var csvString, parsedData;
      csvString = evt.target.result;
      parsedData = $.parse(csvString, {
        header: false,
        dynamicTyping: false
      });
      return prePopulate(parsedData.results);
    };
    return reader.readAsText(file);
  };
});
