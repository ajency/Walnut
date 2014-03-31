define ['underscore', 'marionette', 'backbone'], (_, Marionette, Backbone)->
	
	document.addEventListener "deviceready", ->
		db = window.openDatabase("Walnut App", "1.0", "Walnut App DB", 200000);
		db.vent    	= new Backbone.Wreqr.EventAggregator();
		db.reqres  	= new Backbone.Wreqr.RequestResponse();
		db.commands = new Backbone.Wreqr.Commands();

		db.transaction(populateDB, error, success);
		
		populateDB (tx) ->
			tx.executeSql('DROP TABLE IF EXISTS DEMO')
			tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
			tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "Class 1")');
			tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Class 2")');
			tx.executeSql('INSERT INTO DEMO (id, data) VALUES (3, "Class 3")');
			tx.executeSql('INSERT INTO DEMO (id, data) VALUES (4, "Class 4")');

		success ->
			alert 'DB Creation Successful';	

		error (tx,error) ->
			alert("Error processing SQL: "+err);	
	  	

	    # bind db to Backbone
		Backbone.db = db