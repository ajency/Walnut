define ['app'
        'controllers/region-controller'
        'bootbox'
        'apps/quiz-modules/take-quiz-module/single-question/views'],
        (App, RegionController,bootbox)->

            App.module "TakeQuizApp.SingleQuestion", (SingleQuestion, App)->

                answer=null
                answerData= null

                class SingleQuestion.Controller extends RegionController

                    initialize: (opts)->
                        {@model, @quizModel, @questionResponseCollection,@display_mode} = opts

                        @questionResponseModel= @questionResponseCollection.findWhere 'content_piece_id' : @model.id
                        
                        displayAnswer = @quizModel.hasPermission 'display_answer'

                        @answerWreqrObject = new Backbone.Wreqr.RequestResponse()
                        @answerWreqrObject.options = 'displayAnswer': displayAnswer

                        @layout = layout = @_showSingleQuestionLayout @model

                        @answerModel = App.request "create:new:answer"

                        if @questionResponseModel
                            answerData = @questionResponseModel.get 'question_response'
                            answerData.status = @questionResponseModel.get 'status'
                            answerData.marks = @questionResponseModel.get 'marks_scored'                            
                            @answerModel = App.request "create:new:answer", answerData

                        @show layout,
                            loading: true

                        @listenTo layout, "show", @_showContentBoard @model,@answerWreqrObject
                        
                        @listenTo @region, "silent:save:question", =>
                            answerData= @answerWreqrObject.request "get:question:answer"

                            answer = answerData.answerModel

                            @answerWreqrObject.request "submit:answer"
                            answer_status = @_getAnswerStatus answer.get('marks'), answerData.totalMarks

                            answer.set 'status' : answer_status

                            if (answer.get('status') is 'wrong_answer') and _.toBool @quizModel.get 'negMarksEnable'
                                answer.set 'marks': - answerData.totalMarks*@quizModel.get('negMarks')/100

                            @region.trigger "submit:question", answer

                        @listenTo layout, "validate:answer",->
                            answerData= @answerWreqrObject.request "get:question:answer"

                            answer = answerData.answerModel

                            if answerData.questionType isnt 'sort'

                                switch answerData.emptyOrIncomplete

                                    when 'empty'        
                                        bootbox.confirm @quizModel.getMessageContent('submit_without_attempting'),(result)=>
                                            @_triggerSubmit() if result

                                    when 'incomplete'   
                                        bootbox.confirm @quizModel.getMessageContent('incomplete_answer'),(result)=>
                                            @_triggerSubmit() if result

                                    when 'complete'     then @_triggerSubmit()

                            else 
                                @_triggerSubmit()

                        @listenTo layout, "goto:next:question",->
                            @region.trigger "goto:next:question"

                        @listenTo layout, "goto:previous:question",
                            -> @region.trigger "goto:previous:question"

                        @listenTo layout, "skip:question",-> 

                            @answerModel.set 'status': 'skipped'

                            @region.trigger "skip:question", @answerModel

                        @listenTo layout, 'show:hint:dialog',=>
                            @answerModel.set 'hint_viewed' : true

                        @listenTo @region, 'trigger:submit',=> @_triggerSubmit()

                    _triggerSubmit:->
                        @layout.triggerMethod "submit:question"

                        if _.contains _.pluck(this.model.get('layout'),'element'),'BigAnswer'
                            answer.set 'status' : 'teacher_check'
                            
                        else
                            @answerWreqrObject.request "submit:answer"

                            answer.set 'status' : @_getAnswerStatus answer.get('marks'), answerData.totalMarks

                            if answer.get('status') is 'wrong_answer' and _.toBool @quizModel.get 'negMarksEnable'
                                answer.set 'marks': - answerData.totalMarks*@quizModel.get('negMarks')/100

                        @region.trigger "submit:question", answer

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
                                quizModel           : @quizModel
                            
                    _showSingleQuestionLayout: (model) =>
                        new SingleQuestion.SingleQuestionLayout
                            model: model
                            questionResponseModel   : @questionResponseModel
                            quizModel               : @quizModel
                            display_mode            : @display_mode