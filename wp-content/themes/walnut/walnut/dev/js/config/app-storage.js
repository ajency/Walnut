define(['underscore', 'marionette', 'backbone', 'jquery'], function(_, Marionette, Backbone, $) {
  var localDatabaseTransaction;
  localDatabaseTransaction = function(db) {
    console.log('Local database Object: ' + db);
    return db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY, user_id UNIQUE, username, password, user_role)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS wp_training_logs (id INTEGER PRIMARY KEY, division_id INTEGER, collection_id INTEGER, teacher_id INTEGER, date, status)');
      return tx.executeSql('CREATE TABLE IF NOT EXISTS wp_question_response (id INTEGER PRIMARY KEY, content_piece_id INTEGER, collection_id INTEGER, division INTEGER, date_created, date_modified, total_time, question_response, time_started, time_completed)');
    }, _.transactionErrorHandler, function(tx) {
      return console.log('Success: Local db transaction completed');
    });
  };
  _.db = window.sqlitePlugin.openDatabase({
    name: "walnutapp"
  });
  localDatabaseTransaction(_.db);
  _.setLoginStatus = function(status) {
    return window.localStorage.setItem("user_login_status", "" + status);
  };
  _.getLoginStatus = function() {
    return window.localStorage.getItem("user_login_status");
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
  return _.getBlogName = function() {
    return window.localStorage.getItem("blog_name");
  };
});
