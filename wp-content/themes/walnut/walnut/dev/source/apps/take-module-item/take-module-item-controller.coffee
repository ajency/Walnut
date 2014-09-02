define ['app'
        'controllers/region-controller'
        'apps/take-module-item/student-list/student-list-app'
        'apps/take-module-item/teacher-training-footer/training-footer-controller'
        'apps/take-module-item/module-description/module-description-app'
        'apps/take-module-item/chorus-options/chorus-options-app'
        'apps/take-module-item/item-description/controller'
        'apps/take-module-item/multiple-evaluation/multiple-evaluation-controller'
        
], (App, RegionController)->
    App.module "TeacherTeachingApp", (View, App)->

        #Single Question description and answers
        contentGroupModel = null
        studentCollection = null
        questionsCollection = null
        questionResponseCollection = null
        contentPiece = null
        questionResponseModel = null

        class View.TeacherTeachingController extends RegionController

            initialize : (opts)->
                {@division,@classID,@moduleID,contentGroupModel,
                questionsCollection,questionResponseCollection,
                contentPiece,@display_mode,studentCollection} = opts

                App.leftNavRegion.close()
                App.headerRegion.close()
                App.breadcrumbRegion.close()

                App.execute "when:fetched", [questionResponseCollection, contentPiece], =>
                    #checking if model exists in collection. if so, replacing the empty model
                    @_getOrCreateModel contentPiece.get 'ID'

                @layout = layout = @_getTakeSingleQuestionLayout()

                @show @layout, (
                    loading : true
                    entities : [
                        contentGroupModel
                        studentCollection
                        questionsCollection
                        questionResponseCollection
                        questionResponseModel
                        contentPiece
                    ]
                )

                @timerObject = new Backbone.Wreqr.RequestResponse()

                @listenTo @layout, "show", @_showModuleDescriptionView

                @listenTo @layout, 'show', =>
                    if @display_mode is 'training' or contentPiece.get('content_type') is 'content_piece'
                        @_showTeacherTrainingFooter()
                    else
                        @_showStudentsListView questionResponseModel

                @listenTo @layout, "show", @_showQuestionDisplayView contentPiece

                @listenTo @layout.moduleDetailsRegion, "goto:previous:route", @_gotoViewModule

                @listenTo @layout.studentsListRegion, "goto:previous:route", @_gotoViewModule

                @listenTo @layout.moduleDetailsRegion, "goto:next:question", @_changeQuestion

                @listenTo @layout.studentsListRegion, "goto:next:question", @_changeQuestion

            _changeQuestion : =>
                if @display_mode is 'class_mode'
                    @_saveQuestionResponse "completed"

                nextQuestion = @_getNextItemID()

                if nextQuestion

                    contentPiece = questionsCollection.get nextQuestion

                    questionResponseModel = @_getOrCreateModel nextQuestion

                    @_showQuestionDisplayView contentPiece
                    @layout.triggerMethod "change:content:piece", contentPiece

                    if @display_mode is 'training' or contentPiece.get('content_type') is 'content_piece'
                        @_showTeacherTrainingFooter()

                    # else if contentPiece.get('question_type') is 'multiple_eval'
                    #   @_showStudentsListView questionResponseModel

                else
                    @_gotoViewModule()

            _getNextItemID : ->
                contentPieces = contentGroupModel.get 'content_pieces'
                contentPieces = _.map contentPieces, (m)->
                    parseInt m

                pieceIndex = _.indexOf(contentPieces, contentPiece.id)

                nextQuestion = parseInt contentPieces[pieceIndex + 1]

                if not nextQuestion
                    nextQuestion = false

                nextQuestion

            _gotoViewModule : =>
                if @display_mode is 'class_mode' and questionResponseModel.get('status') isnt 'completed'
                    @_saveQuestionResponse "paused"

                else
                    @_startViewModuleApp()

            _saveQuestionResponse : (status) =>
                elapsedTime = @timerObject.request "get:elapsed:time"

                data=
                    time_taken : elapsedTime
                    status : status

                questionResponseModel.set data

                questionResponseModel.save data,
                    wait : true
                    success :(model)=>
                        if model.get('status') is 'paused'
                            @_startViewModuleApp()

            _startViewModuleApp:=>

                App.execute "show:headerapp", region : App.headerRegion
                App.execute "show:leftnavapp", region : App.leftNavRegion

                App.execute "show:single:module:app",
                    region: App.mainContentRegion
                    model: contentGroupModel
                    mode: @display_mode
                    division: @division
                    classID: @classID
                    studentCollection: studentCollection


            _getOrCreateModel : (content_piece_id)=>
                questionResponseModel = questionResponseCollection.findWhere
                    'content_piece_id' : content_piece_id

                #if model doesnt exist in collection setting default values
                if not questionResponseModel
                    modelData = {
                        collection_id : contentGroupModel.get 'id'
                        content_piece_id : content_piece_id
                        division : @division
                    }
                    questionResponseModel = App.request "save:question:response", ''
                    questionResponseModel.set 'question_response',[]
                    questionResponseModel.set modelData

                    if @display_mode is 'class_mode'
                        questionResponseModel.save()

                questionResponseModel


            _showModuleDescriptionView : =>
                App.execute "when:fetched", contentGroupModel, =>
                    App.execute "show:teacher:teaching:module:description",
                        region : @layout.moduleDetailsRegion
                        model : contentGroupModel
                        timerObject : @timerObject
                        questionResponseModel : questionResponseModel
                        questionResponseCollection : questionResponseCollection
                        display_mode : @display_mode


            _showQuestionDisplayView : (model) =>

                if not questionResponseModel
                    @_getOrCreateModel model.ID

                App.execute "show:top:panel",
                    region : @layout.topPanelRegion
                    model : contentPiece
                    questionResponseModel : questionResponseModel
                    timerObject : @timerObject
                    display_mode : @display_mode
                    students : studentCollection
                    classID  : @classID

                App.execute "when:fetched", questionResponseModel, =>

                    if contentPiece.get('question_type') is 'multiple_eval'
                        App.execute "show:single:question:multiple:evaluation:app",
                            region : @layout.contentBoardRegion
                            questionResponseModel : questionResponseModel
                            studentCollection : studentCollection
                            display_mode : @display_mode
                            timerObject : @timerObject
                            evaluationParams : contentPiece.get 'grading_params'

                        @layout.studentsListRegion.close()
                        

                    else
                        App.execute "show:content:board",
                            region : @layout.contentBoardRegion
                            model : contentPiece

                

            _showStudentsListView : (questionResponseModel)=>
                App.execute "when:fetched", contentPiece, =>
                    question_type = contentPiece.get('question_type')

                    if question_type is 'individual'
                        App.execute "show:single:question:student:list:app",
                            region : @layout.studentsListRegion
                            questionResponseModel : questionResponseModel
                            studentCollection : studentCollection
                            display_mode : @display_mode
                            timerObject : @timerObject

                    else if question_type is 'chorus'
                        App.execute "show:single:question:chorus:options:app",
                            region : @layout.studentsListRegion
                            questionResponseModel : questionResponseModel
                            display_mode : @display_mode
                            timerObject : @timerObject


            _showTeacherTrainingFooter : =>
                App.execute "when:fetched", contentPiece, =>
                    question_type = contentPiece.get('question_type')

                    App.execute 'show:teacher:training:footer:app',
                        region : @layout.studentsListRegion
                        contentPiece : contentPiece
                        nextItemID : @_getNextItemID()


            _getTakeSingleQuestionLayout : ->
                new SingleQuestionLayout
                    model: contentPiece

        class SingleQuestionLayout extends Marionette.Layout

            template : '<div id="module-details-region"></div>
                        <div class="" id="top-panel"></div>
                        <div class="container-grey m-b-5  qstnInfo ">
                            <label class="form-label bold small-text muted no-margin inline" id="instructions-label"> </label>
                            <span class="small-text" id="instructions"></span>
                        </div>
                        <div id="content-board"></div>
                        <div id="students-list-region"></div>'

            regions :
                moduleDetailsRegion : '#module-details-region'
                contentBoardRegion : '#content-board'
                studentsListRegion : '#students-list-region'
                topPanelRegion : '#top-panel'

            onShow : ->
                $('.page-content').addClass 'condensed expand-page'
                @onChangeContentPiece @model

            onChangeContentPiece:(contentPiece)->
                instructionsLabel = if contentPiece.get('content_type') is 'content_piece' then 'Procedure Summary' else 'Instructions'

                if instructionsLabel
                    @$el.find '#instructions-label'
                    .html instructionsLabel

                @$el.find '#instructions'
                .html contentPiece.get 'instructions'




        


