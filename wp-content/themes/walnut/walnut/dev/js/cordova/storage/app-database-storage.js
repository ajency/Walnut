define(['underscore', 'jquery'], function(_, $) {
  return _.mixin({
    cordovaOpenPrepopulatedDatabase: function() {
      _.db = window.sqlitePlugin.openDatabase({
        name: "synapseAppData"
      });
      console.log('Local database object: ' + _.db);
      return _.createLocalTables(_.db);
    },
    createLocalTables: function(db) {
      return db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY , user_id UNIQUE, username, password, user_role)');
        return tx.executeSql('CREATE TABLE IF NOT EXISTS sync_details (id INTEGER PRIMARY KEY, type_of_operation, time_stamp)');
      }, _.transactionErrorHandler, function(tx) {
        return console.log('SUCCESS: createLocalTables transaction completed');
      });
    },
    createDataTables: function(db) {
      return db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + _.getTblPrefix() + 'class_divisions (id INTEGER, division, class_id INTEGER)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + _.getTblPrefix() + 'question_response (ref_id, teacher_id INTEGER, content_piece_id INTEGER, collection_id INTEGER , division INTEGER, question_response, time_taken, start_date, end_date, status , sync INTEGER)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + _.getTblPrefix() + 'question_response_meta (qr_ref_id, meta_key, meta_value)');
        return tx.executeSql('CREATE TABLE IF NOT EXISTS wp_collection_meta (id INTEGER PRIMARY KEY , collection_id INTEGER, meta_key TEXT, meta_value TEXT)');
      }, _.transactionErrorHandler, function(tx) {
        return console.log('SUCCESS: createDataTables transaction completed');
      });
    }
  });
});
