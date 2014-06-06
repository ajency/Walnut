define(['underscore', 'marionette', 'backbone'], function(_, Marionette, Backbone) {
  return document.addEventListener("deviceready", function() {
    var db;
    db = window.openDatabase("Walnut App", "1.0", "Walnut App DB", 200000);
    db.vent = new Backbone.Wreqr.EventAggregator();
    db.reqres = new Backbone.Wreqr.RequestResponse();
    db.commands = new Backbone.Wreqr.Commands();
    db.transaction(populateDB, error, success);
    populateDB(function(tx) {
      tx.executeSql('DROP TABLE IF EXISTS DEMO');
      tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
      tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "Class 1")');
      tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Class 2")');
      tx.executeSql('INSERT INTO DEMO (id, data) VALUES (3, "Class 3")');
      return tx.executeSql('INSERT INTO DEMO (id, data) VALUES (4, "Class 4")');
    });
    success(function() {
      return alert('DB Creation Successful');
    });
    error(function(tx, error) {
      return alert("Error processing SQL: " + err);
    });
    return Backbone.db = db;
  });
});
