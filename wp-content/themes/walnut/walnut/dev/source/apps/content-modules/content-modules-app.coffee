define ['app'
        'apps/content-modules/view-single-module/single-module-controller'
        'apps/content-modules/modules-listing/app'
], (App)->
    App.module "ContentModulesApp", (ContentModulesApp, App)->

        #startWithParent = false
        class ContentModulesRouter extends Marionette.AppRouter

            appRoutes:
                'add-module': 'addModule'
                'view-group/:id': 'viewModule'
                'edit-module/:id': 'editModule'
                'module-list': 'modulesListing'
                'teachers/take-class/:classID/:div/textbook/:tID/module/:mID': 'takeClassSingleModule'
                'teachers/start-training/:classID/textbook/:tID/module/:mID': 'startTrainingSingleModule'
                'dummy-module/:content_piece_id' : 'showDummyModule'


        Controller =
            addModule: ->

                if $.allowRoute 'add-module'
                    App.execute 'show:edit:module:controller',
                        region : App.mainContentRegion
                        groupType : 'teaching-module'


            editModule:(id) ->

                if $.allowRoute 'edit-module'
                    App.execute 'show:edit:module:controller',
                        region: App.mainContentRegion
                        group_id: id
                        groupType : 'teaching-module'


            viewModule: (id)->

                if $.allowRoute 'view-module'

                    @contentGroupModel = App.request "get:content:group:by:id", id

                    breadcrumb_items =
                        'items': [
                            {'label': 'Dashboard', 'link': 'javascript://'},
                            {'label': 'Content Management', 'link': 'javascript:;'},
                            {'label': 'View Content Group', 'link': 'javascript:;', 'active': 'active'}
                        ]

                    App.execute "update:breadcrumb:model", breadcrumb_items

                    new ContentModulesApp.View.GroupController
                        region: App.mainContentRegion
                        model: @contentGroupModel

            modulesListing: ->

                if $.allowRoute 'module-list'

                    new ContentModulesApp.ModulesListing.ListController
                        region: App.mainContentRegion
                        groupType : 'teaching-module'


            takeClassSingleModule: (classID, div, tID, mID)->
                opts =
                    classID: classID
                    div: div
                    tID: tID
                    mID: mID
                    mode: 'take-class'
                @gotoTakeSingleQuestionModule opts

            startTrainingSingleModule: (classID, tID, mID)->
                opts =
                    classID: classID
                    tID: tID
                    mID: mID
                    mode: 'training'
                @gotoTakeSingleQuestionModule opts

            gotoTakeSingleQuestionModule: (opts)->
                {classID,div,tID,mID,mode}=opts

                @textbook = App.request "get:textbook:by:id", tID
                @contentGroupModel = App.request "get:content:group:by:id", mID

                App.execute "when:fetched", @textbook, =>
                    App.execute "when:fetched", @contentGroupModel, =>
                        textbookName = @textbook.get 'name'
                        moduleName = @contentGroupModel.get 'name'
                        breadcrumb_items =
                            'items': [
                                {'label': 'Dashboard', 'link': '#teachers/dashboard'},
                                {'label': 'Take Class', 'link': '#teachers/take-class/' + classID + '/' + div},
                                {'label': textbookName, 'link': '#teachers/take-class/' + classID + '/' + div + '/textbook/' + tID},
                                {'label': moduleName, 'link': 'javascript:;', 'active': 'active'}
                            ]

                        App.execute "update:breadcrumb:model", breadcrumb_items

                new ContentModulesApp.View.GroupController
                    region: App.mainContentRegion
                    model: @contentGroupModel
                    mode: mode
                    division: div
                    classID: classID


            showDummyModule:(content_piece_id)->

                
                if $.allowRoute 'dummy-module'

                    @contentPiece = App.request "get:content:piece:by:id", content_piece_id
                    App.execute "when:fetched", @contentPiece, =>
                        questionsCollection = App.request "empty:content:pieces:collection"
                        questionsCollection.add @contentPiece

                        if @contentPiece.get('content_type') isnt 'student_question'
                            
                            dummyGroupModel= App.request "create:dummy:content:module", content_piece_id

                            App.execute "start:teacher:teaching:app",
                                region: App.mainContentRegion
                                division: 3
                                contentPiece: @contentPiece
                                questionResponseCollection: App.request "get:empty:question:response:collection"
                                contentGroupModel: dummyGroupModel
                                questionsCollection: questionsCollection
                                classID: 2
                                studentCollection: App.request "get:dummy:students"
                                display_mode: 'class_mode'

        ContentModulesApp.on "start", ->
            new  ContentModulesRouter
                controller: Controller

							