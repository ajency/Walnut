define ['underscore', 'marionette', 'backbone','jquery'], (_, Marionette, Backbone, $)->
    
    #SQLite database transaction based on HTML5 Web SQL database.

    localDatabaseTransaction =(db)->
        
        console.log 'Local database object: '+db

        db.transaction((tx)->
            #User table
            tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY, user_id UNIQUE
                , username, password, user_role)')

            tx.executeSql('CREATE TABLE IF NOT EXISTS wp_training_logs (id INTEGER PRIMARY KEY
                , division_id INTEGER, collection_id INTEGER, teacher_id INTEGER, date, status
                , sync INTEGER)')

            tx.executeSql('CREATE TABLE IF NOT EXISTS wp_question_response (ref_id
                , content_piece_id INTEGER, collection_id INTEGER, division INTEGER
                , question_response, time_taken, start_date, end_date, status, sync INTEGER)')

            tx.executeSql('CREATE TABLE IF NOT EXISTS wp_question_response_logs (qr_ref_id
                , start_time, sync INTEGER)')
            
        ,_.transactionErrorHandler
        ,(tx)->
            console.log 'SUCCESS: Local db transaction completed'
        )

    

    #Access local data from a pre-populated db file from assets folder
    #Cordova device ready event
    document.addEventListener("deviceready", ->
        
        _.db = window.sqlitePlugin.openDatabase({name: "walnutapp"});
        
        localDatabaseTransaction(_.db)

    ,false)