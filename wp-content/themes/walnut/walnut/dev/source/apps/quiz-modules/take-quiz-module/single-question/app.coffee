define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/take-quiz-module/single-question/views'
        'apps/content-preview/dialogs/hint-dialog/hint-dialog-controller'
        'apps/content-preview/dialogs/comment-dialog/comment-dialog-controller'],
        (App, RegionController)->

            App.module "TakeQuizApp.SingleQuestion", (SingleQuestion, App)->

                answer=null

                class SingleQuestion.Controller extends RegionController

                    initialize: (opts)->
                        {@model, @quizModel, @questionResponseCollection,@display_mode} = opts

                        @questionResponseModel= @questionResponseCollection.findWhere 'content_piece_id' : @model.id

                        @answerWreqrObject = new Backbone.Wreqr.RequestResponse()

                        @layout = layout = @_showSingleQuestionLayout @model

                        @answerModel = App.request "create:new:answer"

                        if @questionResponseModel
                            answerData = @questionResponseModel.get('question_response')
                            @answerModel = App.request "create:new:answer", answerData

                        @show layout,
                            loading: true

                        @listenTo layout, "show", @_showContentBoard @model,@answerWreqrObject

                        @listenTo layout, "validate:answer",->
                            answerData= @answerWreqrObject.request "get:question:answer"

                            answer = answerData.answerModel

                            isEmptyAnswer= _.isEmpty _.compact answer.get 'answer'

                            isEmptyAnswer= false if answerData.questionType is 'sort'

                            @layout.triggerMethod "answer:validated", isEmptyAnswer

                        @listenTo layout, "submit:question",=>

                            #displayAnswer true or false based on permission
                            displayAnswer = @quizModel.hasPermission 'display_answer'

                            @answerWreqrObject.request "submit:answer", displayAnswer

                            answer.set 'status' : @_getAnswerStatus answer.get('marks'), answerData.totalMarks

                            console.log answer
                            @region.trigger "submit:question", answer

                        @listenTo layout, "goto:next:question",->
                            @region.trigger "goto:next:question"

                        @listenTo layout, "goto:previous:question",
                            -> @region.trigger "goto:previous:question"

                        @listenTo layout, "skip:question",-> 

                            @answerModel.set 'status': 'skipped'

                            @region.trigger "skip:question", @answerModel

                        @listenTo layout, 'show:hint:dialog',=>
                            App.execute 'show:hint:dialog',
                                hint : @model.get 'hint'

                        @listenTo layout,'show:comment:dialog',=>
                            App.execute 'show:comment:dialog',
                                comment : @model.get 'comment'

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
                            questionResponseModel   : @questionResponseModel
                            quizModel               : @quizModel
                            display_mode            : @display_mode