define ['underscore', 'marionette', 'backbone','jquery'], (_, Marionette, Backbone, $)->
    
    #Local database transaction
    localDatabaseTransaction =(db)->
        console.log 'Local database object: '+db
        db.transaction((tx)->
            #User table
            tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY, user_id UNIQUE, username, password, user_role)')

            # tx.executeSql('DROP TABLE IF EXISTS wp_training_logs')
            tx.executeSql('CREATE TABLE IF NOT EXISTS wp_training_logs (id INTEGER PRIMARY KEY, division_id INTEGER, collection_id INTEGER, teacher_id INTEGER, date, status)')

            # tx.executeSql('DROP TABLE IF EXISTS wp_question_response')
            tx.executeSql('CREATE TABLE IF NOT EXISTS wp_question_response (ref_id, content_piece_id INTEGER, collection_id INTEGER, division INTEGER, question_response, time_taken, start_date, end_date, status)')

            tx.executeSql('CREATE TABLE IF NOT EXISTS wp_question_response_logs (qr_ref_id, start_time)')
            
        ,_.transactionErrorHandler
        ,(tx)->
            console.log 'SUCCESS: Local db transaction completed'
        )

    #Access data from a local db file
    document.addEventListener("deviceready", ->
        
        _.db = window.sqlitePlugin.openDatabase({name: "walnutapp"});
        localDatabaseTransaction(_.db)

    ,false)


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

    # save/get school logo image source
    _.setSchoolLogoSrc =(src)->
        window.localStorage.setItem("school_logo_src", ""+src)

    _.getSchoolLogoSrc =->
        window.localStorage.getItem("school_logo_src")


    #Cordova File system API 
    # download school logo
    _.downloadSchoolLogo =(logo_url)->

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
            ,(fileSystem)->
                fileSystem.root.getFile("logo.jpg", {create: true, exclusive:false} 
                    ,(fileEntry)->
                        filePath = fileEntry.toURL().replace("logo.jpg", "")
                        fileEntry.remove()
                        uri = encodeURI(logo_url)

                        fileTransfer = new FileTransfer()
                        fileTransfer.download(uri, filePath+"logo.jpg" 
                            ,(file)->
                                console.log 'School logo download successful'
                                console.log 'Logo file source: '+file.toURL()
                                _.setSchoolLogoSrc(file.toURL())

                            ,_.fileTransferErrorHandler, true)
                    
                    ,_.fileErrorHandler)

            ,_.fileSystemErrorHandler)


         
            
            