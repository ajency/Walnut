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
                'click #go-back-button' : ->@trigger "goto:previous:route"


            serializeData:->
                data = super data
                display_mode =  Marionette.getOption @, 'display_mode'
                data.answer_printing = true if @model.hasPermission('answer_printing') and display_mode is 'replay'

                responseSummary = Marionette.getOption @, 'quizResponseSummary'

                if responseSummary.get('status') is 'completed'
                    data.responseSummary    = true
                    data.num_questions_answered = _.size(data.content_pieces) - responseSummary.get 'num_skipped'
                    data.total_time_taken = $.timeMinSecs responseSummary.get 'total_time_taken'
                    data.taken_on_date = moment(responseSummary.get('taken_on')).format("Do MMM YYYY")
                    data.display_marks = true if @model.hasPermission 'display_answer'
                    data.total_marks_scored = responseSummary.get 'total_marks_scored'

                data  

            onShow:->

                responseSummary = Marionette.getOption @, 'quizResponseSummary'
                if responseSummary.get('status') is 'started'                    
                    @$el.find "#take-quiz"
                    .html 'Continue'



                if Marionette.getOption(@, 'display_mode') is 'replay'

                    if @model.hasPermission 'disable_quiz_replay'
                        @$el.find "#take-quiz"
                        .remove()
                    else
                        @$el.find "#take-quiz"
                        .html 'Replay'
                    

        # set handlers
        App.commands.setHandler "show:view:quiz:detailsapp", (opt = {})->
            new Controller.ViewCollecionDetailsController opt

