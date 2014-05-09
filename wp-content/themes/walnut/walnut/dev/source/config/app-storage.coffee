define ['underscore', 'marionette', 'backbone','jquery'], (_, Marionette, Backbone, $)->
    
    #Pre-populated database transaction
    prepopulatedDatabaseTransaction =(db)->
        console.log 'Pre-populated DB Object: '+db
        db.transaction((tx)->
            # tx.executeSql('DROP TABLE IF EXISTS wp_training_logs')
            tx.executeSql('CREATE TABLE IF NOT EXISTS wp_training_logs (id INTEGER PRIMARY KEY, division_id INTEGER, collection_id INTEGER, teacher_id INTEGER, date, status)')

            # tx.executeSql('DROP TABLE IF EXISTS wp_question_response')
            tx.executeSql('CREATE TABLE IF NOT EXISTS wp_question_response (id INTEGER PRIMARY KEY, content_piece_id INTEGER, collection_id INTEGER, division INTEGER, date_created, date_modified, total_time, question_response, time_started, time_completed)')
            
        ,_.transactionErrorHandler
        ,(tx)->
            console.log 'Success: Pre-populated db transaction completed'
        )

    #User database transaction    
    userDatabaseTransaction =(db)->
        console.log 'User DB Object: '+db
        db.transaction((tx)->
            tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY, user_id UNIQUE, username, password, user_role)')
            # tx.executeSql('INSERT INTO USERS (user_id, username, password, user_role) VALUES ("", "walnut", "walnut", "teacher")')
            
        ,_.transactionErrorHandler
        ,(tx)->
            console.log 'Success: UserDetails transaction completed'
        )
        

    #Access data from a pre-populated local db file
    _.db = window.sqlitePlugin.openDatabase({name: "walnutapp"});
    prepopulatedDatabaseTransaction(_.db)
    
    #User database having details of logged in users
    _.userDb = window.openDatabase("UserDetails", "1.0", "User Details", 200000)
    userDatabaseTransaction(_.userDb)


    #Save logged in user id