define ['app'
        'controllers/region-controller'
        'apps/quiz-reports/class-report/modules-listing/composite-view'
], (App, RegionController)->
    App.module "ClassQuizReportListing", (ClassQuizReportListing, App, Backbone, Marionette, $, _)->
        class ClassQuizReportListing.Controller extends RegionController

            initialize :(opts) ->

                { @contentModulesCollection,@textbooksCollection } = opts

                @textbookNamesCollection = null

                App.execute "when:fetched", [@contentModulesCollection, @textbooksCollection], =>
                    term_ids= @_getAllTermIDs()

                    #all chapter names in this set of contentModulesscollection
                    @textbookNamesCollection = App.request "get:textbook:names:by:ids", term_ids

                    App.execute "when:fetched", @textbookNamesCollection, =>
                        @view = view = @_getContentModulessListingView()

                        @show view,
                            loading : true
                            entities : [@contentModulesCollection, @textbooksCollection]
                        
                        @listenTo @region, "update:pager",=>

                            term_ids= @_getAllTermIDs()

                            newNamesCollection = App.request "get:textbook:names:by:ids", term_ids

                            App.execute "when:fetched", newNamesCollection, =>

                                @view.triggerMethod "reset:textbook:names", newNamesCollection

                        @listenTo @view, 'itemview:view:quiz:report', @_showQuizReportApp

            _getAllTermIDs:=>
                _.chain @contentModulesCollection.pluck 'term_ids'
                .map (m)-> _.values m
                .flatten()
                .unique()
                .compact()
                .value()

            _showQuizReportApp:(itemview, quiz_id)->
                @region.trigger "show:quiz:report", @contentModulesCollection.get quiz_id

            _getContentModulessListingView : =>
                new ClassQuizReportListing.Views.ModulesListingView
                    collection          : @contentModulesCollection
                    textbookNamesCollection  : @textbookNamesCollection



        # set handlers
        App.commands.setHandler "show:list:quiz:report:app", (opt = {})->
            new ClassQuizReportListing.Controller opt


