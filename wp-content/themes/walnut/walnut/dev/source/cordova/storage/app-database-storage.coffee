define ['underscore', 'jquery'], (_, $)->
    
    #SQLite database transaction based on HTML5 Web SQL database.

    _.mixin

        
        cordovaOpenPrepopulatedDatabase : ->

            _.db = window.sqlitePlugin.openDatabase({name: "synapseStudentAppDb"})

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

                tx.executeSql('CREATE TABLE IF NOT EXISTS '+_.getTblPrefix()+'question_response_meta 
                    (qr_ref_id VARCHAR, meta_key VARCHAR, meta_value TEXT, sync INTEGER)')
                

                tx.executeSql('CREATE TABLE IF NOT EXISTS wp_quiz_question_response 
                    (qr_id VARCHAR, summary_id VARCHAR, content_piece_id INTEGER
                    , question_response TEXT, time_taken INTEGER, marks_scored INTEGER
                    , status VARCHAR)')

                tx.executeSql('CREATE TABLE IF NOT EXISTS wp_quiz_response_summary 
                    (summary_id VARCHAR, collection_id INTEGER, student_id INTEGER, taken_on
                    , quiz_meta TEXT)')

                
            ,_.transactionErrorHandler
            ,(tx)->
                console.log 'SUCCESS: createDataTables transaction completed'
            )