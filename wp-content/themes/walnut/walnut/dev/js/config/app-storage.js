define(['underscore', 'marionette', 'backbone', 'jquery'], function(_, Marionette, Backbone, $) {
  _.db = window.sqlitePlugin.openDatabase({
    name: "walnutapp"
  });
  console.log('Prepopulated DB Object: ' + _.db);
  _.userDb = window.openDatabase("UserDetails", "1.0", "User Details", 200000);
  return _.userDb.transaction(function(tx) {
    return tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY, username, password, user_role)');
  }, function(tx, err) {
    return console.log('Error: ' + err);
  }, function(tx) {
    return console.log('Success: UserDetails transaction completed');
  });
});
