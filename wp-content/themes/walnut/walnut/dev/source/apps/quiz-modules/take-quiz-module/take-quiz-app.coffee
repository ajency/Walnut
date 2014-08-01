define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/take-quiz-module/quiz-description/app'
        'apps/quiz-modules/take-quiz-module/quiz-progress/app'
        'apps/quiz-modules/take-quiz-module/quiz-timer/app'
        'apps/quiz-modules/take-quiz-module/single-question/app'], (App, RegionController)->

        App.module "TakeQuizApp", (View, App)->

            #Single Question description and answers
            quizModel = null
            questionsCollection = null
            questionResponseCollection = null
            questionResponseModel = null
            questionModel = null
            questionIDs = null
            textbookNames = null

            class View.TakeQuizController extends RegionController

                initialize : (opts)->
                    {quizModel,questionsCollection,questionResponseCollection,textbookNames} = opts

                    @display_mode = 'quiz_mode'

                    App.leftNavRegion.close()
                    App.headerRegion.close()
                    App.breadcrumbRegion.close()

                    #App.execute "when:fetched", [questionModel], =>
                        #checking if model exists in collection. if so, replacing the empty model
                        #@_getOrCreateModel questionModel.get 'ID'

                    questionIDs = questionsCollection.pluck 'ID'
                    questionIDs= _.map questionIDs, (m)-> parseInt m

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

                    @listenTo @layout.quizTimerRegion, "end:quiz", @_endQuiz

                    @listenTo @layout.quizProgressRegion, "change:question", @_changeQuestion

                _changeQuestion:(id)->
                    #save results here of previous question / skip the question
                    questionModel = questionsCollection.get id
                    @_showSingleQuestionApp questionModel


                _submitQuestion:(answer)->
                    #save results here

                    data = 
                        'collection_id'     : quizModel.id
                        'content_piece_id'  : questionModel.id
                        'question_response' : answer.toJSON()
                    
                    newResponseModel = App.request "create:quiz:response:model", data

                    quizResponseModel = questionResponseCollection.findWhere 'content_piece_id' : newResponseModel.get 'content_piece_id'
                    
                    if quizResponseModel
                        console.log 'update model'
                        quizResponseModel.set newResponseModel.toJSON()
                    else 
                        console.log 'new model'
                        quizResponseModel = newResponseModel
                        questionResponseCollection.add newResponseModel

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

                _endQuiz:->
                    App.execute "show:single:quiz:app",
                        region: App.mainContentRegion
                        quizModel: quizModel
                        questionsCollection: questionsCollection
                        questionResponseCollection: questionResponseCollection
                    

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

                    nextID

                _getPrevItemID : ->
                    pieceIndex = _.indexOf(questionIDs, questionModel.id)
                    prevID = parseInt questionIDs[pieceIndex - 1] if pieceIndex>0


                _showSingleQuestionApp:->
                    
                    if questionModel
                        new View.SingleQuestion.Controller
                            region                  : @layout.questionDisplayRegion
                            model                   : questionModel
                            questionResponseCollection   : questionResponseCollection

                        @layout.quizProgressRegion.trigger "question:changed", questionModel
                        @layout.quizDescriptionRegion.trigger "question:changed", questionModel

                _showQuizViews:->

                    new View.QuizDescription.Controller
                        region: @layout.quizDescriptionRegion
                        model: quizModel
                        currentQuestion: questionModel
                        textbookNames: textbookNames

                    new View.QuizProgress.Controller
                        region: @layout.quizProgressRegion
                        questionsCollection: questionsCollection
                        currentQuestion: questionModel
                        questionResponseCollection   : questionResponseCollection

                    new View.QuizTimer.Controller
                        region: @layout.quizTimerRegion
                        model: quizModel
                        display_mode: @display_mode

                    @_showSingleQuestionApp questionModel

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
		


