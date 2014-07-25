define ['app'
        'controllers/region-controller'
        'text!apps/quiz-modules/take-quiz-module/quiz-description/templates/quiz-description-tpl.html'],
        (App, RegionController, quizDescriptionTemplate)->

            App.module "TakeQuizApp.QuizDescription", (QuizDescription, App)->
                class QuizDescription.Controller extends RegionController

                    initialize: (opts)->
                        {@model} = opts

                        @view = view = @_showQuizDescriptionView @model

                        @show view,
                            loading: true

                    _showQuizDescriptionView: (model) =>
                        
                        new ModuleDescriptionView
                            model           : model


                class ModuleDescriptionView extends Marionette.ItemView

                    className: 'pieceWrapper'

                    template: quizDescriptionTemplate

