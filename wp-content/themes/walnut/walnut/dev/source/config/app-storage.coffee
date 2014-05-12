define ['underscore', 'marionette', 'backbone','jquery'], (_, Marionette, Backbone, $)->
    
    #Local database transaction
    localDatabaseTransaction =(db)->
        console.log 'Local database Object: '+db
        db.transaction((tx)->
            #User table
            tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY, user_id UNIQUE, username, password, user_role)')

            # tx.executeSql('DROP TABLE IF EXISTS wp_training_logs')
            tx.executeSql('CREATE TABLE IF NOT EXISTS wp_training_logs (id INTEGER PRIMARY KEY, division_id INTEGER, collection_id INTEGER, teacher_id INTEGER, date, status)')

            # tx.executeSql('DROP TABLE IF EXISTS wp_question_response')
            tx.executeSql('CREATE TABLE IF NOT EXISTS wp_question_response (id INTEGER PRIMARY KEY, content_piece_id INTEGER, collection_id INTEGER, division INTEGER, date_created, date_modified, total_time, question_response, time_started, time_completed)')
            
        ,_.transactionErrorHandler
        ,(tx)->
            console.log 'Success: Local db transaction completed'
        )

     #Access data from a local db file
    _.db = window.sqlitePlugin.openDatabase({name: "walnutapp"});
    localDatabaseTransaction(_.db) 


    #Local storage
    # save/get login status
    _.setLoginStatus =(status)->
        window.localStorage.setItem("user_login_status", ""+status)

    _.getLoginStatus =->
        window.localStorage.getItem("user_login_status")

    # save/get blog id
    _.setBlogID =(id)->
        window.localStorage.setItem("blog_id", ""+id)

    _.getBlogID =->
        window.localStorage.getItem("blog_id")

    # save/get blog name
    _.setBlogName =(name)->
        window.localStorage.setItem("blog_name", ""+name)

    _.getBlogName =->
        window.localStorage.getItem("blog_name")



    #Cordova File system API 
         
            
            