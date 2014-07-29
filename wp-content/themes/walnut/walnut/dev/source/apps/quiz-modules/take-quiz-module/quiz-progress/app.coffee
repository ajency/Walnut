define ['app'
        'controllers/region-controller'
        'text!apps/quiz-modules/take-quiz-module/quiz-progress/templates/quiz-progress-tpl.html'],
        (App, RegionController, quizProgressTemplate)->

            App.module "TakeQuizApp.QuizProgress", (QuizProgress, App)->
                class QuizProgress.Controller extends RegionController

                    initialize: (opts)->
                        {@questionsCollection,currentQuestion,@questionResponseCollection} = opts

                        @view = view = @_showQuizProgressView @questionsCollection,currentQuestion

                        @show view,
                            loading: true

                        @listenTo view, "change:question", (id)-> @region.trigger "change:question", id

                        @listenTo @region, "question:changed", (model)->
                            @view.triggerMethod "question:change", model

                        @listenTo @region, "question:submitted", (responseModel)->
                            @view.triggerMethod "question:submitted", responseModel


                    _showQuizProgressView: (collection,currentQuestion) ->
                        
                        new QuizProgressView
                            collection                  : collection
                            currentQuestion             : currentQuestion
                            questionResponseCollection  : @questionResponseCollection
 

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

                    mixinTemplateHelpers:(data)->
                        data.totalQuestions = @collection.length
                        data

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

                        questionResponseCollection= Marionette.getOption @, 'questionResponseCollection'
                        questionResponseCollection.each (response)=> @changeClassName response

                        @onQuestionChange currentQuestion

                        @updateProgressBar()

                        @updateSkippedCount()

                    onQuestionChange:(model)->
                        @$el.find "#quiz-items li"
                        .removeClass 'current'

                        @$el.find "#quiz-items a#"+model.id
                        .closest 'li'
                        .addClass 'current'

                    onQuestionSubmitted:(responseModel)->

                        @changeClassName responseModel

                        @updateProgressBar()

                        @updateSkippedCount()

                    changeClassName:(responseModel)->
                        
                        answer = responseModel.get 'question_response'
                        
                        if answer.status in ['correct_answer','partially_correct']
                            className = 'right'  

                        if answer.status is 'wrong_answer' 
                            className = 'wrong'

                        if answer.status is 'skipped' 
                            className = 'skip'

                        @$el.find "a#"+responseModel.get 'content_piece_id'
                        .closest 'li'
                        .removeClass 'wrong'
                        .removeClass 'right'
                        .removeClass 'skip'
                        .addClass className

                    updateProgressBar:->
                        questionResponseCollection= Marionette.getOption @, 'questionResponseCollection'

                        responses = questionResponseCollection.pluck 'question_response'

                        answeredQuestions = _.chain responses
                                    .map (m)->m if m.status isnt 'skipped'
                                    .compact()
                                    .size()
                                    .value()

                        progressPercentage = (answeredQuestions / @collection.length) * 100

                        @$el.find "#quiz-progress-bar"
                        .attr "data-percentage", progressPercentage + '%'
                        .css "width" : progressPercentage + '%'

                        @$el.find "#answered-questions"
                        .html answeredQuestions



                    updateSkippedCount:->
                        questionResponseCollection= Marionette.getOption @, 'questionResponseCollection'
                        answers = questionResponseCollection.pluck 'question_response'
                        skipped = _.where answers, 'status': 'skipped'

                        @$el.find "#skipped-questions"
                        .html _.size skipped


                    

