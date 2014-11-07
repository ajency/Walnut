define ['app'
        'controllers/region-controller'
        'apps/edit-module/module-edit-views'
        'apps/edit-module/module-description/module-description-controller'
        'apps/edit-module/content-selection/app'
        'apps/edit-module/content-display/content-display-app'], (App, RegionController)->
    App.module "ContentModulesApp.Edit", (Edit, App)->
        class Edit.GroupController extends RegionController

            initialize : (options) ->
                {@group_id,@groupType} = options
                @contentGroupCollection = null
                if @group_id
                    @contentGroupModel = App.request "get:content:group:by:id", @group_id if @groupType is 'teaching-module'
                    @contentGroupModel = App.request "get:quiz:by:id", @group_id if @groupType is 'quiz'

                else
                    @contentGroupModel = App.request "new:content:group" if @groupType is 'teaching-module'
                    @contentGroupModel = App.request "new:quiz" if @groupType is 'quiz'

                App.execute "when:fetched", @contentGroupModel, =>
                    @contentGroupCollection = @_getContentGroupCollection()

                    App.execute "when:fetched", @contentGroupCollection, =>
                        @showContentGroupView()
            
            _getContentGroupCollection:=>
                @contentGroupCollection = App.request "get:content:pieces:of:group", @contentGroupModel if @groupType is 'teaching-module'

                if @groupType is 'quiz'
                    @contentGroupCollection = new Backbone.Collection

                    _.each @contentGroupModel.get('content_layout'),(content)=>
                        if content.type is 'content-piece'
                            contentModel = App.request "get:content:piece:by:id",content.id
                        else
                            content.data.lvl1 = parseInt content.data.lvl1
                            content.data.lvl2 = parseInt content.data.lvl2
                            content.data.lvl3 = parseInt content.data.lvl3
                            contentModel = new Backbone.Model content.data
                        @contentGroupCollection.add contentModel

                @contentGroupCollection

            showContentGroupView : ->
                breadcrumb_items =
                    'items' : [
                        { 'label' : 'Dashboard', 'link' : 'javascript://' },
                        { 'label' : 'Content Management', 'link' : 'javascript:;' },
                        { 'label' : 'Create Content Group', 'link' : 'javascript:;', 'active' : 'active' }
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items
                @layout =  @_getContentGroupEditLayout()


                @listenTo @layout, 'show', =>
                    @showGroupDetailsApp()
                    if @group_id
                        @_showContentSelectionApp @contentGroupModel

                @listenTo @contentGroupModel, 'change:id', @_showContentSelectionApp, @

                @listenTo @layout.collectionDetailsRegion, 'close:content:selection:app', =>
                    console.log 'close:content:selection:app '
                    @layout.contentSelectionRegion.close()

                @show @layout, (loading : true)

#            _getNotEditView : (status)->
#                new NotEditView
#                    status : status

            showGroupDetailsApp : =>
                App.execute "show:editgroup:content:group:detailsapp",
                    region : @layout.collectionDetailsRegion
                    model : @contentGroupModel
                    contentGroupCollection: @contentGroupCollection

            _getContentGroupEditLayout : =>
                new Edit.Views.ContentGroupEditLayout

            _showContentSelectionApp : (model)=>

                App.execute "when:fetched", @contentGroupCollection, =>
                    if model.get('post_status') is 'underreview'
                        App.execute "show:content:selectionapp",
                            region : @layout.contentSelectionRegion
                            model : model
                            contentGroupCollection : @contentGroupCollection

                    App.execute "show:editgroup:content:displayapp",
                        region : @layout.contentDisplayRegion
                        model : model
                        contentGroupCollection : @contentGroupCollection


        App.commands.setHandler 'show:edit:module:controller',(opts)->
            new Edit.GroupController opts








