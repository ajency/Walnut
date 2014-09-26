define ['app'
        'controllers/region-controller'
        'apps/quiz-reports/attempts/composite-view'
],(App,RegionController)->
    App.module 'AttemptsPopupApp', (AttemptsPopupApp,App)->

        class AttemptsPopupApp.Controller extends RegionController

            initialize : (options)->

                {student, quiz, @summaries} = options

                @studentModel = if student instanceof Backbone.Model 
                                    student
                                else App.request "get:user:by:id", student

                @quizModel = if quiz instanceof Backbone.Model 
                                quiz
                            else App.request "get:quiz:by:id", quiz 

                if not @summaries
                    quiz_id = if _.isNumber(quiz) then quiz else quiz.id
                    student_id = if _.isNumber(student) then student else student.id
                    @summariesCollection = App.request "get:quiz:response:summary", 'collection_id' : quiz_id, 'student_id' : student_id

                else 
                    @summariesCollection = App.request "create:quiz:response:summary:collection", @summaries

                App.execute "when:fetched", [@studentModel,@quizModel,@summariesCollection],=>

                    @view = @_getAttemptsView()

                    @show @view,
                        loading: true,
                        entities:[@studentModel, @quizModel]

                    @listenTo @view, 'close:popup:dialog',->
                        @region.closeDialog()

            _getAttemptsView :=>
                console.log @summariesCollection
                new AttemptsPopupApp.Views.AttemptsMainView
                    student     : @studentModel
                    quiz        : @quizModel
                    collection  : @summariesCollection
                    
        App.commands.setHandler 'show:attempts:popup',(options)->
            new AttemptsPopupApp.Controller options
