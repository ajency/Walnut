define ['app'
        'apps/content-group/edit-group/group-edit-controller'
        'apps/content-group/view-group/group-view-controller'
        'apps/content-group/groups-listing/group-listing-controller'
], (App)->
    App.module "ContentGroupApp", (ContentGroupApp, App)->

        #startWithParent = false
        class ContentGroupRouter extends Marionette.AppRouter

            appRoutes:
                'add-module': 'addGroup'
                'view-group/:id': 'viewGroup'
                'edit-group/:id': 'editGroup'
                'list-groups': 'groupsListing'
                'teachers/take-class/:classID/:div/textbook/:tID/module/:mID': 'takeClassSingleModule'
                'teachers/start-training/:classID/textbook/:tID/module/:mID': 'startTrainingSingleModule'


        Controller =
            addGroup: ->
                new ContentGroupApp.Edit.GroupController
                    region: App.mainContentRegion


            editGroup:(id) ->
                new ContentGroupApp.Edit.GroupController
                    region: App.mainContentRegion
                    group_id: id


            viewGroup: (id)->
                @contentGroupModel = App.request "get:content:group:by:id", id

                breadcrumb_items =
                    'items': [
                        {'label': 'Dashboard', 'link': 'javascript://'},
                        {'label': 'Content Management', 'link': 'javascript:;'},
                        {'label': 'View Content Group', 'link': 'javascript:;', 'active': 'active'}
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                new ContentGroupApp.View.GroupController
                    region: App.mainContentRegion
                    model: @contentGroupModel

            groupsListing: ->
                new ContentGroupApp.ListingView.GroupController
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

                new ContentGroupApp.View.GroupController
                    region: App.mainContentRegion
                    model: @contentGroupModel
                    mode: mode
                    division: div
                    classID: classID

        ContentGroupApp.on "start", ->
            new ContentGroupRouter
                controller: Controller

							