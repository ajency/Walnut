define(['underscore', 'marionette', 'backbone', 'jquery'], function(_, Marionette, Backbone, $) {
  var createTables, errorHandler, fail, gotFS, gotFile, gotFileEntry, initDatabase, prePopulate, readAsText, readValues;
  errorHandler = function(error) {
    return console.log("Error: " + error);
  };
  createTables = function(db) {
    return db.transaction(function(transaction) {
      alert("create database");
      return transaction.executeSql('CREATE TABLE IF NOT EXISTS newdata(id INTEGER PRIMARY KEY, division_id INTEGER ,collection_id INTEGER,teacher_id INTEGER, date VARCHAR, status TEXT)');
    }, errorHandler, function(data) {
      alert("Success");
      return console.log('Success create');
    });
  };
  initDatabase = function() {
    var DEMODB;
    alert("initDatabase");
    DEMODB = window.openDatabase("DEMODB", "1.0", "DEMO Database", 500000);
    window.db = DEMODB;
    return createTables(window.db);
  };
  prePopulate = function(results1) {
    var allData, collectionId, date1, divisionId, id1, status1, teacherId;
    if (results1.length === 1) {
      allData = results1[0];
      console.log(allData[0]);
      id1 = allData[0];
      divisionId = allData[1];
      collectionId = allData[2];
      teacherId = allData[3];
      date1 = allData[4];
      status1 = allData[5];
      window.db.transaction(function(transaction) {
        alert("insert");
        transaction.executeSql("INSERT INTO newdata(id, division_id, collection_id, teacher_id, date, status) VALUES ('" + id1 + "','" + divisionId + "','" + collectionId + "','" + teacherId + "','" + date1 + "','" + status1 + "')");
        return console.log("INSERT INTO newdata(id, division_id, collection_id, teacher_id, date, status) VALUES ('" + id1 + "','" + divisionId + "','" + collectionId + "','" + teacherId + "','" + date1 + "','" + status1 + "')");
      }, errorHandler, function(data) {
        return console.log('Success insert');
      });
      return readValues();
    }
  };
  readValues = function() {
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
      }, errorHandler);
    });
  };
  gotFS = function(fileSystem) {
    alert("gotFS");
    return fileSystem.root.getFile("StudentsLogs.txt", {
      create: true,
      exclusive: false
    }, gotFileEntry, fail);
  };
  _.PageLoading = function() {
    alert("hello ");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    return initDatabase();
  };
  fail = function(error) {
    alert("error");
    return console.log("error" + error.code);
  };
  gotFileEntry = function(fileEntry) {
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
  gotFile = function(file) {
    return readAsText(file);
  };
  return readAsText = function(file) {
    var reader;
    reader = new FileReader();
    reader.onloadend = function(evt) {
      var csvString, results;
      csvString = evt.target.result;
      return results = $.parse(csvString, {
        header: false,
        dynamicTyping: false,
        step: function(data, file, inputElem) {
          var results1;
          results1 = data.results;
          return prePopulate(results1);
        }
      });
    };
    return reader.readAsText(file);
  };
});
