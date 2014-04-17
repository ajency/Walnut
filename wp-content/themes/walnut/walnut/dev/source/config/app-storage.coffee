define ['underscore', 'marionette', 'backbone','jquery'], (_, Marionette, Backbone, $)->
    
    #Access data from a pre-populated local db file
    _.db = window.sqlitePlugin.openDatabase({name: "walnutapp"});
    console.log 'Prepopulated DB Object: '+_.db

    #User database object
    _.userDb = window.openDatabase("UserDetails", "1.0", "User Details", 200000)

    _.userDb.transaction((tx)->
        tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY, username, password)')
        # tx.executeSql('INSERT INTO USERS (username, password) VALUES ("deepak", "deepak")')
        # tx.executeSql('INSERT INTO USERS (username, password) VALUES ("admin", "admin")')

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

