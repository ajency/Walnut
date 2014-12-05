define ['underscore', 'jquery'], (_, $)->
	
	#SQLite database transaction based on HTML5 Web SQL database.

	_.mixin

		
		cordovaOpenPrepopulatedDatabase : ->

			_.db = window.sqlitePlugin.openDatabase({name: "SynapseStudentAppdb"})

			console.log 'Local database object: '+_.db

			_.createLocalTables _.db



		createLocalTables : (db)->

			db.transaction((tx)->
				#User table
				tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY
					, user_id INTEGER, username, display_name, password, user_capabilities, user_role
					, cookie, blog_id, user_email, division)')

				tx.executeSql('CREATE TABLE IF NOT EXISTS sync_details
					(id INTEGER PRIMARY KEY, type_of_operation, time_stamp, user_id)')
				
			,_.transactionErrorHandler
			,(tx)->
				console.log 'SUCCESS: createLocalTables transaction completed'
			)


		
		createDataTables : (db)->

			db.transaction((tx)->

				tx.executeSql('CREATE TABLE IF NOT EXISTS '+_.getTblPrefix()+'class_divisions 
					(id INTEGER, division, class_id INTEGER)')

				tx.executeSql('CREATE TABLE IF NOT EXISTS '+_.getTblPrefix()+'quiz_question_response 
					(qr_id VARCHAR, summary_id VARCHAR, content_piece_id INTEGER
					, question_response TEXT, time_taken INTEGER, marks_scored TEXT
					, status VARCHAR, sync INTEGER)')

				tx.executeSql('CREATE TABLE IF NOT EXISTS '+_.getTblPrefix()+'quiz_response_summary 
					(summary_id VARCHAR, collection_id INTEGER, student_id INTEGER, taken_on
					, quiz_meta TEXT, sync INTEGER)')

				tx.executeSql('CREATE TABLE IF NOT EXISTS '+_.getTblPrefix()+'quiz_schedules 
					(quiz_id INTEGER, division_id INTEGER, schedule_from, schedule_to)')

				# tx.executeSql('CREATE TABLE IF NOT EXISTS user_session_value_check 
				#     (user_id VARCHAR, username VARCHAR, session_id VARCHAR)')

				
			,_.transactionErrorHandler
			,(tx)->
				console.log 'SUCCESS: createDataTables transaction completed'
			)