define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/take-quiz-module/quiz-description/app'
        'apps/quiz-modules/take-quiz-module/quiz-progress/app'
        'apps/quiz-modules/take-quiz-module/quiz-timer/app'
        'apps/quiz-modules/take-quiz-module/single-question/app'
        'apps/popup-dialog/alerts'], (App, RegionController)->

        App.module "TakeQuizApp", (View, App)->

            #Single Question description and answers
            quizModel = null
            quizResponseSummary = null
            questionsCollection = null
            questionResponseModel = null
            questionModel = null
            questionIDs = null
            timeBeforeCurrentQuestion = null

            class View.TakeQuizController extends RegionController

                initialize : (opts)->
                    {quizModel,quizResponseSummary,questionsCollection,
                    @questionResponseCollection,@textbookNames,@display_mode} = opts

                    if quizResponseSummary.isNew() and quizModel.get('quiz_type') is 'test'

                        quizResponseSummary.save 'status' : 'started'

                    if quizModel.get('quiz_type') is 'practice'
                        quizResponseSummary.save 'attempts' : quizModel.get('attempts')+1

                    @_startTakeQuiz()
                
                _startTakeQuiz:=>

                    if not @questionResponseCollection
                        @questionResponseCollection= App.request "create:empty:question:response:collection"
                        timeBeforeCurrentQuestion = 0

                    App.leftNavRegion.close()
                    App.headerRegion.close()
                    App.breadcrumbRegion.close()

                    questionIDs = questionsCollection.pluck 'ID'
                    questionIDs= _.map questionIDs, (m)-> parseInt m

                    pausedQuestion= @questionResponseCollection.findWhere 'status': 'paused'

                    if pausedQuestion 
                        questionID = pausedQuestion.get 'content_piece_id'

                    else
                        questionID = _.first questionIDs

                    questionModel = questionsCollection.get questionID
                    @layout = layout = new TakeQuizLayout

                    @show @layout,
                        loading : true

                    @timerObject = new Backbone.Wreqr.RequestResponse()

                    @listenTo @layout, "show", @_showQuizViews

                    @listenTo @layout.questionDisplayRegion, "goto:next:question", @_gotoNextQuestion

                    @listenTo @layout.questionDisplayRegion, "submit:question", @_submitQuestion

                    @listenTo @layout.questionDisplayRegion, "goto:previous:question", @_gotoPreviousQuestion

                    @listenTo @layout.questionDisplayRegion, "skip:question", @_skipQuestion

                    @listenTo @layout.questionDisplayRegion, "show:alert:popup", @_showPopup

                    @listenTo @layout.quizTimerRegion, "show:alert:popup", @_showPopup
                    @listenTo @layout.quizTimerRegion, "end:quiz", @_endQuiz

                    @listenTo @layout.quizProgressRegion, "change:question", @_changeQuestion

                    @listenTo App.dialogRegion, "clicked:confirm:yes", @_handlePopups
                    @listenTo App.dialogRegion, "clicked:alert:ok", @_handlePopups


                    setInterval =>
                        @_autosaveQuestionTime()
                    ,30000

                _autosaveQuestionTime:=>
                     if quizModel.get('quiz_type') is 'test'

                        questionResponseModel = @questionResponseCollection.findWhere 'content_piece_id': questionModel.id
                            
                        if (not questionResponseModel) or questionResponseModel.get('status') in ['not_started','paused']

                            console.log(questionResponseModel.get('status')) if questionResponseModel

                            totalTime =@timerObject.request "get:elapsed:time"
                            timeTaken= totalTime - timeBeforeCurrentQuestion

                            data =
                                'summary_id'     : quizResponseSummary.id
                                'content_piece_id'  : questionModel.id
                                'question_response' : []
                                'status'            : 'paused'
                                'marks_scored'      : 0
                                'time_taken'        : timeTaken

                            questionResponseModel = App.request "create:quiz:question:response:model", data

                            @_saveQuizResponseModel questionResponseModel

                _changeQuestion:(id)->
                    #save results here of previous question / skip the question
                    questionModel = questionsCollection.get id
                    @_showSingleQuestionApp questionModel


                _submitQuestion:(answer)->
                    #save results here

                    totalTime =@timerObject.request "get:elapsed:time"
                    timeTaken= totalTime - timeBeforeCurrentQuestion
                    timeBeforeCurrentQuestion= totalTime

                    data =
                        'summary_id'     : quizResponseSummary.id
                        'content_piece_id'  : questionModel.id
                        'question_response' : answer.toJSON()
                        'status'            : answer.get 'status'
                        'marks_scored'      : answer.get 'marks'
                        'time_taken'        : timeTaken

                    newResponseModel = App.request "create:quiz:question:response:model", data

                    @_saveQuizResponseModel newResponseModel

                _saveQuizResponseModel:(newResponseModel)=>

                    quizResponseModel = @questionResponseCollection.findWhere 'content_piece_id' : newResponseModel.get 'content_piece_id'

                    #update existing model (incase of resubmit)
                    if quizResponseModel
                        quizResponseModel.set newResponseModel.toJSON()

                    #add new model to collection
                    else
                        quizResponseModel = newResponseModel
                        @questionResponseCollection.add newResponseModel

                    quizResponseModel.save() if quizModel.get('quiz_type') is 'test'

                    if quizResponseModel.get('status') isnt 'paused'
                        @layout.quizProgressRegion.trigger "question:submitted", quizResponseModel

                _skipQuestion:(answer)->
                    #save skipped status
                    @_submitQuestion answer
                    @_gotoNextQuestion()

                _gotoNextQuestion:->

                    nextQuestionID = @_getNextItemID() if questionModel?

                    if nextQuestionID
                        questionModel= questionsCollection.get nextQuestionID
                        @_showSingleQuestionApp questionModel

                    else
                        @_endQuiz()

                _showPopup:(message_type, alert_type='confirm')->
                    if message_type is 'end_quiz' and _.isEmpty @_getUnansweredIDs()
                        @_endQuiz()
                        return false

                    if message_type in ['hint','comment']
                        message_content = questionModel.get message_type

                    else 
                        message_content = quizModel.getMessageContent message_type

                    App.execute 'show:alert:popup',
                        region : App.dialogRegion
                        message_content: message_content
                        alert_type: alert_type
                        message_type: message_type

                _endQuiz:->
                    if @display_mode isnt 'replay'
                        @layout.questionDisplayRegion.trigger "silent:save:question"

                    unanswered = @_getUnansweredIDs()

                    if unanswered
                        _.each unanswered, (question,index)=>
                            questionModel = questionsCollection.get question
                            answerModel = App.request "create:new:answer"
                            if quizModel.hasPermission 'allow_skip'
                                answerModel.set 'status': 'skipped'
                            else
                                answerModel.set 'status': 'wrong_answer'

                            @_submitQuestion answerModel

                    quizResponseSummary.set 
                        'status'            : 'completed' 
                        'total_time_taken'  : timeBeforeCurrentQuestion
                        'num_skipped'       : _.size @questionResponseCollection.where 'status': 'skipped'
                        'total_marks_scored': _.reduce @questionResponseCollection.pluck('marks_scored'), (memo, num)->
                            _.toNumber memo + num,1

                    quizResponseSummary.save() if quizModel.get('quiz_type') is 'test'

                    App.execute "show:single:quiz:app",
                        region                      : App.mainContentRegion
                        quizModel                   : quizModel
                        questionsCollection         : questionsCollection
                        questionResponseCollection  : @questionResponseCollection
                        quizResponseSummary         : quizResponseSummary

                _getUnansweredIDs:->
                    
                    pausedModel = @questionResponseCollection.findWhere 'status': 'paused'

                    answeredIDs= @questionResponseCollection.pluck 'content_piece_id'

                    if pausedModel
                        answeredIDs = _.without answeredIDs, pausedModel.get 'content_piece_id'
                        
                    allIDs= _.map quizModel.get('content_pieces'), (m)-> parseInt m

                    unanswered= _.difference allIDs, answeredIDs

                _gotoPreviousQuestion:->

                    prevQuestionID = @_getPrevItemID() if questionModel?

                    if prevQuestionID
                        questionModel= questionsCollection.get prevQuestionID
                        @_showSingleQuestionApp questionModel

                _getNextItemID : ->
                    pieceIndex = _.indexOf(questionIDs, questionModel.id)
                    nextIndex = pieceIndex + 1

                    if nextIndex < questionIDs.length
                        nextID = parseInt questionIDs[nextIndex]

                    else 
                        unanswered = @_getUnansweredIDs()
                        nextID= _.first _.intersection questionIDs,unanswered if unanswered


                    nextID

                _getPrevItemID : ->
                    pieceIndex = _.indexOf(questionIDs, questionModel.id)
                    prevID = parseInt questionIDs[pieceIndex - 1] if pieceIndex>0


                _showSingleQuestionApp:->
                    if questionModel
                        new View.SingleQuestion.Controller
                            region                  : @layout.questionDisplayRegion
                            model                   : questionModel
                            quizModel               : quizModel
                            questionResponseCollection   : @questionResponseCollection
                            display_mode            : @display_mode

                        @layout.quizProgressRegion.trigger "question:changed", questionModel
                        @layout.quizDescriptionRegion.trigger "question:changed", questionModel

                _showQuizViews:->
                    new View.QuizDescription.Controller
                        region          : @layout.quizDescriptionRegion
                        model           : quizModel
                        currentQuestion : questionModel
                        textbookNames   : @textbookNames

                    new View.QuizProgress.Controller
                        region: @layout.quizProgressRegion
                        questionsCollection         : questionsCollection
                        currentQuestion             : questionModel
                        quizModel                   : quizModel
                        questionResponseCollection  : @questionResponseCollection

                    new View.QuizTimer.Controller
                        region      : @layout.quizTimerRegion
                        model       : quizModel
                        display_mode: @display_mode
                        timerObject : @timerObject
                        quizResponseSummary         : quizResponseSummary

                    @_showSingleQuestionApp questionModel

                #after confirm box yes is clicked on dialog region
                _handlePopups:(message_type)->
                    switch message_type
                        when 'end_quiz' then @_endQuiz()
                        when 'quiz_time_up' then @_endQuiz()
                        when 'submit_without_attempting' then @layout.questionDisplayRegion.trigger "trigger:submit"
                        when 'incomplete_answer'   then  @layout.questionDisplayRegion.trigger "trigger:submit"

            class TakeQuizLayout extends Marionette.Layout

                template : '<div id="quiz-description-region"></div>
                                            <div class="sidebarContainer">
                                                <div id="quiz-timer-region"></div>
                                                <div id="quiz-progress-region"></div>
                                            </div>
                                            <div id="question-display-region"></div>'

                regions :
                    quizDescriptionRegion : '#quiz-description-region'
                    quizTimerRegion : '#quiz-timer-region'
                    quizProgressRegion : '#quiz-progress-region'
                    questionDisplayRegion : '#question-display-region'

                className: 'content'

                onShow : ->
                    $('.page-content').addClass 'condensed expand-page'

            # set handlers
            App.commands.setHandler "start:take:quiz:app", (opt = {})->
                new View.TakeQuizController opt
        


