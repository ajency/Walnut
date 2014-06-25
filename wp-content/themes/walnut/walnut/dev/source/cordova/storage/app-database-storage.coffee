define ['underscore', 'jquery'], (_, $)->
    
    #SQLite database transaction based on HTML5 Web SQL database.

    _.mixin

        
        cordovaOpenPrepopulatedDatabase : ->

            _.db = window.sqlitePlugin.openDatabase({name: "synapseAppData"})

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
                    (qr_ref_id, meta_key, meta_value)')

                # tx.executeSql('CREATE TABLE IF NOT EXISTS wp_posts (ID INTEGER PRIMARY KEY, post_author INTEGER
                #     , post_date TEXT, post_date_gmt TEXT, post_content TEXT, post_title TEXT, post_excerpt TEXT
                #     , post_status TEXT, comment_status TEXT, ping_status TEXT, post_password TEXT
                #     , post_name TEXT, to_ping TEXT, pinged TEXT, post_modified TEXT, post_modified_gmt TEXT
                #     , post_content_filtered TEXT, post_parent INTEGER, guid TEXT, menu_order INTEGER
                #     , post_type TEXT, post_mime_type TEXT, comment_count INTEGER)')

                # tx.executeSql('CREATE TABLE IF NOT EXISTS wp_postmeta (meta_id INTEGER PRIMARY KEY
                #     , post_id INTEGER, meta_key TEXT,meta_value TEXT )')

                # tx.executeSql('CREATE TABLE IF NOT EXISTS wp_content_collection (id INTEGER PRIMARY KEY
                #     , name TEXT, created_on TEXT, created_by INTEGER, last_modified_on TEXT
                #     , last_modified_by INTEGER, published_on TEXT, published_by INTEGER, status TEXT
                #     , type TEXT, term_ids TEXT, duration INTEGER)')

                tx.executeSql('CREATE TABLE IF NOT EXISTS wp_collection_meta (id INTEGER PRIMARY KEY
                    , collection_id INTEGER, meta_key TEXT, meta_value TEXT)')

                
            ,_.transactionErrorHandler
            ,(tx)->
                console.log 'SUCCESS: createDataTables transaction completed'
            )