define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/take-quiz-module/single-question/views'
        'apps/content-preview/dialogs/hint-dialog/hint-dialog-controller'
        'apps/content-preview/dialogs/comment-dialog/comment-dialog-controller'],
        (App, RegionController)->

            App.module "TakeQuizApp.SingleQuestion", (SingleQuestion, App)->
                class SingleQuestion.Controller extends RegionController

                    initialize: (opts)->
                        {model, @questionResponseCollection} = opts

                        @answerWreqrObject = new Backbone.Wreqr.RequestResponse()

                        @layout = layout = @_showSingleQuestionLayout model

                        @show layout,
                            loading: true

                        @listenTo layout, "show", @_showContentBoard model,@answerWreqrObject

                        @listenTo layout, "submit:question",->

                            answer= @answerWreqrObject.request "get:question:answer"
                            
                            data = 'question_response': answer.toJSON()
                            
                            quizResponseModel = App.request "create:quiz:response:model", data

                            @questionResponseCollection.add quizResponseModel
                            
                            console.log @questionResponseCollection

                        @listenTo layout, "goto:next:question",->
                            @region.trigger "submit:question"

                        @listenTo layout, "goto:previous:question",
                            -> @region.trigger "goto:previous:question"

                        @listenTo layout, "skip:question",
                            -> @region.trigger "skip:question"

                        @listenTo layout, 'show:hint:dialog',(options)->
                            App.execute 'show:hint:dialog',
                                hint : options.hint

                        @listenTo layout,'show:comment:dialog',(options)->
                            App.execute 'show:comment:dialog',
                                comment : options.comment

                    _showContentBoard:(model,answerWreqrObject)->
                        App.execute "show:content:board",
                                region: @layout.contentBoardRegion,
                                model: model
                                answerWreqrObject: answerWreqrObject
                            
                    _showSingleQuestionLayout: (model) =>
                        new SingleQuestion.SingleQuestionLayout
                            model: model