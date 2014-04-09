define(['underscore', 'marionette', 'backbone', 'jquery'], function(_, Marionette, Backbone, $) {
  var db, onFailure;
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
  Backbone.db = db;
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    var entry;
    entry = fileSystem.root;
    console.log('Entry: ' + entry);
    console.log('Root: ' + entry.fullPath);
    return entry.getDirectory("TestApp", {
      create: true,
      exclusive: false
    }, function(dir) {
      return console.log('Created directory: ' + dir.name);
    }, onFailure);
  }, onFailure);
  return onFailure = function(error) {
    return console.log('Error: ' + error.code);
  };
});
