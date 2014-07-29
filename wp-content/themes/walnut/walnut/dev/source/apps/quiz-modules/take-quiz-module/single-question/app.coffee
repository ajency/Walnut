define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/take-quiz-module/single-question/views'
        'apps/content-preview/dialogs/hint-dialog/hint-dialog-controller'
        'apps/content-preview/dialogs/comment-dialog/comment-dialog-controller'],
        (App, RegionController)->

            App.module "TakeQuizApp.SingleQuestion", (SingleQuestion, App)->
                class SingleQuestion.Controller extends RegionController

                    initialize: (opts)->
                        {@model, questionResponseCollection} = opts

                        @answerWreqrObject = new Backbone.Wreqr.RequestResponse()

                        @layout = layout = @_showSingleQuestionLayout @model

                        @answerModel = App.request "create:new:answer"

                        questionResponseModel= questionResponseCollection.findWhere 'content_piece_id': @model.id 

                        if questionResponseModel
                            answerData = questionResponseModel.get('question_response')
                            @answerModel = App.request "create:new:answer", answerData

                        @show layout,
                            loading: true

                        @listenTo layout, "show", @_showContentBoard @model,@answerWreqrObject

                        @listenTo layout, "submit:question",->
                            answerData= @answerWreqrObject.request "get:question:answer"

                            answer = answerData.answerModel

                            answer.set 'status' : @_getAnswerStatus answer.get('marks'), answerData.totalMarks
                            
                            @region.trigger "submit:question", answer

                        @listenTo layout, "goto:next:question",->
                            @region.trigger "goto:next:question"

                        @listenTo layout, "goto:previous:question",
                            -> @region.trigger "goto:previous:question"

                        @listenTo layout, "skip:question",-> 

                            @answerModel.set 'status': 'skipped'

                            @region.trigger "skip:question", @answerModel

                        @listenTo layout, 'show:hint:dialog',(options)->
                            App.execute 'show:hint:dialog',
                                hint : options.hint

                        @listenTo layout,'show:comment:dialog',(options)->
                            App.execute 'show:comment:dialog',
                                comment : options.comment

                    _getAnswerStatus:(recievedMarks, totalMarks)->
                        status = 'wrong_answer'

                        if recievedMarks is totalMarks 
                            status = 'correct_answer' 

                        if recievedMarks > 0 and recievedMarks < totalMarks
                            status = 'partially_correct' 

                        status

                    _showContentBoard:(model,answerWreqrObject)=>
                        App.execute "show:content:board",
                                region              : @layout.contentBoardRegion,
                                model               : model
                                answerWreqrObject   : answerWreqrObject
                                answerModel         : @answerModel
                            
                    _showSingleQuestionLayout: (model) =>
                        new SingleQuestion.SingleQuestionLayout
                            model: model