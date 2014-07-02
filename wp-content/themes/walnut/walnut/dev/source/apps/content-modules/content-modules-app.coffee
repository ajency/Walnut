define ['app'
        'apps/content-modules/edit-module/module-edit-controller'
        'apps/content-modules/view-single-module/single-module-controller'
        'apps/content-modules/modules-listing/modules-listing-controller'
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


        Controller =
            addModule: ->
                new ContentModulesApp.Edit.GroupController
                    region: App.mainContentRegion


            editModule:(id) ->
                new ContentModulesApp.Edit.GroupController
                    region: App.mainContentRegion
                    group_id: id


            viewModule: (id)->
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
                new ContentModulesApp.GroupListing.Controller
                    region: App.mainContentRegion

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

        ContentModulesApp.on "start", ->
            new  ContentModulesRouter
                controller: Controller

							