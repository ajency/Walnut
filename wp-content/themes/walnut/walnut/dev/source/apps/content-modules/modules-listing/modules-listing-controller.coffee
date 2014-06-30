define ['app'
        'controllers/region-controller'
        'apps/content-modules/modules-listing/modules-listing-views'
], (App, RegionController)->
    App.module "ContentModulesApp.GroupListing", (GroupListing, App, Backbone, Marionette, $, _)->
        class GroupListing.Controller extends RegionController

            initialize : ->
                @contentGroupCollection = App.request "get:content:groups"
                @textbooksCollection = App.request "get:textbooks"
                @divisionsCollection = App.request "get:divisions"

                breadcrumb_items =
                    'items' : [
                        { 'label' : 'Dashboard', 'link' : 'javascript://' },
                        { 'label' : 'Content Management', 'link' : 'javascript:;' },
                        { 'label' : 'View All Content Groups', 'link' : 'javascript:;', 'active' : 'active' }
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                App.execute "when:fetched", [@contentGroupCollection,@divisionsCollection, @textbooksCollection], =>
                    @fullCollection = @contentGroupCollection.clone()

                    @view = view = @_getContentGroupsListingView()

                    @show view,
                        loading : true
                        entities : [@contentGroupCollection, @textbooksCollection, @fullCollection]

                    @listenTo @view, "fetch:chapters:or:sections", (parentID, filterType) =>
                        chaptersOrSections= App.request "get:chapters", ('parent' : parentID)
                        App.execute "when:fetched", chaptersOrSections, =>
                            @view.triggerMethod "fetch:chapters:or:sections:completed", chaptersOrSections,filterType

            _getContentGroupsListingView : =>
                new GroupListing.Views.GroupsListingView
                    collection          : @contentGroupCollection
                    fullCollection      : @fullCollection
                    textbooksCollection : @textbooksCollection
                    divisionsCollection :@divisionsCollection




