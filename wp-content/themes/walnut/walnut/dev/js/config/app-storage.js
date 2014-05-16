define(['underscore', 'marionette', 'backbone', 'jquery'], function(_, Marionette, Backbone, $) {
  var localDatabaseTransaction;
  localDatabaseTransaction = function(db) {
    console.log('Local database object: ' + db);
    return db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY, user_id UNIQUE, username, password, user_role)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS wp_training_logs (id INTEGER PRIMARY KEY, division_id INTEGER, collection_id INTEGER, teacher_id INTEGER, date, status)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS wp_question_response (ref_id, content_piece_id INTEGER, collection_id INTEGER, division INTEGER, question_response, time_taken, start_date, end_date, status)');
      return tx.executeSql('CREATE TABLE IF NOT EXISTS wp_question_response_logs (qr_ref_id, start_time)');
    }, _.transactionErrorHandler, function(tx) {
      return console.log('SUCCESS: Local db transaction completed');
    });
  };
  document.addEventListener("deviceready", function() {
    _.db = window.sqlitePlugin.openDatabase({
      name: "walnutapp"
    });
    return localDatabaseTransaction(_.db);
  }, false);
  _.setUserID = function(id) {
    return window.localStorage.setItem("user_id", "" + id);
  };
  _.getUserID = function() {
    return window.localStorage.getItem("user_id");
  };
  _.setBlogID = function(id) {
    return window.localStorage.setItem("blog_id", "" + id);
  };
  _.getBlogID = function() {
    return window.localStorage.getItem("blog_id");
  };
  _.setBlogName = function(name) {
    return window.localStorage.setItem("blog_name", "" + name);
  };
  _.getBlogName = function() {
    return window.localStorage.getItem("blog_name");
  };
  _.setSchoolLogoSrc = function(src) {
    return window.localStorage.setItem("school_logo_src", "" + src);
  };
  _.getSchoolLogoSrc = function() {
    return window.localStorage.getItem("school_logo_src");
  };
  return _.downloadSchoolLogo = function(logo_url) {
    return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      return fileSystem.root.getFile("logo.jpg", {
        create: true,
        exclusive: false
      }, function(fileEntry) {
        var filePath, fileTransfer, uri;
        filePath = fileEntry.toURL().replace("logo.jpg", "");
        fileEntry.remove();
        uri = encodeURI(logo_url);
        fileTransfer = new FileTransfer();
        return fileTransfer.download(uri, filePath + "logo.jpg", function(file) {
          console.log('School logo download successful');
          console.log('Logo file source: ' + file.toURL());
          return _.setSchoolLogoSrc(file.toURL());
        }, _.fileTransferErrorHandler, true);
      }, _.fileErrorHandler);
    }, _.fileSystemErrorHandler);
  };
});
