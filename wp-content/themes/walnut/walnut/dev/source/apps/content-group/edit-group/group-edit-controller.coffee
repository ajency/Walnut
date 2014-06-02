define ['app'
        'controllers/region-controller'
        'text!apps/content-group/edit-group/templates/content-group.html'
        'apps/content-group/edit-group/group-details/details-app'
        'apps/content-group/edit-group/content-selection/content-selection-app'
        'apps/content-group/edit-group/content-display/content-display-app'], (App, RegionController, contentGroupTpl)->
    App.module "ContentGroupApp.Edit", (Edit, App)->
        class Edit.GroupController extends RegionController

            initialize:(options) ->

                {group_id}= options

                if group_id
                    @contentGroupModel = App.request "get:content:group:by:id", group_id
                else
                    @contentGroupModel = App.request "new:content:group"

                breadcrumb_items =
                    'items': [
                        {'label': 'Dashboard', 'link': 'javascript://'},
                        {'label': 'Content Management', 'link': 'javascript:;'},
                        {'label': 'Create Content Group', 'link': 'javascript:;', 'active': 'active'}
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                @layout = layout = @_getContentGroupEditLayout()

                @listenTo layout, 'show', @showContentGroupViews

                @show layout, (loading: true)

                @listenTo @contentGroupModel, 'change:id', @newModelAdded, @

            showContentGroupViews: =>
                App.execute "show:editgroup:content:group:detailsapp",
                    region: @layout.collectionDetailsRegion
                    model: @contentGroupModel

            _getContentGroupEditLayout: =>
                new ContentGroupEditLayout

            newModelAdded: (model)=>
                console.log model.changedAttributes()
                console.log 'really? need to load again??'
                @contentGroupCollection = App.request "get:content:pieces:of:group", model

                App.execute "when:fetched", @contentGroupCollection, =>
                    console.log @contentGroupCollection

                    App.execute "show:content:selectionapp",
                        region: @layout.contentSelectionRegion
                        model: model
                        contentGroupCollection: @contentGroupCollection

                    App.execute "show:editgroup:content:displayapp",
                        region: @layout.contentDisplayRegion
                        model: model
                        contentGroupCollection: @contentGroupCollection


        class ContentGroupEditLayout extends Marionette.Layout

            template: contentGroupTpl

            className: ''

            regions:
                collectionDetailsRegion: '#collection-details-region'
                contentSelectionRegion: '#content-selection-region'
                contentDisplayRegion: '#content-display-region'

