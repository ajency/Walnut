define ['app'
        'controllers/region-controller'
        'apps/quiz-reports/class-report/listing-views'
], (App, RegionController)->
    App.module "ClassQuizReportListing", (ClassQuizReportListing, App, Backbone, Marionette, $, _)->
        class ClassQuizReportListing.Controller extends RegionController

            initialize :(opts) ->

                { @contentModulesCollection,@textbooksCollection } = opts

                @allChaptersCollection = null

                App.execute "when:fetched", [@contentModulesCollection, @textbooksCollection], =>
                    chapter_ids= _.chain @contentModulesCollection.pluck 'term_ids'
                    .pluck 'chapter'
                        .unique()
                        .compact()
                        .value()

                    #all chapter names in this set of contentModulesscollection
                    @allChaptersCollection = App.request "get:textbook:names:by:ids", chapter_ids

                    @fullCollection = @contentModulesCollection.clone()

                    App.execute "when:fetched", @allChaptersCollection, =>
                        @view = view = @_getContentModulessListingView()

                        @show view,
                            loading : true
                            entities : [@contentModulesCollection, @textbooksCollection, @fullCollection]

                        @listenTo @view, "fetch:chapters:or:sections", (parentID, filterType) =>
                            chaptersOrSections= App.request "get:chapters", ('parent' : parentID)
                            App.execute "when:fetched", chaptersOrSections, =>
                                @view.triggerMethod "fetch:chapters:or:sections:completed", chaptersOrSections,filterType

                        @listenTo @region, "update:pager",=>
                            @view.triggerMethod "update:pager"

            _getContentModulessListingView : =>
                new ClassQuizReportListing.Views.ModulesListingView
                    collection          : @contentModulesCollection
                    textbooksCollection : @textbooksCollection
                    chaptersCollection  : @allChaptersCollection



        # set handlers
        App.commands.setHandler "show:list:quiz:report:app", (opt = {})->
            new ClassQuizReportListing.Controller opt


