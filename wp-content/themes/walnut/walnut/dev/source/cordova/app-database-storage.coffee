define ['underscore', 'jquery'], (_, $)->
	
	#SQLite database transaction based on HTML5 Web SQL database.

	_.mixin

		cordovaOpenPrepopulatedDatabase : ->

			_.db = window.sqlitePlugin.openDatabase({name: "walnutapp"})

			console.log 'Local database object: '+_.db

			_.createLocalTables _.db



		createLocalTables : (db)->

			db.transaction((tx)->
				#User table
				tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY
					, user_id UNIQUE, username, password, user_role)')

				tx.executeSql('CREATE TABLE IF NOT EXISTS sync_details
					(id INTEGER PRIMARY KEY, type_of_operation, time_stamp)')
				
			,_.transactionErrorHandler
			,(tx)->
				console.log 'SUCCESS: createLocalTables transaction completed'
			)


		createDataTables : (db)->

			db.transaction((tx)->

				tx.executeSql('CREATE TABLE IF NOT EXISTS '+_.getTblPrefix()+'class_divisions 
					(id INTEGER, division, class_id INTEGER)')

				tx.executeSql('CREATE TABLE IF NOT EXISTS '+_.getTblPrefix()+'question_response 
					(ref_id, teacher_id INTEGER, content_piece_id INTEGER, collection_id INTEGER
					, division INTEGER, question_response, time_taken, start_date, end_date, status
					, sync INTEGER)')

				
			,_.transactionErrorHandler
			,(tx)->
				console.log 'SUCCESS: createDataTables transaction completed'
			)