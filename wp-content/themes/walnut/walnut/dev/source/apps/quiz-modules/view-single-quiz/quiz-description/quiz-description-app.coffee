define ['app'
        'controllers/region-controller'
        'text!apps/quiz-modules/view-single-quiz/quiz-description/templates/quiz-description.html'], (App, RegionController, quizDetailsTpl)->
    App.module "QuizModuleApp.Controller", (Controller, App)->
        class Controller.ViewCollecionDetailsController extends RegionController

            initialize : (opts)->

                {@model,@textbookNames, @display_mode}= opts

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
                data.answer_printing = true if @model.hasPermission('answer_printing') and display_mode in ['replay','disable_quiz_replay']
                data  

            onShow:->
                if Marionette.getOption(@, 'display_mode') is 'replay'
                    @$el.find "#take-quiz"
                    .html 'Replay'

                if Marionette.getOption(@, 'display_mode') is 'disable_quiz_replay'
                    @$el.find "#take-quiz"
                    .remove()





        # set handlers
        App.commands.setHandler "show:view:quiz:detailsapp", (opt = {})->
            new Controller.ViewCollecionDetailsController opt

