define(['underscore', 'marionette', 'backbone', 'jquery'], function(_, Marionette, Backbone, $) {
  var prepopulatedDatabaseTransaction, userDatabaseTransaction;
  prepopulatedDatabaseTransaction = function(db) {
    console.log('Pre-populated DB Object: ' + db);
    return db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS wp_training_logs (id INTEGER PRIMARY KEY, division_id INTEGER, collection_id INTEGER, teacher_id INTEGER, date, status)');
      return tx.executeSql('CREATE TABLE IF NOT EXISTS wp_question_response (id INTEGER PRIMARY KEY, content_piece_id INTEGER, collection_id INTEGER, division INTEGER, date_created, date_modified, total_time, question_response, time_started, time_completed)');
    }, _.transactionErrorHandler, function(tx) {
      return console.log('Success: Pre-populated db transaction completed');
    });
  };
  userDatabaseTransaction = function(db) {
    console.log('User DB Object: ' + db);
    return db.transaction(function(tx) {
      return tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY, username, password, user_role)');
    }, _.transactionErrorHandler, function(tx) {
      return console.log('Success: UserDetails transaction completed');
    });
  };
  _.db = window.sqlitePlugin.openDatabase({
    name: "walnutapp"
  });
  prepopulatedDatabaseTransaction(_.db);
  _.userDb = window.openDatabase("UserDetails", "1.0", "User Details", 200000);
  return userDatabaseTransaction(_.userDb);
});
