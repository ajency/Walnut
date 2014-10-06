define ['app'
        'controllers/region-controller'
        'text!apps/quiz-modules/view-single-quiz/quiz-description/templates/quiz-description.html'], (App, RegionController, quizDetailsTpl)->
    App.module "QuizModuleApp.Controller", (Controller, App)->
        class Controller.ViewCollecionDetailsController extends RegionController

            initialize : (opts)->

                {@model,@textbookNames, @display_mode,@quizResponseSummary}= opts

                @view = view = @_getQuizDescriptionView()

                @listenTo view, 'start:quiz:module', =>
                    @region.trigger "start:quiz:module"

                @listenTo view, 'try:again', =>
                    @region.trigger "try:again"

                @listenTo view, 'goto:previous:route', @_gotoPreviousRoute

                @show view

            _getQuizDescriptionView : ->

                terms = @model.get 'term_ids'

                new QuizDetailsView
                    model : @model
                    display_mode: @display_mode
                    quizResponseSummary: @quizResponseSummary

                    templateHelpers:
                        getTextbookName     :=> @textbookNames.getTextbookName terms
                        getChapterName      :=> @textbookNames.getChapterName terms
                        getQuestionsCount   :=> _.size @model.get 'content_pieces'


        class QuizDetailsView extends Marionette.ItemView

            template : quizDetailsTpl

            events :
                'click #take-quiz' :-> @trigger "start:quiz:module"
                'click #try-again' :-> @trigger "try:again"
                'click #go-back-button' : ->@trigger "goto:previous:route"


            serializeData:->
                data = super data
                display_mode =  Marionette.getOption @, 'display_mode'

                data.quiz_report = true if display_mode is 'quiz_report'

                data.practice_mode =true if @model.get('quiz_type') is 'practice'

                responseSummary = Marionette.getOption @, 'quizResponseSummary'
                
                data.total_time_taken = $.timeMinSecs responseSummary.get 'total_time_taken'

                data.negMarksEnable= _.toBool data.negMarksEnable

                if responseSummary.get('status') is 'completed'
                    data.responseSummary    = true
                    data.num_questions_answered = _.size(data.content_pieces) - responseSummary.get 'num_skipped'
                    
                    data.display_marks = true if @model.hasPermission 'display_answer'
                    if data.negMarksEnable
                        data.marks_scored = parseFloat responseSummary.get 'marks_scored'
                        data.negative_scored = parseFloat  responseSummary.get 'negative_scored'

                    data.total_marks_scored = parseFloat responseSummary.get 'total_marks_scored'
                    if _.platform() is 'DEVICE'
                        console.log JSON.stringify data.total_marks_scored
                        data.total_marks_scored = data.total_marks_scored.toFixed(2);
                    
                    if responseSummary.get('taken_on')
                        data.taken_on_date = moment(responseSummary.get('taken_on')).format("Do MMM YYYY")
                    else 
                        data.taken_on_date = moment().format("Do MMM YYYY")

                    data.try_again= true if data.practice_mode and display_mode isnt 'quiz_report'

                if responseSummary.get('status') is 'started'
                    data.incompleteQuiz = true
                    total= @model.get('total_minutes') * 60
                    elapsed = responseSummary.get('total_time_taken')

                    data.time_remaining = $.timeMinSecs total-elapsed 

                data  

            onShow:->

                responseSummary = Marionette.getOption @, 'quizResponseSummary'
                if responseSummary.get('status') is 'started'                    
                    @$el.find "#take-quiz"
                    .html 'Continue'



                if Marionette.getOption(@, 'display_mode') in ['replay','quiz_report']

                    if @model.hasPermission 'disable_quiz_replay'
                        @$el.find "#take-quiz"
                        .remove()
                    else
                        @$el.find "#take-quiz"
                        .html 'Replay'
                    

        # set handlers
        App.commands.setHandler "show:view:quiz:detailsapp", (opt = {})->
            new Controller.ViewCollecionDetailsController opt

