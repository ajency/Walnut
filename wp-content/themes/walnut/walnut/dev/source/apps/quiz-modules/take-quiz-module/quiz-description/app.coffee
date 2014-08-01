define ['app'
        'controllers/region-controller'
        'text!apps/quiz-modules/take-quiz-module/quiz-description/templates/quiz-description-tpl.html'],
        (App, RegionController, quizDescriptionTemplate)->

            App.module "TakeQuizApp.QuizDescription", (QuizDescription, App)->
                class QuizDescription.Controller extends RegionController

                    initialize: (opts)->
                        {model, currentQuestion,@textbookNames} = opts

                        @view = view = @_showQuizDescriptionView model, currentQuestion

                        textbookID = model.get('term_ids').textbook
                        @textbookModel = App.request "get:textbook:by:id", textbookID

                        App.execute "when:fetched", [@textbookNames, @textbookModel], =>
                            @show @view, (loading : true)

                        @listenTo @region, "question:changed", (model)->
                            @view.triggerMethod "question:change", model

                    _showQuizDescriptionView: (model, currentQuestion) =>
                        
                        terms = model.get 'term_ids'

                        new ModuleDescriptionView
                            model           : model

                            templateHelpers :
                                getQuestionDuration: currentQuestion.get 'duration'
                                getClass :=> @textbookModel.getClasses()
                                getTextbookName :=> @textbookNames.getTextbookName terms
                                getChapterName :=> @textbookNames.getChapterName terms
                                getSectionsNames :=> @textbookNames.getSectionsNames terms
                                getSubSectionsNames :=> @textbookNames.getSubSectionsNames terms

                class ModuleDescriptionView extends Marionette.ItemView

                    className: 'pieceWrapper'

                    template: quizDescriptionTemplate

                    onQuestionChange:(model)->
                        @$el.find "#time-on-question"
                        .html model.get 'duration'
                    
