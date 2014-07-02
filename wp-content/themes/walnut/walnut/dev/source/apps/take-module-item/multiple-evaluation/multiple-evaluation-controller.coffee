define ['app'
        'controllers/region-controller'
        # 'apps/take-module-item/multiple-evaluation/multiple-evaluation-views'
        'apps/take-module-item/multiple-evaluation/student-list/student-list-controller'
        'apps/take-module-item/multiple-evaluation/evaluation/evaluation-controller'
], (App, RegionController)->
    App.module "SingleQuestionMultipleEvaluationApp", (MultipleEval, App)->
        class SingleQuestionMultipleEvalController extends RegionController

            initialize : (opts)->
                {@questionResponseModel,@studentCollection, @display_mode,@timerObject,@evaluationParams} = opts

                @questionResponseArray = @questionResponseModel.get 'question_response'

                @layout = @_getMultipleEvaluationLayout()

                @listenTo @layout, 'show', @_onShowOfLayout

#                @listenTo view, "save:question:response", @_saveQuestionResponse

                @listenTo @layout, "question:completed", @_changeQuestion

                @listenTo @layout.studentListRegion, 'student:selected', @studentSelected

                @listenTo @layout.evalParametersRegion , 'save:eval:parameters', @_saveEvalParameters

                @show @layout,
                    loading : true

            studentSelected : (id)->
                id = parseInt id

                evaluationCollection = App.request "get:grading:parameter:collection", @evaluationParams

                responseObj = _.findWhere @questionResponseArray, id : id

                responseObj = { 'id' : id} if not responseObj?

                new MultipleEval.EvaluationApp.Controller
                    region : @layout.evalParametersRegion
                    evaluationCollection : evaluationCollection
                    studentModel : @studentCollection.findWhere ID : id
                    responseObj : responseObj
                    display_mode : @display_mode

            _saveEvalParameters : (responseObj)->
                responseObjOld = _.findWhere @questionResponseArray, id : responseObj.id
                if responseObjOld?
                    index = _.indexOf @questionResponseArray,responseObjOld
                    _.extend @questionResponseArray[index], responseObj
                else
                    @questionResponseArray = new Array() if @questionResponseArray is ''
                    @questionResponseArray.push responseObj

                @questionResponseModel.set 'question_response',@questionResponseArray

                @layout.studentListRegion.trigger 'student:answer:saved',responseObj.id


            _changeQuestion:=>
                @region.trigger "goto:next:question", @questionResponseModel.get 'content_piece_id'

            _onShowOfLayout : ->
                new MultipleEval.StudentList.Controller
                    region : @layout.studentListRegion
                    studentCollection : @studentCollection
                    questionResponseModel : @questionResponseModel
                    display_mode : @display_mode






            _getMultipleEvaluationLayout : ->
                new MultipleEvalLayout
                    questionResponseModel : @questionResponseModel


        class MultipleEvalLayout extends Marionette.Layout

            className : 'studentList m-t-35'

            template : '<div class="m-t-10 well pull-right m-b-10 p-t-10 p-b-10 m-l-20">
                            <button type="button" id="question-done" class="btn btn-success btn-xs btn-sm">
                                <i class="fa fa-forward"></i> Next
                            </button>
                        </div>
                        <div class="clearfix"></div>
                        <div id="eval-parameters"></div>
                        <div id="students-list"></div>'

            regions :
                studentListRegion : '#students-list'
                evalParametersRegion : '#eval-parameters'

            events :
                'click #question-done': 'questionCompleted'

            initialize : (options)->
                questionResponseModel = Marionette.getOption @, 'questionResponseModel'
                @correctAnswer = questionResponseModel.get 'question_response'

            questionCompleted : ->
                if (_.size(@correctAnswers) < 1) and (Marionette.getOption(@, 'display_mode') is 'class_mode')
                    if confirm 'This item will be marked as complete. None of the options have been selected. Continue?'
                        @trigger "question:completed", "no_answer"
                else
                    if confirm 'This item will be marked as complete. Continue?'
                        @trigger "question:completed"


        # set handlers
        App.commands.setHandler "show:single:question:multiple:evaluation:app", (opt = {})->
            new SingleQuestionMultipleEvalController opt

