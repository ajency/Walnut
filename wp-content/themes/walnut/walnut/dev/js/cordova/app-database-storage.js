define(['underscore', 'marionette', 'backbone', 'jquery'], function(_, Marionette, Backbone, $) {
  var userDetailsTransaction;
  userDetailsTransaction = function(db) {
    return db.transaction(function(tx) {
      return tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY , user_id UNIQUE, username, password, user_role)');
    }, _.transactionErrorHandler, function(tx) {
      return console.log('SUCCESS: User details transaction completed');
    });
  };
  document.addEventListener("deviceready", function() {
    _.db = window.sqlitePlugin.openDatabase({
      name: "walnutapp"
    });
    console.log('Local database object: ' + _.db);
    return userDetailsTransaction(_.db);
  }, false);
  return _.localDatabaseTransaction = function(db) {
    return db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS ' + _.getTblPrefix() + 'question_response (ref_id, teacher_id INTEGER, content_piece_id INTEGER, collection_id INTEGER , division INTEGER, question_response, time_taken, start_date, end_date, status , sync INTEGER)');
      return tx.executeSql('CREATE TABLE IF NOT EXISTS sync_details (id INTEGER PRIMARY KEY, type_of_operation, time_stamp)');
    }, _.transactionErrorHandler, function(tx) {
      return console.log('SUCCESS: Local db transaction completed');
    });
  };
});
