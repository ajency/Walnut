define ['app'
        'controllers/region-controller'
        'text!apps/quiz-modules/view-single-quiz/quiz-description/templates/quiz-description.html'], (App, RegionController, quizDetailsTpl)->
    App.module "QuizModuleApp.Controller", (Controller, App)->
        class Controller.ViewCollecionDetailsController extends RegionController

            initialize : (opts)->

                {@model,@textbookNames}= opts

                @view = view = @_getQuizDescriptionView()

                @listenTo view, 'start:quiz:module', =>
                    @region.trigger "start:quiz:module"

                @listenTo view, 'goto:previous:route', @_gotoPreviousRoute

                @show view

            _getQuizDescriptionView : ->

                terms = @model.get 'term_ids'

                new QuizDetailsView
                    model : @model

                    templateHelpers:
                        getTextbookName     :=> @textbookNames.getTextbookName terms
                        getChapterName      :=> @textbookNames.getChapterName terms
                        getQuestionsCount   :=> _.size @model.get 'content_pieces'


        class QuizDetailsView extends Marionette.ItemView

            template : quizDetailsTpl

            events :
                'click #take-quiz' :-> @trigger "start:quiz:module"
                'click #go-back-button' : ->@trigger "goto:previous:route"


        # set handlers
        App.commands.setHandler "show:view:quiz:detailsapp", (opt = {})->
            new Controller.ViewCollecionDetailsController opt

