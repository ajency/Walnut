define(['underscore', 'marionette', 'backbone', 'jquery', 'plugins/SQLitePlugin'], function(_, Marionette, Backbone, $, sqlitePlugin) {
  var db;
  db = window.openDatabase("walnutapp", "1.0", "WalnutApp DB", 200000);
  console.log('DB Object: ' + db);
  db.transaction(function(tx) {
    return console.log('Pre-populated database');
  }, function(tx, err) {
    return console.log("Error processing SQL: " + err);
  }, function() {
    return console.log("Success!");
  });
  return Backbone.db = db;
});
