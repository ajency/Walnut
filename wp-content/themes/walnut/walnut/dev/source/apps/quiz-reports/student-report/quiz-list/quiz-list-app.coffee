define ['app'
        'controllers/region-controller'
        'apps/quiz-reports/student-report/quiz-list/composite-view'
        'apps/quiz-reports/attempts/attempts-app'
        ], (App, RegionController)->
    App.module "StudentReportApp.QuizList", (QuizList, App)->
        class QuizList.Controller extends RegionController

            initialize : (opts)->

                {@student_id}= opts

                @quizResponseSummaries = App.request "get:quiz:response:summary", 'student_id'   : @student_id

                App.execute "when:fetched", @quizResponseSummaries, =>
                    quiz_ids = @quizResponseSummaries.pluck 'collection_id'
                    quiz_ids= _.uniq quiz_ids if quiz_ids

                    @quizzes = if not _.isEmpty quiz_ids
                                    App.request "get:quizes", "quiz_ids": quiz_ids

                                else
                                    App.request "empty:content:modules:collection"

                    App.execute "when:fetched", @quizzes, =>
                        term_ids = _.flatten @quizzes.pluck 'term_ids'

                        term_ids= _.chain term_ids
                            .map (t)-> _.flatten t
                            .flatten()
                            .uniq()
                            .compact()
                            .value()

                        @textbookNames= App.request "get:textbook:names:by:ids",term_ids

                        App.execute "when:fetched", @textbookNames, => @_showViews @quizzes, @textbookNames

            _showViews:(quizzes,textbookNames)->
                @view = view = @_getQuizListView quizzes, textbookNames

                @show view

                @listenTo @view, 'itemview:replay:quiz', @_replay_quiz

                @listenTo @view, 'itemview:view:attempts', @_show_attempts_popup

            _show_attempts_popup:(itemview, quiz_id)->

                App.execute "show:attempts:popup",
                    region      : App.dialogRegion
                    student     : @student_id
                    quiz        : @quizzes.get quiz_id
                    summaries   : @quizResponseSummaries.where 'collection_id' : quiz_id
                        
            _replay_quiz:(itemview,quiz_id,summary_id)->

                App.execute "show:single:quiz:app",
                    region                      : App.mainContentRegion
                    quizModel                   : @quizzes.get quiz_id
                    quizResponseSummary         : @quizResponseSummaries.get summary_id
                    quizResponseSummaryCollection: @quizResponseSummaries

            _getQuizListView :(quizzes,textbookNames) ->
                new QuizList.Views.QuizListView
                    collection              : quizzes
                    quizResponseSummaries   : @quizResponseSummaries
                    textbookNames           : textbookNames
