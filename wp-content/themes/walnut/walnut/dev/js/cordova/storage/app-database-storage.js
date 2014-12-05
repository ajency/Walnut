define(['underscore', 'jquery'], function(_, $) {
  return _.mixin({
    cordovaOpenPrepopulatedDatabase: function() {
      _.db = window.sqlitePlugin.openDatabase({
        name: "SynapseStudentAppdb"
      });
      console.log('Local database object: ' + _.db);
      return _.createLocalTables(_.db);
    },
    createLocalTables: function(db) {
      return db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY , user_id INTEGER, username, display_name, password, user_capabilities, user_role , cookie, blog_id, user_email, division)');
        return tx.executeSql('CREATE TABLE IF NOT EXISTS sync_details (id INTEGER PRIMARY KEY, type_of_operation, time_stamp, user_id)');
      }, _.transactionErrorHandler, function(tx) {
        return console.log('SUCCESS: createLocalTables transaction completed');
      });
    },
    createDataTables: function(db) {
      return db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + _.getTblPrefix() + 'class_divisions (id INTEGER, division, class_id INTEGER)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + _.getTblPrefix() + 'quiz_question_response (qr_id VARCHAR, summary_id VARCHAR, content_piece_id INTEGER , question_response TEXT, time_taken INTEGER, marks_scored TEXT , status VARCHAR, sync INTEGER)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + _.getTblPrefix() + 'quiz_response_summary (summary_id VARCHAR, collection_id INTEGER, student_id INTEGER, taken_on , quiz_meta TEXT, sync INTEGER)');
        return tx.executeSql('CREATE TABLE IF NOT EXISTS ' + _.getTblPrefix() + 'quiz_schedules (quiz_id INTEGER, division_id INTEGER, schedule_from, schedule_to)');
      }, _.transactionErrorHandler, function(tx) {
        return console.log('SUCCESS: createDataTables transaction completed');
      });
    }
  });
});
