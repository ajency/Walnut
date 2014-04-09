define(['underscore', 'marionette', 'backbone', 'jquery'], function(_, Marionette, Backbone, $) {
  var db;
  db = window.sqlitePlugin.openDatabase({
    name: "walnutapp"
  });
  console.log('Prepopulated DB Object: ' + db);
  db.transaction(function(tx) {
    return console.log('Pre-populated database');
  }, function(tx, err) {
    return console.log("Error processing SQL: " + err);
  }, function() {
    return console.log("Success!");
  });
  return Backbone.db = db;
});
