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

            template : '<div class="clearfix"></div>
                        <div id="eval-parameters"></div>
                        <div id="students-list"></div>'

            regions :
                studentListRegion : '#students-list'
                evalParametersRegion : '#eval-parameters'

            initialize : (options)->
                questionResponseModel = Marionette.getOption @, 'questionResponseModel'
                @correctAnswer = questionResponseModel.get 'question_response'


        # set handlers
        App.commands.setHandler "show:single:question:multiple:evaluation:app", (opt = {})->
            new SingleQuestionMultipleEvalController opt

