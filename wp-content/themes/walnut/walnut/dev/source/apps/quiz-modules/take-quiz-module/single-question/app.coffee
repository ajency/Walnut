define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/take-quiz-module/single-question/views'],
        (App, RegionController)->

            App.module "TakeQuizApp.SingleQuestion", (SingleQuestion, App)->
                class SingleQuestion.Controller extends RegionController

                    initialize: (opts)->
                        {@model} = opts

                        @layout = layout = @_showSingleQuestionLayout @model

                        @show layout,
                            loading: true

                        @listenTo layout, "show", @_showContentBoard @model 

                        @listenTo layout, "submit:question", 
                            -> @region.trigger "submit:question"

                        @listenTo layout, "goto:previous:question",
                            -> @region.trigger "goto:previous:question"

                        @listenTo @layout, "skip:question",
                            -> @region.trigger "skip:question"

                    _showContentBoard:(model)->
                        App.execute "show:content:board",
                                region: @layout.contentBoardRegion,
                                model: model
                            

                    _showSingleQuestionLayout: (model) =>
                        new SingleQuestion.SingleQuestionLayout
                            model: model


                



