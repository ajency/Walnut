define(['underscore', 'marionette', 'backbone', 'jquery'], function(_, Marionette, Backbone, $) {
  _.db = window.sqlitePlugin.openDatabase({
    name: "walnutapp"
  });
  console.log('Prepopulated DB Object: ' + _.db);
  _.db.transaction(function(tx) {
    return tx.executeSql('CREATE TABLE IF NOT EXISTS wp_training_logs (id INTEGER PRIMARY KEY, division_id INTEGER, collection_id INTEGER, teacher_id INTEGER, date, status)');
  }, function(tx, err) {
    return console.log('Error: ' + err);
  }, function(tx) {
    return console.log('Success: Pre-populated db transaction completed');
  });
  _.userDb = window.openDatabase("UserDetails", "1.0", "User Details", 200000);
  console.log('User DB Object: ' + _.userDb);
  return _.userDb.transaction(function(tx) {
    return tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY, username, password, user_role)');
  }, function(tx, err) {
    return console.log('Error: ' + err);
  }, function(tx) {
    return console.log('Success: UserDetails transaction completed');
  });
});
