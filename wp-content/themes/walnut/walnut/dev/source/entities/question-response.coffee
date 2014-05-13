define ["app", 'backbone', 'serialize'], (App, Backbone) ->
    App.module "Entities.QuestionResponse", (QuestionResponse, App, Backbone, Marionette, $, _)->


        # textbook model
        class QuestionResponseModel extends Backbone.Model

            idAttribute: 'ref_id'

            defaults:
                collection_id       : 0
                content_piece_id    : ''
                division            : 0
                question_response   : []
                time_taken          : 0
                start_date          : ''
                end_date            : ''
                status              : ''

            name: 'question-response'


        # textbooks collection class
        class QuestionResponseCollection extends Backbone.Collection
            model: QuestionResponseModel
            comparator: 'term_order'
            name: 'question-response'

            url: ->
                AJAXURL + '?action=get-question-response'

            parse: (resp)->
                @total = resp.count
                resp.data


        # API
        API =
        # get response collection
            getAllQuestionResponses: (param = {})->
                responseCollection = new QuestionResponseCollection
                responseCollection.fetch
                    reset: true
                    data: param

                responseCollection


            saveQuestionResponse: (data)->
                questionResponse = new QuestionResponseModel data

                questionResponse

            updateQuestionResponseLogs: (refID)->
                #refID refers to the unique reference ID of the question response model
                #this function logs the time whenever the teacher enters this particular question.
                options = 
                    url : AJAXURL + '?action=update-question-response-logs'
                    data : refID
                    success : (response) =>
                        if response.error
                            console.log 'some error occured while saving question logs for refID: '+refID

                connection_resp = App.request "get:auth:controller", options

                connection_resp.authenticate()


            # get question response from local database
            getQuestionResponseFromLocal:(collection_id, division)->

                runMainQuery = ->
                    $.Deferred (d)->
                        _.db.transaction (tx)->
                            tx.executeSql("SELECT * FROM wp_question_response WHERE collection_id=? AND division=?", [collection_id, division], onSuccess(d), _.deferredErrorHandler(d));
                    
                onSuccess =(d)->
                    (tx,data)->
                        result = []
                        i = 0
                        while i < data.rows.length
                            r = data.rows.item(i)

                            do(r, i)->
                                questionType = _.getQuestionType(r['content_piece_id'])
                                questionType.done (question_type)->
                                    if question_type is 'individual'
                                        q_resp = unserialize(r['question_response'])
                                    else q_resp = r['question_response']    

                                    result[i] = 
                                        id: r['id']
                                        content_piece_id: r['content_piece_id']
                                        collection_id: r['collection_id']
                                        division: r['division']
                                        date_created: r['date_created']
                                        date_modified: r['date_modified']
                                        total_time: r['total_time']
                                        question_response: q_resp
                                        time_started: r['time_started']
                                        time_completed: r['time_completed']

                            i++ 
        
                        d.resolve(result)           

                $.when(runMainQuery()).done (data)->
                    console.log 'getQuestionResponseFromLocal transaction completed'
                .fail _.failureHandler
                
                
            saveQuestionResponseLocal:(p)->
                #function to insert record in wp_question_response
                insertQuestionResponse =(data)->
                    _.db.transaction( (tx)->
                        tx.executeSql("INSERT INTO wp_question_response (content_piece_id, collection_id, division, date_created, date_modified, total_time, question_response, time_started, time_completed) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [data.content_piece_id, data.collection_id, data.division, data.date_created, data.date_modified, data.total_time, data.question_response, data.time_started, data.time_completed])
                            
                    ,_.transactionErrorHandler
                    ,(tx)->
                        console.log 'Success: Inserted new record in wp_question_response'
                    )


                #function to update record in wp_question_response
                updateQuestionResponse =(data)->
                    _.db.transaction( (tx)->
                        tx.executeSql("UPDATE wp_question_response SET date_modified=?, question_response=? 
                            WHERE id=?", [data.date_modified, data.question_response, data.id])
                            
                    ,_.transactionErrorHandler
                    ,(tx)->
                        console.log 'Success: Updated record in wp_question_response'
                    )
                        

                questionType = _.getQuestionType(p.content_piece_id)
                questionType.done (question_type)->
                    if question_type is 'individual'
                        q_resp = serialize(p.question_response)
                    else q_resp = p.question_response    

                    if typeof p.id is 'undefined'
                        insertData =
                            collection_id: p.collection_id
                            content_piece_id: p.content_piece_id
                            division: p.division
                            date_created: _.getCurrentDate()
                            date_modified: _.getCurrentDate()
                            total_time: 0
                            question_response: q_resp
                            time_started: ''
                            time_completed: ''
                            
                        insertQuestionResponse(insertData)  

                    else 
                        updateData =
                            id: p.id
                            date_modified: _.getCurrentDate()
                            question_response: q_resp

                        updateQuestionResponse(updateData)        



        # request handler to get all responses
        App.reqres.setHandler "get:question:response:collection", (params) ->
            API.getAllQuestionResponses params

        App.reqres.setHandler "save:question:response", (qID)->
            API.saveQuestionResponse qID

        App.reqres.setHandler "update:question:response:logs", (refID)->
            API.updateQuestionResponseLogs refID

        # request handler to get all responses from local database
        App.reqres.setHandler "get:question-response:local", (collection_id, division)->
            API.getQuestionResponseFromLocal collection_id, division

        App.reqres.setHandler "save:question-response:local", (params)->
            API.saveQuestionResponseLocal params    

