define(['underscore', 'marionette', 'backbone', 'jquery'], function(_, Marionette, Backbone, $) {
  var localDatabaseTransaction;
  localDatabaseTransaction = function(db) {
    console.log('Local database object: ' + db);
    return db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY, user_id UNIQUE , username, password, user_role)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS wp_training_logs (id INTEGER PRIMARY KEY , division_id INTEGER, collection_id INTEGER, teacher_id INTEGER, date, status , sync INTEGER)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS wp_question_response (ref_id , content_piece_id INTEGER, collection_id INTEGER, division INTEGER , question_response, time_taken, start_date, end_date, status, sync INTEGER)');
      return tx.executeSql('CREATE TABLE IF NOT EXISTS wp_question_response_logs (qr_ref_id , start_time, sync INTEGER)');
    }, _.transactionErrorHandler, function(tx) {
      return console.log('SUCCESS: Local db transaction completed');
    });
  };
  return document.addEventListener("deviceready", function() {
    _.db = window.sqlitePlugin.openDatabase({
      name: "walnutapp"
    });
    return localDatabaseTransaction(_.db);
  }, false);
});
