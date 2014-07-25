define ['app'
        'controllers/region-controller'
        'text!apps/quiz-modules/take-quiz-module/quiz-progress/templates/quiz-progress-tpl.html'],
        (App, RegionController, quizProgressTemplate)->

            App.module "TakeQuizApp.QuizProgress", (QuizProgress, App)->
                class QuizProgress.Controller extends RegionController

                    initialize: (opts)->
                        {@questionsCollection} = opts

                        @view = view = @_showQuizProgressView @questionsCollection

                        @show view,
                            loading: true

                        @listenTo view, "change:question", (id)-> @region.trigger "change:question", id

                    _showQuizProgressView: (collection) =>
                        
                        new QuizProgressView
                            collection: collection
 

                class QuestionProgressView extends Marionette.ItemView 

                    template: '<a data-id="{{ID}}">{{itemNumber}}</a>'
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
                        'click #quiz-items a' :(e)-> @trigger "change:question", $(e.target).attr 'data-id'


                    onShow:->
                        $("div.holder").jPages({
                            containerID: "quiz-items",
                            perPage: 9,
                            keyBrowse: true,
                            #scrollBrowse: true,
                            animation: "fadeIn",
                            previous: ".fa-chevron-left",
                            next: ".fa-chevron-right",
                            midRange: 15,
                            links : "blank"
                        });
                    

