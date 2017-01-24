define ['app'
        'controllers/region-controller'
        'text!apps/quiz-modules/take-quiz-module/quiz-progress/templates/quiz-progress-tpl.html'],
        (App, RegionController, quizProgressTemplate)->

            App.module "TakeQuizApp.QuizProgress", (QuizProgress, App)->
                class QuizProgress.Controller extends RegionController

                    initialize: (opts)->
                        {@questionsCollection,currentQuestion,@questionResponseCollection,@quizModel} = opts

                        @view = view = @_showQuizProgressView @questionsCollection,currentQuestion

                        @show view,
                            loading: true

                        @listenTo view, "change:question", (id)-> @region.trigger "change:question", id

                        @listenTo @region, "question:changed", (selectedQID)->
                            @view.triggerMethod "question:change", selectedQID

                        @listenTo @region, "question:submitted", (responseModel)->
                            @view.triggerMethod "question:submitted", responseModel

                        @listenTo @region, "check:current":->
                            @view.triggerMethod "check:current"


                    _showQuizProgressView: (collection,currentQuestion) =>
                        
                        new QuizProgressView
                            collection                  : collection
                            currentQuestion             : currentQuestion
                            questionResponseCollection  : @questionResponseCollection
                            quizModel                   : @quizModel
 

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
                        'click #quiz-items a' : 'changeQuestion'

                    mixinTemplateHelpers:(data)->
                        data.totalQuestions = @collection.length
                        data.showSkipped = true if @quizModel.hasPermission('single_attempt')
                        data

                    initialize:->
                        $('.navbar .container-fluid').css("visibility","hidden")                        
                        @questionResponseCollection= Marionette.getOption @, 'questionResponseCollection'
                        @quizModel = Marionette.getOption @,'quizModel'

                    onShow:->
                        $('.progressStrip').click ->
                          $('.quizProgress').toggleClass 'progress-expand'
                          return
    
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

                        @$el.find('.customButtons').remove() if @collection.length <10

                        currentQuestion = Marionette.getOption @,'currentQuestion'
                        
                        @questionResponseCollection.each (response)=> 
                            if @quizModel.hasPermission('display_answer') or response.get('status') is 'skipped'
                                @changeClassName(response) 

                        @onQuestionChange currentQuestion

                        @updateProgressBar()

                        @updateSkippedCount()

                    changeQuestion:(e)->
                        selectedQID = parseInt $(e.target).attr 'id'
                        if _.contains(@questionResponseCollection.pluck('content_piece_id'),selectedQID) or not @quizModel.hasPermission('single_attempt')
                            @trigger "change:question", selectedQID

                    onQuestionChange:(model)->
                        @$el.find "#quiz-items li"
                        .removeClass 'current'

                        @$el.find "#quiz-items a#"+model.id
                        .closest 'li'
                        .addClass 'current'

                    onQuestionSubmitted:(responseModel)->

                        @updateProgressBar()

                        @updateSkippedCount()

                        if responseModel.get('status') is 'skipped' and not @quizModel.hasPermission('single_attempt')
                            return false

                        else if @quizModel.hasPermission('display_answer') or responseModel.get('status') is 'skipped'
                            @changeClassName responseModel

                    onCheckCurrent:->
                        current = parseInt($('ul#quiz-items li.current').text()) + 1
                        if(current > 9)
                            page = Math.ceil(current/9)
                        else
                            page = 1
                        $('.holder a:nth-of-type('+page+')').trigger "click"


                    changeClassName:(responseModel)->
                        
                        status = responseModel.get 'status'
                        
                        className = switch status
                            when 'correct_answer'       then 'right'
                            when 'partially_correct'    then 'partiallyCorrect'
                            when 'wrong_answer'         then 'wrong'
                            when 'skipped'              then 'skip'

                        @$el.find "a#"+responseModel.get 'content_piece_id'
                        .closest 'li'
                        .removeClass 'right wrong skip partiallyCorrect'
                        .addClass className

                    updateProgressBar:->

                        skipped = _.size @questionResponseCollection.where 'status' : 'skipped'

                        answeredQuestions = @questionResponseCollection.length - skipped

                        progressPercentage = (answeredQuestions / @collection.length) * 100

                        @$el.find "#quiz-progress-bar"
                        .attr "data-percentage", progressPercentage + '%'
                        .attr "aria-valuenow", progressPercentage
                        .css "width" : progressPercentage + '%'

                        @$el.find "#answered-questions"
                        .html answeredQuestions

                    updateSkippedCount:->
                        skipped = _.size @questionResponseCollection.where 'status' : 'skipped'

                        @$el.find "#skipped-questions"
                        .html skipped


                    

