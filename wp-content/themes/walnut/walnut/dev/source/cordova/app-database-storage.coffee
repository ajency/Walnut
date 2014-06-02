define ['underscore', 'marionette', 'backbone','jquery'], (_, Marionette, Backbone, $)->
    
    #SQLite database transaction based on HTML5 Web SQL database.

    userDetailsTransaction = (db)->

        db.transaction((tx)->
            #User table
            tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY
                , user_id UNIQUE, username, password, user_role)')
            
        ,_.transactionErrorHandler
        ,(tx)->
            console.log 'SUCCESS: User details transaction completed'
        )

    
    #Access local data from a pre-populated db file from assets folder
    #Cordova device ready event
    document.addEventListener("deviceready", ->
        
        _.db = window.sqlitePlugin.openDatabase({name: "walnutapp"});

        console.log 'Local database object: '+_.db

        userDetailsTransaction(_.db)

    ,false)



    _.localDatabaseTransaction =(db)->

        db.transaction((tx)->

            tx.executeSql('CREATE TABLE IF NOT EXISTS '+_.getTblPrefix()+'training_logs 
                (id INTEGER PRIMARY KEY, division_id INTEGER, collection_id INTEGER
                , teacher_id INTEGER, date, status, sync INTEGER)')

            tx.executeSql('CREATE TABLE IF NOT EXISTS '+_.getTblPrefix()+'question_response 
                (ref_id, content_piece_id INTEGER, collection_id INTEGER, division INTEGER
                , question_response, time_taken, start_date, end_date, status, sync INTEGER)')

            tx.executeSql('CREATE TABLE IF NOT EXISTS '+_.getTblPrefix()+'question_response_logs 
                (qr_ref_id, start_time, sync INTEGER)')

            tx.executeSql('CREATE TABLE IF NOT EXISTS sync_details
                (id INTEGER PRIMARY KEY, type_of_operation, time_stamp)')
            
        ,_.transactionErrorHandler
        ,(tx)->
            console.log 'SUCCESS: Local db transaction completed'
        )