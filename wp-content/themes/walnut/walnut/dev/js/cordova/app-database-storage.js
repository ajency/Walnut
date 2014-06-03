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
      tx.executeSql('CREATE TABLE IF NOT EXISTS ' + _.getTblPrefix() + 'training_logs (id INTEGER PRIMARY KEY, division_id INTEGER, collection_id INTEGER , teacher_id INTEGER, date, status, sync INTEGER)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS ' + _.getTblPrefix() + 'question_response (ref_id, content_piece_id INTEGER, collection_id INTEGER, division INTEGER , question_response, time_taken, start_date, end_date, status, sync INTEGER)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS ' + _.getTblPrefix() + 'question_response_logs (qr_ref_id, start_time, sync INTEGER)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS sync_details (id INTEGER PRIMARY KEY, type_of_operation, time_stamp)');
      if (_.getDeleteDataFromTablesFlag() === null) {
        tx.executeSql("DELETE FROM " + _.getTblPrefix() + "class_divisions");
        tx.executeSql("DELETE FROM " + _.getTblPrefix() + "question_response");
        tx.executeSql("DELETE FROM " + _.getTblPrefix() + "question_response_logs");
        tx.executeSql("DELETE FROM " + _.getTblPrefix() + "training_logs");
        tx.executeSql("DELETE FROM wp_collection_meta");
        tx.executeSql("DELETE FROM wp_content_collection");
        tx.executeSql("DELETE FROM wp_options");
        tx.executeSql("DELETE FROM wp_postmeta");
        tx.executeSql("DELETE FROM wp_posts");
        tx.executeSql("DELETE FROM wp_term_relationships");
        tx.executeSql("DELETE FROM wp_term_taxonomy");
        tx.executeSql("DELETE FROM wp_terms");
        tx.executeSql("DELETE FROM wp_textbook_relationships");
        tx.executeSql("DELETE FROM wp_usermeta");
        return tx.executeSql("DELETE FROM wp_users");
      }
    }, _.transactionErrorHandler, function(tx) {
      console.log('SUCCESS: Local db transaction completed');
      return _.setDeleteDataFromTablesFlag(1);
    });
  };
});
