define ['underscore', 'marionette', 'backbone','jquery'], (_, Marionette, Backbone, $)->
    
    #Access data from a pre-populated local db file
    _.db = window.sqlitePlugin.openDatabase({name: "walnutapp"});
    console.log 'Prepopulated DB Object: '+_.db
    _.db.transaction((tx)->
        # tx.executeSql('DROP TABLE IF EXISTS wp_training_logs')
        tx.executeSql('CREATE TABLE IF NOT EXISTS wp_training_logs (id INTEGER PRIMARY KEY, division_id INTEGER, collection_id INTEGER, teacher_id INTEGER, date, status)')
        
    ,(tx,err)->
        console.log 'Error: '+err
    
    ,(tx)->
        console.log 'Success: Pre-populated db transaction completed'
    )
    
    #User database object
    _.userDb = window.openDatabase("UserDetails", "1.0", "User Details", 200000)
    console.log 'User DB Object: '+_.userDb
    _.userDb.transaction((tx)->
        tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY, username, password, user_role)')
        # tx.executeSql('INSERT INTO USERS (username, password, user_role) VALUES ("admin", "admin", "administrator")')
        # tx.executeSql('INSERT INTO USERS (username, password, user_role) VALUES ("walnut", "walnut", "teacher")')
        
    ,(tx,err)->
        console.log 'Error: '+err
    
    ,(tx)->
        console.log 'Success: UserDetails transaction completed'
    )


    # window.requestFileSystem(LocalFileSystem.PERSISTENT, 0
    #     , (fileSystem)->
    #         entry = fileSystem.root
    #         console.log 'Root: '+entry.fullPath
    #         entry.getDirectory("TestApp", {create: true, exclusive: false}
    #             ,(dir)->
    #                 console.log 'Created directory: '+dir.name
    #             ,onFailure )
        
    #     ,onFailure)

    # onFailure = (err)->
    #     console.log 'Error: '+err.code

