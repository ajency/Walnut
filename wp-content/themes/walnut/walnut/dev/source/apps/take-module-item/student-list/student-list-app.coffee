define ['app'
        'controllers/region-controller'
        'apps/take-module-item/student-list/student-list-views'], (App, RegionController)->
    App.module "SingleQuestionStudentsListApp", (Students, App)->
        class SingleQuestionStudentsController extends RegionController

            initialize: (opts)->
                {@questionResponseModel,studentCollection, @display_mode,@timerObject} = opts

                division = @questionResponseModel.get 'division'

                @view = view = @_showStudentsListView studentCollection

                @show view, (loading: true, entities: [studentCollection])

                @listenTo view, "save:question:response", @_saveQuestionResponse


            _showStudentsListView: (collection) =>
                new Students.Views.StudentsList
                    collection: collection
                    correctAnswers: @questionResponseModel.get 'question_response'
                    display_mode: @display_mode
                    nextItemID: @nextItemID

            _saveQuestionResponse: (studResponse)=>

                elapsedTime= @timerObject.request "get:elapsed:time"

                @questionResponseModel.set
                    'question_response' : studResponse
                    'status'            : 'paused'
                    'time_taken'        : elapsedTime

                @questionResponseModel.save()


        # set handlers
        App.commands.setHandler "show:single:question:student:list:app", (opt = {})->
            new SingleQuestionStudentsController opt

