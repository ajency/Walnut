define(['underscore', 'jquery'], function(_, $) {
  return _.mixin({
    cordovaOpenPrepopulatedDatabase: function() {
      _.db = window.sqlitePlugin.openDatabase({
        name: "walnutapp"
      });
      console.log('Local database object: ' + _.db);
      return _.createLocalTables(_.db);
    },
    createLocalTables: function(db) {
      return db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY , user_id UNIQUE, username, password, user_role)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS sync_details (id INTEGER PRIMARY KEY, type_of_operation, time_stamp)');
        return tx.executeSql('CREATE TABLE IF NOT EXISTS sync_media_details (id INTEGER PRIMARY KEY, type_of_operation)');
      }, _.transactionErrorHandler, function(tx) {
        return console.log('SUCCESS: createLocalTables transaction completed');
      });
    },
    createDataTables: function(db) {
      return db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + _.getTblPrefix() + 'class_divisions (id INTEGER, division, class_id INTEGER)');
        return tx.executeSql('CREATE TABLE IF NOT EXISTS ' + _.getTblPrefix() + 'question_response (ref_id, teacher_id INTEGER, content_piece_id INTEGER, collection_id INTEGER , division INTEGER, question_response, time_taken, start_date, end_date, status , sync INTEGER)');
      }, _.transactionErrorHandler, function(tx) {
        return console.log('SUCCESS: createDataTables transaction completed');
      });
    }
  });
});
