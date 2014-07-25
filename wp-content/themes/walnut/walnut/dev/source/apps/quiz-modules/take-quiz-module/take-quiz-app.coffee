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

            class View.TakeQuizController extends RegionController

                initialize : (opts)->
                    {quizModel,questionsCollection} = opts

                    @display_mode = 'quiz_mode'

                    App.leftNavRegion.close()
                    App.headerRegion.close()
                    App.breadcrumbRegion.close()

                    #App.execute "when:fetched", [questionModel], =>
                        #checking if model exists in collection. if so, replacing the empty model
                        #@_getOrCreateModel questionModel.get 'ID'

                    questionIDs = quizModel.get 'content_pieces'
                    questionIDs= _.map questionIDs, (m)-> parseInt m

                    questionID = _.first questionIDs
                    questionModel = questionsCollection.get questionID

                    @layout = layout = new TakeQuizLayout

                    @show @layout,
                        loading : true

                    @timerObject = new Backbone.Wreqr.RequestResponse()

                    @listenTo @layout, "show", @_showQuizViews

                    @listenTo @layout.questionDisplayRegion, "submit:question", @_submitQuestion

                    @listenTo @layout.questionDisplayRegion, "goto:previous:question", @_gotoPreviousQuestion

                    @listenTo @layout.questionDisplayRegion, "skip:question", @_skipQuestion

                    @listenTo @layout.quizTimerRegion, "end:quiz", @_endQuiz

                    @listenTo @layout.quizProgressRegion, "change:question", @_changeQuestion

                _changeQuestion:(id)->
                    #save results here of previous question / skip the question
                    questionModel = questionsCollection.get id
                    @_showSingleQuestionApp questionModel


                _submitQuestion:->
                    #save results here
                    @_gotoNextQuestion()

                _skipQuestion:->
                    #save skipped status
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
                            region: @layout.questionDisplayRegion
                            model: questionModel

                        @layout.quizProgressRegion.trigger "question:changed", questionModel

                _showQuizViews:->

                    new View.QuizDescription.Controller
                        region: @layout.quizDescriptionRegion
                        model: quizModel

                    new View.QuizProgress.Controller
                        region: @layout.quizProgressRegion
                        questionsCollection: questionsCollection
                        currentQuestion: questionModel

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
		


