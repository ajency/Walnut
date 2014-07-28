define ['app'
        'controllers/region-controller'
        'apps/content-modules/modules-listing/modules-listing-controller'
        'apps/content-modules/modules-listing/search-results-app'
        'apps/textbook-filters/textbook-filters-app'], (App, RegionController)->
    App.module "ContentModulesApp.ModulesListing", (ModulesListing, App)->
        class ModulesListing.ListController extends RegionController

            initialize: ->
                @textbooksCollection = App.request "get:textbooks"
                @contentModulesCollection = App.request "get:content:groups", 'post_status': 'any'

                #wreqr object to get the selected filter parameters so that search can be done using them
                @selectedFilterParamsObject = new Backbone.Wreqr.RequestResponse()

                @layout = @_getContentPiecesLayout()

                App.execute "when:fetched", [@contentModulesCollection, @textbooksCollection], =>

                    @show @layout,
                        loading: true

                    @listenTo @layout, "show",=>

                        App.execute "show:textbook:filters:app",
                            region: @layout.filtersRegion
                            collection: @contentModulesCollection
                            textbooksCollection: @textbooksCollection
                            selectedFilterParamsObject: @selectedFilterParamsObject
                            filters : ['textbooks', 'chapters','sections','subsections','module_status']

                        App.execute "show:list:all:modules:app",
                            region: @layout.allContentRegion
                            contentModulesCollection: @contentModulesCollection
                            textbooksCollection: @textbooksCollection

                        new ModulesListing.SearchResults.Controller
                            region: @layout.searchResultsRegion
                            textbooksCollection: @textbooksCollection
                            selectedFilterParamsObject: @selectedFilterParamsObject

                    @listenTo @layout.filtersRegion, "update:pager",=> @layout.allContentRegion.trigger "update:pager"




            _getContentPiecesLayout:->
                new ContentPiecesLayout()


            class ContentPiecesLayout extends Marionette.Layout
                template : '<div class="grid-title no-border">
                                <h4 class="">List of <span class="semi-bold">Training Modules</span></h4>
                                <div class="tools">
                                    <a href="javascript:;" class="collapse"></a>
                                </div>
                            </div>

                            <div class="grid-body no-border contentSelect" style="overflow: hidden; display: block;">

                                <div id="filters-region" class="m-b-10"></div>

                                <ul class="nav nav-tabs b-grey b-l b-r b-t" id="addContent">
                                  <li class="active"><a href="#all-content-region"><span class="semi-bold">All</span> Modules</a></li>
                                  <li><a href="#search-results-region"><span class="semi-bold">Search</span> Modules</a></li>
                                </ul>

                                <div id="tab-content" class="tab-content" >
                                    <div id="all-content-region" class="tab-pane active"></div>
                                    <div id="search-results-region" class="tab-pane"></div>
                                </div>
                            </div>'

                className: 'tiles white grid simple vertical green'

                regions:
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