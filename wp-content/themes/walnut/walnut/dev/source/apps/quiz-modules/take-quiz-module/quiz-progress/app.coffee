define ['app'
        'controllers/region-controller'
        'text!apps/quiz-modules/take-quiz-module/quiz-progress/templates/quiz-progress-tpl.html'],
        (App, RegionController, quizProgressTemplate)->

            App.module "TakeQuizApp.QuizProgress", (QuizProgress, App)->
                class QuizProgress.Controller extends RegionController

                    initialize: (opts)->
                        {@questionsCollection,currentQuestion} = opts

                        @view = view = @_showQuizProgressView @questionsCollection,currentQuestion

                        @show view,
                            loading: true

                        @listenTo view, "change:question", (id)-> @region.trigger "change:question", id

                        @listenTo @region, "question:changed", (model)->
                            @view.triggerMethod "question:change", model


                    _showQuizProgressView: (collection,currentQuestion) ->
                        
                        new QuizProgressView
                            collection: collection
                            currentQuestion: currentQuestion
 

                class QuestionProgressView extends Marionette.ItemView 

                    template: '<a id="{{ID}}">{{itemNumber}}</a>'
                    tagName: 'li'

                    # "skip" | "right" | "current" | "wrong"

                    mixinTemplateHelpers:(data)->
                        data.itemNumber = Marionette.getOption @, 'itemNumber'
                        data


                class QuizProgressView extends Marionette.CompositeView

                    className: 'quizProgress'

                    template: quizProgressTemplate

                    itemView: QuestionProgressView

                    itemViewContainer: '#quiz-items'

                    itemViewOptions:(model, index)->
                        itemNumber: index+1

                    events:
                        'click #quiz-items a' :(e)-> @trigger "change:question", $(e.target).attr 'id'


                    onShow:->
                        @$el.find "div.holder"
                        .jPages
                            containerID: "quiz-items"
                            perPage: 9
                            keyBrowse: true
                            animation: "fadeIn"
                            previous: ".fa-chevron-left"
                            next: ".fa-chevron-right"
                            midRange: 15
                            links : "blank"

                        currentQuestion = Marionette.getOption @,'currentQuestion'

                        @$el.find "#quiz-items a#"+currentQuestion.id
                        .closest 'li'
                        .addClass 'current'

                    onQuestionChange:(model)->
                        @$el.find "#quiz-items li"
                        .removeClass 'current'

                        @$el.find "#quiz-items a#"+model.id
                        .closest 'li'
                        .addClass 'current'
                    

