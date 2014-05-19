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

                if _.platform() is 'BROWSER'
                    connection_resp.authenticate()

                else
                    # changes for mobile
                    _.updateQuestionResponseLogs(refID)    


            # get question response from local database
            getQuestionResponseFromLocal:(collection_id, division)->

                runMainQuery = ->
                    $.Deferred (d)->
                        _.db.transaction (tx)->
                            tx.executeSql("SELECT * FROM wp_question_response WHERE collection_id=? AND division=?", [collection_id, division], onSuccess(d), _.deferredErrorHandler(d));
                    
                onSuccess =(d)->
                    (tx,data)->
                        result = []

                        for i in [0..data.rows.length-1] by 1
                            
                            r = data.rows.item(i)

                            do(r, i)->
                                questionType = _.getQuestionType(r['content_piece_id'])
                                questionType.done (question_type)->
                                    if question_type is 'individual'
                                        q_resp = unserialize(r['question_response'])
                                    else q_resp = r['question_response'] 

                                    result[i] = 
                                        ref_id: r['ref_id']
                                        content_piece_id: r['content_piece_id']
                                        collection_id: r['collection_id']
                                        division: r['division']
                                        question_response: q_resp
                                        time_taken: r['time_taken']
                                        start_date: r['start_date']
                                        end_date: r['end_date']
                                        status: r['status']
        
                        d.resolve(result)           

                $.when(runMainQuery()).done (data)->
                    console.log 'getQuestionResponseFromLocal transaction completed'
                .fail _.failureHandler
                
            
            # save/update question_response and question_response_logs to local database    
            saveUpdateQuestionResponseLocal:(model)->

                insert_question_response =(q_resp) ->

                    ref_id = 'CP'+model.get('content_piece_id')+'C'+model.get('collection_id')+'D'+model.get('division')

                    _.db.transaction((tx)->
                        tx.executeSql('INSERT INTO wp_question_response (ref_id, content_piece_id, collection_id, division, question_response, time_taken, start_date, end_date, status, sync) 
                            VALUES (?,?,?,?,?,?,?,?,?,?)', [ref_id, model.get('content_piece_id'), model.get('collection_id'), model.get('division'), q_resp, model.get('time_taken'), _.getCurrentDateTime(0), model.get('end_date'), 'started', 0])

                    ,_.transactionErrorHandler
                    ,(tx)->
                        console.log 'SUCCESS: Inserted record in wp_question_response'
                    )

                    # update question_response_logs
                    _.updateQuestionResponseLogs(ref_id)

                    # pass ref_id to model
                    model.set 'ref_id': ref_id

                
                update_question_response =(q_resp) ->

                        status = model.get('status')
                        status = 'completed' if (model.get('status')) isnt 'paused'

                        end_date = model.get('end_date')
                        if status is 'completed'
                            end_date = _.getCurrentDateTime(0)

                        _.db.transaction((tx)->
                            tx.executeSql('UPDATE wp_question_response SET question_response=?, time_taken=?, status=?, end_date=?
                                WHERE ref_id=?', [q_resp, model.get('time_taken'), status, end_date, model.get('ref_id')])

                        ,_.transactionErrorHandler
                        ,(tx)->
                            console.log 'SUCCESS: Updated record in wp_question_response'
                        )     
                        

                questionType = _.getQuestionType(model.get('content_piece_id'))
                questionType.done (question_type)->
                    if question_type is 'individual'
                        q_resp = serialize(model.get('question_response'))
                    else
                        q_resp = model.get('question_response')

                    if model.has('ref_id')
                        # update record in wp_question_response
                        update_question_response(q_resp)

                    else
                        # insert new record in wp_question_response
                        insert_question_response(q_resp)   



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

        App.reqres.setHandler "save:question-response:local", (model)->
            API.saveUpdateQuestionResponseLocal model    

