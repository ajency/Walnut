define ["app", 'backbone'], (App, Backbone) ->
    App.module "Entities.QuestionResponse", (QuestionResponse, App, Backbone, Marionette, $, _)->


        # textbook model
        class QuestionResponseModel extends Backbone.Model

            idAttribute: 'ref_id'

            defaults:
                collection_id       : 0
                content_piece_id    : 0
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

                connection_resp = $.middle_layer(AJAXURL + '?action=update-question-response-logs'
                    ref_id: refID
                    (response) =>
                        if response.error
                            console.log 'some error occured while saving question logs for refID: '+refID
                );



        # request handler to get all responses
        App.reqres.setHandler "get:question:response:collection", (params) ->
            API.getAllQuestionResponses params

        App.reqres.setHandler "save:question:response", (qID)->
            API.saveQuestionResponse qID

        App.reqres.setHandler "update:question:response:logs", (refID)->
            API.updateQuestionResponseLogs refID

