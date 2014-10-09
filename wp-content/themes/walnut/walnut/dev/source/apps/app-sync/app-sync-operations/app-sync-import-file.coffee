define ['underscore', 'csvparse'], ( _) ->

    #File import

    _.mixin

        startFileImport : ->

            $('#syncSuccess').css("display","block").text("Starting file import...")

            setTimeout(=>
                _.insertIntoWpClassDivisions()
                # _.insertIntoWpQuizQuestionResponse()
            ,2000)


        
        parseCSVToJSON : (fileName)->

            readFile = ->
                $.Deferred (d)->
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fileSystem)->
                        fileSystem.root.getFile("SynapseAssets/SynapseData/"+fileName, {create: false}
                            , (fileEntry)->
                                fileEntry.file((file)->

                                    reader = new FileReader()
                                    reader.onloadend = (evt)->
                                        csvString = evt.target.result
                                        parsedObj = Papa.parse(csvString, {header : false, dynamicTyping : false})
                                        parsedData = parsedObj.data

                                        do(parsedData)->
                                            _.each parsedData, (outerRow, i)->
                                                _.each outerRow, (innerRow, j)->
                                                    # Replace back slash (/) with empty quote.
                                                    parsedData[i][j] = parsedData[i][j].replace(/\\/g,'')

                                        d.resolve parsedData

                                    reader.readAsText file

                                , _.fileErrorHandler)
                            , _.fileErrorHandler)
                    , _.fileSystemErrorHandler)

            $.when(readFile()).done ->
                console.log 'parseCSVToJSON done for file '+fileName
            .fail _.failureHandler



        # Insert data into 14 tables
        insertIntoWpClassDivisions : ->

            _.importingFileMessage 1

            getParsedData = _.parseCSVToJSON _.getTblPrefix()+'class_divisions.csv'
            getParsedData.done (data)->
                _.db.transaction((tx)->
                    tx.executeSql("DELETE FROM "+_.getTblPrefix()+"class_divisions")
                    
                    _.each data, (row, i)->
                        tx.executeSql("INSERT INTO "+_.getTblPrefix()+"class_divisions (id
                            , division, class_id) VALUES (?,?,?)"
                            , [row[0], row[1], row[2]])

                ,_.transactionErrorhandler
                ,(tx)->
                    console.log 'Inserted data in '+_.getTblPrefix()+'class_divisions'
                    _.insertIntoWpQuizQuestionResponse()
                )

        
        insertIntoWpQuizQuestionResponse : ->

            _.importingFileMessage 2

            getParsedData = _.parseCSVToJSON _.getTblPrefix()+'quiz_question_response.csv'
            getParsedData.done (data)->
                _.db.transaction((tx)->
                    tx.executeSql("DELETE FROM "+_.getTblPrefix()+"quiz_question_response")

                    _.each data, (row, i)->
                        tx.executeSql("INSERT INTO "+_.getTblPrefix()+"quiz_question_response (qr_id
                            , summary_id, content_piece_id, question_response, time_taken
                            , marks_scored, status, sync) VALUES (?,?,?,?,?,?,?,?)"
                            , [row[0], row[1], row[2], row[3], row[4], row[5], row[6], 1])

                ,_.transactionErrorhandler
                ,(tx)->
                    console.log 'Inserted data in '+_.getTblPrefix()+'quiz_question_response'
                    _.insertIntoWpQuizResponseSummary()
                )


        insertIntoWpQuizResponseSummary : ->

            _.importingFileMessage 3

            getParsedData = _.parseCSVToJSON _.getTblPrefix()+'quiz_response_summary.csv'
            getParsedData.done (data)->
                _.db.transaction((tx)->
                    tx.executeSql("DELETE FROM "+_.getTblPrefix()+"quiz_response_summary")

                    _.each data, (row, i)->
                        tx.executeSql("INSERT INTO "+_.getTblPrefix()+"quiz_response_summary 
                            (summary_id, collection_id, student_id, taken_on, quiz_meta, sync) 
                            VALUES (?,?,?,?,?,?)"
                            , [row[0], row[1], row[2], row[3], row[4], 1])

                ,_.transactionErrorhandler
                ,(tx)->
                    console.log 'Inserted data in '+_.getTblPrefix()+'quiz_response_summary'
                    _.insertIntoWpCollectionMeta()
                )

        
        insertIntoWpCollectionMeta : ->

            _.importingFileMessage 4

            getParsedData = _.parseCSVToJSON 'wp_collection_meta.csv'
            getParsedData.done (data)->
                _.db.transaction((tx)->

                    _.each data, (row, i)->
                        tx.executeSql("INSERT OR REPLACE INTO wp_collection_meta (id, collection_id
                            , meta_key, meta_value) VALUES (?,?,?,?)"
                            , [row[0], row[1], row[2], row[3]])

                ,_.transactionErrorhandler
                ,(tx)->
                    console.log 'Inserted data in wp_collection_meta'
                    _.insertIntoWpContentCollection()
                )

        
        insertIntoWpContentCollection : ->

            _.importingFileMessage 5

            getParsedData = _.parseCSVToJSON 'wp_content_collection.csv'
            getParsedData.done (data)->
                _.db.transaction((tx)->

                    _.each data, (row, i)->
                        tx.executeSql("INSERT OR REPLACE INTO wp_content_collection (id, name, created_on
                            , created_by, last_modified_on, last_modified_by, published_on, published_by
                            , post_status, type, term_ids, duration) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
                            , [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]
                            , row[9], row[10], row[11]])

                ,_.transactionErrorhandler
                ,(tx)->
                    console.log 'Inserted data in wp_content_collection'
                    _.insertIntoWpOptions()
                )


        insertIntoWpOptions : ->

            _.importingFileMessage 6

            getParsedData = _.parseCSVToJSON 'wp_options.csv'
            getParsedData.done (data)->
                _.db.transaction((tx)->
                    # tx.executeSql("DELETE FROM wp_options")

                    _.each data, (row, i)->
                        tx.executeSql("INSERT OR REPLACE INTO wp_options (option_id, option_name
                            , option_value, autoload) VALUES (?,?,?,?)"
                            , [row[0], row[1], row[2], row[3]])

                ,_.transactionErrorhandler
                ,(tx)->
                    console.log 'Inserted data in wp_options'
                    _.insertIntoWpPostMeta()
                )


        insertIntoWpPostMeta : ->

            _.importingFileMessage 7

            getParsedData = _.parseCSVToJSON 'wp_postmeta.csv'
            getParsedData.done (data)->

                splitArray = _.groupBy data, (element, index)->
                    Math.floor(index/2000)

                splitArray = _.toArray(splitArray);

                insertRecords = (splitData, index)->
                    _.db.transaction((tx)->

                        _.each splitData, (row, i)->
                            tx.executeSql("INSERT OR REPLACE INTO wp_postmeta (meta_id, post_id
                                , meta_key, meta_value) VALUES (?,?,?,?)"
                                , [row[0], row[1], row[2], row[3]])

                    ,_.transactionErrorHandler
                    ,(tx)->
                        console.log 'Inserted data in wp_postmeta'
                        index = index + 1
                        if index < splitArray.length
                            setTimeout(->
                                insertRecords(splitArray[index], index)
                            , 100)
                            
                        else
                            _.insertIntoWpPosts()
                    )
                
                insertRecords(splitArray[0], 0)


        insertIntoWpPosts : ->

            _.importingFileMessage 8

            getParsedData = _.parseCSVToJSON 'wp_posts.csv'
            getParsedData.done (data)->
                _.db.transaction((tx)->

                    _.each data, (row, i)->
                        tx.executeSql("INSERT OR REPLACE INTO wp_posts (ID, post_author, post_date
                            , post_date_gmt, post_content, post_title, post_excerpt, post_status
                            , comment_status, ping_status, post_password, post_name, to_ping, pinged
                            , post_modified, post_modified_gmt, post_content_filtered, post_parent
                            , guid, menu_order, post_type, post_mime_type, comment_count) 
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                            , [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]
                            , row[9], row[10], row[11], row[12], row[13], row[14], row[15], row[16]
                            , row[17], row[18], row[19], row[20], row[21], row[22]])
                        
                ,_.transactionErrorhandler
                ,(tx)->
                    console.log 'Inserted data in wp_posts'
                    _.insertIntoWpTermRelationships()
                )

        
        insertIntoWpTermRelationships : ->

            _.importingFileMessage 9

            getParsedData = _.parseCSVToJSON 'wp_term_relationships.csv'
            getParsedData.done (data)->
                _.db.transaction((tx)->
                    # tx.executeSql("DELETE FROM wp_term_relationships")

                    _.each data, (row, i)->
                        tx.executeSql("INSERT OR REPLACE INTO wp_term_relationships (object_id, term_taxonomy_id
                            , term_order) VALUES (?,?,?)", [row[0], row[1], row[2]])

                ,_.transactionErrorhandler
                ,(tx)->
                    console.log 'Inserted data in wp_term_relationships'
                    _.insertIntoWpTermTaxonomy()
                )


        insertIntoWpTermTaxonomy : ->

            _.importingFileMessage 10

            getParsedData = _.parseCSVToJSON 'wp_term_taxonomy.csv'
            getParsedData.done (data)->
                _.db.transaction((tx)->
                    # tx.executeSql("DELETE FROM wp_term_taxonomy")

                    _.each data, (row, i)->
                        tx.executeSql("INSERT OR REPLACE INTO wp_term_taxonomy (term_taxonomy_id, term_id, taxonomy
                            , description, parent, count) VALUES (?,?,?,?,?,?)"
                            , [row[0], row[1], row[2], row[3], row[4], row[5]])

                ,_.transactionErrorhandler
                ,(tx)->
                    console.log 'Inserted data in wp_term_taxonomy'
                    _.insertIntoWpTerms()
                )


        insertIntoWpTerms : ->

            _.importingFileMessage 11

            getParsedData = _.parseCSVToJSON 'wp_terms.csv'
            getParsedData.done (data)->
                _.db.transaction((tx)->
                    # tx.executeSql("DELETE FROM wp_terms")

                    _.each data, (row, i)->
                        tx.executeSql("INSERT OR REPLACE INTO wp_terms (term_id, name, slug, term_group) 
                            VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]])

                ,_.transactionErrorhandler
                ,(tx)=>
                    console.log 'Inserted data in wp_terms'
                    _.insertIntoWpTextbookRelationships()
                )


        insertIntoWpTextbookRelationships : ->

            _.importingFileMessage 12

            getParsedData = _.parseCSVToJSON 'wp_textbook_relationships.csv'
            getParsedData.done (data)->
                _.db.transaction((tx)->
                    # tx.executeSql("DELETE FROM wp_textbook_relationships")

                    _.each data, (row, i)->
                        tx.executeSql("INSERT OR REPLACE INTO wp_textbook_relationships 
                            (id, textbook_id, class_id, tags) VALUES (?,?,?,?)"
                            , [row[0], row[1], row[2], row[3]])

                ,_.transactionErrorhandler
                ,(tx)->
                    console.log 'Inserted data in wp_textbook_relationships'
                    _.insertIntoWpUserMeta()
                )


        insertIntoWpUserMeta : ->

            _.importingFileMessage 13

            getParsedData = _.parseCSVToJSON 'wp_usermeta.csv'
            getParsedData.done (data)->
                _.db.transaction((tx)->
                    # tx.executeSql("DELETE FROM wp_usermeta")

                    _.each data, (row, i)->
                        tx.executeSql("INSERT OR REPLACE INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) 
                            VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]])

                ,_.transactionErrorhandler
                ,(tx)->
                    console.log 'Inserted data in wp_usermeta'
                    _.insertIntoWpUsers()
                )


        insertIntoWpUsers : ->

            _.importingFileMessage 14

            getParsedData = _.parseCSVToJSON 'wp_users.csv'
            getParsedData.done (data)->
                _.db.transaction((tx)->
                    # tx.executeSql("DELETE FROM wp_users")

                    _.each data, (row, i)->
                        tx.executeSql("INSERT OR REPLACE INTO wp_users (ID, user_login, user_pass, user_nicename
                            , user_email, user_url, user_registered, user_activation_key, user_status
                            , display_name, spam,deleted) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
                            , [row[0], row[1], row[2], row[3], row[4], row[5]
                            , row[6], row[7], row[8], row[9], row[10], row[11]])

                ,_.transactionErrorhandler
                ,(tx)->
                    console.log 'Inserted data in wp_users'
                    _.onFileImportSuccess()
                )



        
        importingFileMessage : (file_number)->

            $('#syncSuccess').css("display","block").text("Importing files... ("+file_number+")")




        onFileImportSuccess : ->

            _.updateSyncDetails('file_import', _.getCurrentDateTime(2))

            _.clearSynapseDataDirectory()

            $('#syncSuccess').css("display","block").text("File import completed")

            setTimeout(=>
                $('#syncSuccess').css("display","block").text("Sync completed successfully")
                # App.execute "show:leftnavapp", region:App.leftNavRegion
                $('#main-menu-toggle').css('display','block')
            ,2000)

            setTimeout(=>
                App.navigate('students/dashboard', trigger: true)
            ,2000)
