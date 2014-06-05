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

            tx.executeSql('CREATE TABLE IF NOT EXISTS '+_.getTblPrefix()+'question_response 
                (ref_id, teacher_id INTEGER, content_piece_id INTEGER, collection_id INTEGER
                , division INTEGER, question_response, time_taken, start_date, end_date, status
                , sync INTEGER)')
           

            tx.executeSql('CREATE TABLE IF NOT EXISTS sync_details
                (id INTEGER PRIMARY KEY, type_of_operation, time_stamp)')
            
<<<<<<< HEAD
            # if _.getDeleteDataFromTablesFlag() is null
            #     tx.executeSql("DELETE FROM "+_.getTblPrefix()+"class_divisions")
            #     tx.executeSql("DELETE FROM "+_.getTblPrefix()+"question_response")
            #     tx.executeSql("DELETE FROM "+_.getTblPrefix()+"question_response_logs")
            #     tx.executeSql("DELETE FROM "+_.getTblPrefix()+"training_logs")
            #     tx.executeSql("DELETE FROM wp_collection_meta")
            #     tx.executeSql("DELETE FROM wp_content_collection")
            #     tx.executeSql("DELETE FROM wp_options")
            #     tx.executeSql("DELETE FROM wp_postmeta")
            #     tx.executeSql("DELETE FROM wp_posts")
            #     tx.executeSql("DELETE FROM wp_term_relationships")
            #     tx.executeSql("DELETE FROM wp_term_taxonomy")
            #     tx.executeSql("DELETE FROM wp_terms")
            #     tx.executeSql("DELETE FROM wp_textbook_relationships")
            #     tx.executeSql("DELETE FROM wp_usermeta")
            #     tx.executeSql("DELETE FROM wp_users")
=======
            
            # tx.executeSql("DELETE FROM "+_.getTblPrefix()+"class_divisions")
            # tx.executeSql("DELETE FROM "+_.getTblPrefix()+"question_response")
            # tx.executeSql("DELETE FROM wp_collection_meta")
            # tx.executeSql("DELETE FROM wp_content_collection")
            # tx.executeSql("DELETE FROM wp_options")
            # tx.executeSql("DELETE FROM wp_postmeta")
            # tx.executeSql("DELETE FROM wp_posts")
            # tx.executeSql("DELETE FROM wp_term_relationships")
            # tx.executeSql("DELETE FROM wp_term_taxonomy")
            # tx.executeSql("DELETE FROM wp_terms")
            # tx.executeSql("DELETE FROM wp_textbook_relationships")
            # tx.executeSql("DELETE FROM wp_usermeta")
            # tx.executeSql("DELETE FROM wp_users")
>>>>>>> f54144cfc34981166da4e7e453fa9684748241c0
            
        ,_.transactionErrorHandler
        ,(tx)->
            console.log 'SUCCESS: Local db transaction completed'
        )