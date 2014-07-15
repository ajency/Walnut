define ['app'
        'controllers/region-controller'
        'apps/content-modules/edit-module/module-description/description-app'
        'apps/content-modules/edit-module/content-selection/content-selection-app'
        'apps/content-modules/edit-module/content-display/content-display-app'], (App, RegionController)->
    App.module "ContentModulesApp.Edit", (Edit, App)->
        class Edit.GroupController extends RegionController

            initialize : (options) ->
                {@group_id}= options

                if @group_id
                    @contentGroupModel = App.request "get:content:group:by:id", @group_id
                else
                    @contentGroupModel = App.request "new:content:group"

                App.execute "when:fetched", @contentGroupModel, =>
#                    if @contentGroupModel.get('status') is 'underreview'
                    @showContentGroupView()
#                    else
#                        @noEditView = @_getNotEditView @contentGroupModel.get('status')
#                        @show @noEditView

            showContentGroupView : ->
                breadcrumb_items =
                    'items' : [
                        { 'label' : 'Dashboard', 'link' : 'javascript://' },
                        { 'label' : 'Content Management', 'link' : 'javascript:;' },
                        { 'label' : 'Create Content Group', 'link' : 'javascript:;', 'active' : 'active' }
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items
                @layout = layout = @_getContentGroupEditLayout()
                @listenTo layout, 'show', @showContentGroupViews

                @listenTo layout, 'show', =>
                    if @group_id
                        @_showContentSelectionApp @contentGroupModel

                @listenTo @contentGroupModel, 'change:id', @_showContentSelectionApp, @

                @listenTo @layout.collectionDetailsRegion, 'close:content:selection:app', =>
                    console.log 'close:content:selection:app '
                    @layout.contentSelectionRegion.close()

                @show layout, (loading : true)

            _getNotEditView : (status)->
                new NotEditView
                    status : status

            showContentGroupViews : =>
                App.execute "show:editgroup:content:group:detailsapp",
                    region : @layout.collectionDetailsRegion
                    model : @contentGroupModel

            _getContentGroupEditLayout : =>
                new ContentGroupEditLayout

            _showContentSelectionApp : (model)=>


                @contentGroupCollection = App.request "get:content:pieces:of:group", model

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


        class ContentGroupEditLayout extends Marionette.Layout

            template : '<div class="teacher-app" id="teacher-app">
                                      <div id="collection-details-region"></div>
                                      <div id="content-selection-region"></div>
                                    </div>
                                    <div id="content-display-region"></div>'

            className : ''

            regions :
                collectionDetailsRegion : '#collection-details-region'
                contentSelectionRegion : '#content-selection-region'
                contentDisplayRegion : '#content-display-region'


        class NotEditView extends Marionette.ItemView

            template : '<div class="teacher-app">
                                        <div id="collection-details-region">
                                            <div class="tiles white grid simple vertical green animated fadeIn">
                                                <div class="grid-title no-border">
                                                    <h3>This module is not editable</h3>
                                                    <p>Current Status: {{currentStatus}}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>'

            mixinTemplateHelpers : (data)->
                status = Marionette.getOption @, 'status'
                switch status
                    when 'publish'
                        data.currentStatus = 'Published'
                    when 'archive'
                        data.currentStatus = 'Archived'
                    else
                        data.currentStatus = 'Not specified!'
                data





