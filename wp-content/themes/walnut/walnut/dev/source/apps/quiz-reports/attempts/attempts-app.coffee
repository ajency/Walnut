define ['app'
        'controllers/region-controller'
        'apps/quiz-reports/attempts/composite-view'
],(App,RegionController)->
    App.module 'AttemptsPopupApp', (AttemptsPopupApp,App)->

        class AttemptsPopupApp.Controller extends RegionController

            initialize : (options)->

                {student, quiz, summaries} = options

                @studentModel           = @_getStudentModel student
                @quizModel              = @_getQuizModel quiz
                @summariesCollection    = @_getSummaryCollection summaries,quiz,student               

                App.execute "when:fetched", [@studentModel,@quizModel,@summariesCollection],=>

                    @view = @_getAttemptsView()

                    @show @view

                    @listenTo @view, 'close:popup:dialog',->
                        @region.closeDialog()

                    @listenTo @view, 'itemview:replay:quiz', @_replay_quiz

            _replay_quiz:(itemview,summary_id)->

                App.execute "show:single:quiz:app",
                    region                      : App.mainContentRegion
                    quizModel                   : @quizModel
                    quizResponseSummary         : @summariesCollection.get summary_id
                    quizResponseSummaryCollection: @summariesCollection

            _getStudentModel:(student)->
                studentModel = if student instanceof Backbone.Model 
                                    student
                                else App.request "get:user:by:id", student

            _getQuizModel:(quiz)->
                quizModel= if quiz instanceof Backbone.Model 
                                quiz
                            else App.request "get:quiz:by:id", quiz 

            _getSummaryCollection:(summaries, quiz, student)->

                if not summaries
                    quiz_id = if _.isNumber(quiz) then quiz else quiz.id
                    student_id = if _.isNumber(student) then student else student.id
                    summariesCollection = App.request "get:quiz:response:summary", 'collection_id' : quiz_id, 'student_id' : student_id

                else if summaries instanceof Backbone.Collection
                    summariesCollection = summaries
                    
                else
                    summariesCollection = App.request "create:quiz:response:summary:collection", summaries

                summariesCollection

            _getAttemptsView :=>
                new AttemptsPopupApp.Views.AttemptsMainView
                    student     : @studentModel
                    quiz        : @quizModel
                    collection  : @summariesCollection
                    
        App.commands.setHandler 'show:attempts:popup',(options)->
            new AttemptsPopupApp.Controller options
