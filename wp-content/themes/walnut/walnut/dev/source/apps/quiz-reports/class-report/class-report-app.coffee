define ['app'
    'controllers/region-controller'
    'text!apps/quiz-reports/class-report/templates/class-report-layout.html'
    'apps/quiz-reports/class-report/listing-controller'
    'apps/quiz-reports/class-report/student-filter-app'
    'apps/quiz-reports/class-report/search-results-app'], (App, RegionController,classReportLayoutTpl)->

    App.module "ClassReportApp", (ClassReportApp, App)->
        class ClassReportApp.Controller extends RegionController

            initialize: ->
                
                @divisionsCollection = App.request "get:divisions"

                App.execute "when:fetched", @divisionsCollection, =>

                    division= @divisionsCollection.first().get 'id'
                    class_id= @divisionsCollection.first().get 'class_id'

                    @textbooksCollection = App.request "get:textbooks", 'division' : division

                    App.execute "when:fetched", @textbooksCollection, =>
                        textbook = @textbooksCollection.first()

                        data = 
                            'post_status'   : 'any' 
                            'textbook'      : textbook.id
                            'division'      : division

                        @contentModulesCollection = App.request "get:quizes", data

                        #wreqr object to get the selected filter parameters so that search can be done using them
                        @selectedFilterParamsObject = new Backbone.Wreqr.RequestResponse()

                        @layout = @_getContentPiecesLayout @students

                        App.execute "when:fetched", [@contentModulesCollection, @textbooksCollection], =>


                            @show @layout,
                                loading: true

                            @listenTo @layout, "show",=>

                                App.execute "show:textbook:filters:app",
                                    region: @layout.filtersRegion
                                    collection: @contentModulesCollection
                                    textbooksCollection: @textbooksCollection
                                    selectedFilterParamsObject: @selectedFilterParamsObject
                                    divisionsCollection : @divisionsCollection
                                    dataType : 'quiz'
                                    filters : ['divisions','textbooks', 'chapters']

                                students = App.request "get:students:by:division", @divisionsCollection.first().get 'id'

                                App.execute "when:fetched", students, =>
                                    App.execute "show:student:filter:app",
                                        region: @layout.studentFilterRegion
                                        students: students

                                    App.execute "show:list:quiz:report:app",
                                        region: @layout.allContentRegion
                                        contentModulesCollection: @contentModulesCollection
                                        textbooksCollection: @textbooksCollection

                                    new ClassReportApp.SearchResults.Controller
                                        region: @layout.searchResultsRegion
                                        textbooksCollection: @textbooksCollection
                                        selectedFilterParamsObject: @selectedFilterParamsObject

                            @listenTo @layout.filtersRegion, "update:pager",=> @layout.allContentRegion.trigger "update:pager"
                            @listenTo @layout.filtersRegion, "division:changed",(division)=>
                                students = App.request "get:students:by:division", division
                                App.execute "when:fetched", students, =>
                                    @layout.studentFilterRegion.trigger 'change:division', students

            _getContentPiecesLayout:(students)->
                new ContentPiecesLayout
                    students : students


        class ContentPiecesLayout extends Marionette.Layout
            template : classReportLayoutTpl

            className: 'tiles white grid simple vertical green'

            regions:
                studentFilterRegion : '#students-filter-region'
                filtersRegion       : '#filters-region'
                allContentRegion    : '#all-content-region'
                searchResultsRegion : '#search-results-region'

            events:
                'click #addContent a': 'changeTab'

            changeTab: (e)->
                e.preventDefault()

                @$el.find '#addContent a'
                .removeClass 'active'

                $(e.target).closest 'a'
                .addClass 'active'
                    .tab 'show'


        # set handlers
        App.commands.setHandler "show:class:report:app", (opt = {})->
            new ClassReportApp.Controller opt    