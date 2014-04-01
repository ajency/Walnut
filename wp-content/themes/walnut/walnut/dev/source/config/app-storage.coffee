define ['underscore', 'marionette', 'backbone','jquery'], (_, Marionette, Backbone, $)->
	
	db = window.openDatabase("Walnut App", "1.0", "Walnut App DB", 200000)
	db.transaction(populateDB, errorCB, successCB)

	`function populateDB(tx) {
		tx.executeSql('DROP TABLE IF EXISTS DEMO');
    	tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
    	tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "Class 1")');
    	tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Class 2")');
    	tx.executeSql('INSERT INTO DEMO (id, data) VALUES (3, "Class 3")');
    	};

    	function errorCB(tx, err) {
    		console.log("Error processing SQL: "+err);
    	};

    	function successCB(){
    		console.log("Success!");
        }`
 Backbone.db = db