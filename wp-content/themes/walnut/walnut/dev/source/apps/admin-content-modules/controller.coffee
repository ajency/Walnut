define ['app'
        'controllers/region-controller'
        'apps/admin-content-modules/views'
], (App, RegionController, classDescriptionTpl)->

    App.module "AdminContentModulesApp.View", (View, App)->

        #List of textbooks available to a teacher for training or to take a class
        class View.AdminModulesController extends RegionController
            initialize: ->

                @contentGroupsCollection =null
                @fullCollection= null
                @allChaptersCollection = null
                @textbooksCollection = App.request "get:textbooks"

                @divisionsCollection = App.request "get:divisions"

                App.execute "when:fetched", @divisionsCollection, =>
                    division= @divisionsCollection.first().get 'id'
                    @contentGroupsCollection = App.request "get:content:groups", 'division': division

                    App.execute "when:fetched", @contentGroupsCollection, =>
                        #division= @textbooksCollection.first().get 'id'
                        chapter_ids= _.chain @contentGroupsCollection.pluck 'term_ids'
                                    .pluck 'chapter'
                                    .unique()
                                    .compact()
                                    .value()

                        #all chapter names in this set of contentgroupscollection
                        @allChaptersCollection = App.request "get:textbook:names:by:ids", chapter_ids

                        App.execute "when:fetched", [@allChaptersCollection,@textbooksCollection], =>

                            @fullCollection= @contentGroupsCollection.clone()
                            @view = view = @_getContentGroupsListingView @contentGroupsCollection

                            @show @view,(loading: true)

                            @listenTo @view, "fetch:chapters:or:sections", (parentID, filterType) =>
                                chaptersOrSections= App.request "get:chapters", ('parent' : parentID)
                                App.execute "when:fetched", chaptersOrSections, =>
                                    @view.triggerMethod "fetch:chapters:or:sections:completed", chaptersOrSections,filterType

                            @listenTo @view, "division:changed", (division)=>
                                newModulesCollection = App.request "get:content:groups", ('division': division)
                                App.execute "when:fetched", newModulesCollection, =>
                                    fullCollection = newModulesCollection.clone()
                                    @view.triggerMethod "new:collection:fetched", newModulesCollection,fullCollection


            _getContentGroupsListingView: (collection)=>
                new View.AdminModulesView.ModulesView
                    collection          : collection
                    fullCollection      : @fullCollection
                    textbooksCollection : @textbooksCollection
                    chaptersCollection  : @allChaptersCollection
                    divisionsCollection : @divisionsCollection