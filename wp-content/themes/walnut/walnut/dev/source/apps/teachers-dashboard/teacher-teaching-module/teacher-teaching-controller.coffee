define ['app'
        'controllers/region-controller'
        'apps/teachers-dashboard/teacher-teaching-module/student-list/student-list-app'
        'apps/teachers-dashboard/teacher-teaching-module/module-description/module-description-app'
        'apps/teachers-dashboard/teacher-teaching-module/chorus-options/chorus-options-app'
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

            initialize: (opts)->
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
                    loading: true
                    entities: [
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

                @listenTo @layout, "show", @_showStudentsListView questionResponseModel if @display_mode isnt 'training'

                @listenTo @layout, "show", @_showQuestionDisplayView contentPiece

                @listenTo @layout.moduleDetailsRegion, "goto:previous:route", @_gotoPreviousRoute

                @listenTo @layout.studentsListRegion, "goto:previous:route", @_gotoPreviousRoute

                @listenTo @layout.studentsListRegion, "goto:next:question", @_changeQuestion

            _changeQuestion: (current_question_id)=>

                if @display_mode is 'class_mode'
                    @_saveQuestionResponse "completed"

                current_question_id = parseInt current_question_id

                contentPieces = contentGroupModel.get 'content_pieces'
                contentPieces =_.map contentPieces, (m)-> parseInt m
                pieceIndex = _.indexOf(contentPieces, current_question_id)

                nextQuestion = parseInt contentPieces[pieceIndex + 1]

                if nextQuestion

                    contentPiece = questionsCollection.get nextQuestion

                    questionResponseModel = @_getOrCreateModel nextQuestion

                    @_showQuestionDisplayView contentPiece

                    if @display_mode isnt 'training'
                        @_showStudentsListView questionResponseModel

                else
                    @_gotoPreviousRoute()

            _gotoPreviousRoute: =>
                if @display_mode is 'class_mode' and questionResponseModel.get('status') isnt 'completed'
                    @_saveQuestionResponse "paused"

                currRoute = App.getCurrentRoute()

                removeStr = _.str.strRightBack currRoute, '/'

                newRoute = _.str.rtrim currRoute, removeStr + '/'

                App.navigate newRoute, true

                App.execute "show:headerapp", region: App.headerRegion
                App.execute "show:leftnavapp", region: App.leftNavRegion

            _saveQuestionResponse:(status) =>
                elapsedTime = @timerObject.request "get:elapsed:time"

                questionResponseModel.set
                    time_taken  : elapsedTime
                    status      : status

                questionResponseModel.save()

            _getOrCreateModel: (content_piece_id)=>
                content_piece_id = content_piece_id.toString()

                # use parseInt() for mobile
                content_piece_id = parseInt(content_piece_id) if _.platform() is 'DEVICE'

                questionResponseModel = questionResponseCollection.findWhere
                    'content_piece_id': content_piece_id

                #if model doesnt exist in collection setting default values
                if not questionResponseModel
                    modelData= {
                        collection_id: contentGroupModel.get 'id'
                        content_piece_id: content_piece_id
                        division: @division
                    }
                    questionResponseModel = App.request "save:question:response", ''
                    questionResponseModel.set modelData

                    if @display_mode is 'class_mode'
                        questionResponseModel.save()

                questionResponseModel


            _showModuleDescriptionView: =>

                App.execute "when:fetched", contentGroupModel, =>
                    App.execute "show:teacher:teaching:module:description",
                        region: @layout.moduleDetailsRegion
                        model: contentGroupModel
                        timerObject : @timerObject
                        questionResponseModel: questionResponseModel
                        questionResponseCollection: questionResponseCollection
                        display_mode: @display_mode


            _showQuestionDisplayView: (model) =>
                App.execute "show:content:preview",
                    region                  : @layout.questionsDetailsRegion
                    model                   : model
                    textbookNames           : @textbookNames
                    questionResponseModel   : questionResponseModel
                    timerObject             : @timerObject
                    display_mode            : @display_mode
                    classID                 : @classID
                    students: studentCollection

            _showStudentsListView: (questionResponseModel)=>

                App.execute "when:fetched", contentPiece, =>
                    question_type = contentPiece.get('question_type')

                    if question_type is 'individual'
                        App.execute "show:single:question:student:list:app",
                            region: @layout.studentsListRegion
                            questionResponseModel: questionResponseModel
                            studentCollection: studentCollection
                            display_mode: @display_mode
                            timerObject : @timerObject

                    else if question_type is 'chorus'
                        App.execute "show:single:question:chorus:options:app",
                            region: @layout.studentsListRegion
                            questionResponseModel: questionResponseModel
                            display_mode: @display_mode
                            timerObject : @timerObject

            _getTakeSingleQuestionLayout: ->
                new SingleQuestionLayout

        class SingleQuestionLayout extends Marionette.Layout

            template: '<div id="module-details-region"></div>
            						<div id="question-details-region"></div>
            						<div id="students-list-region"></div>'

            regions:
                moduleDetailsRegion: '#module-details-region'
                questionsDetailsRegion: '#question-details-region'
                studentsListRegion: '#students-list-region'

            onShow:->
                $('.page-content').addClass 'condensed expand-page'



		


