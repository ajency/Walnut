define ['app'
        'controllers/region-controller'
        'apps/content-pieces/list-content-pieces/list-content-pieces-app'
        'apps/content-pieces/list-content-pieces/search-results-app'
        'apps/textbook-filters/textbook-filters-app'], (App, RegionController)->
    App.module "ContentPiecesApp.ContentList", (ContentList, App)->
        class ContentList.ListController extends RegionController

            initialize: ->
                @textbooksCollection = App.request "get:textbooks"
                @contentPiecesCollection = App.request "get:content:pieces"

                #wreqr object to get the selected filter parameters so that search can be done using them
                @selectedFilterParamsObject = new Backbone.Wreqr.RequestResponse()

                @layout = @_getContentPiecesLayout()

                App.execute "when:fetched", [@contentPiecesCollection, @textbooksCollection], =>

                    @show @layout,
                        loading: true

                    @listenTo @layout, "show",=>

                        App.execute "show:textbook:filters:app",
                            region: @layout.filtersRegion
                            contentPiecesCollection: @contentPiecesCollection
                            textbooksCollection: @textbooksCollection
                            selectedFilterParamsObject: @selectedFilterParamsObject
                            filters : ['textbooks', 'chapters','sections','subsections','post_status','status','content_type','content_piece']

                        App.execute "show:list:content:pieces:app",
                            region: @layout.allContentRegion
                            contentPiecesCollection: @contentPiecesCollection
                            textbooksCollection: @textbooksCollection

                        new ContentList.SearchResults.Controller
                            region: @layout.searchResultsRegion
                            textbooksCollection: @textbooksCollection
                            selectedFilterParamsObject: @selectedFilterParamsObject

                    @listenTo @layout.filtersRegion, "update:pager",=> @layout.allContentRegion.trigger "update:pager"




            _getContentPiecesLayout:->
                new ContentPiecesLayout()


            class ContentPiecesLayout extends Marionette.Layout
                template : '<div class="grid-title no-border">
                                                    <h4 class="">List of <span class="semi-bold">Content Pieces</span></h4>
                                                    <div class="tools">
                                                        <a href="javascript:;" class="collapse"></a>
                                                    </div>
                                                </div>

                                                <div class="grid-body no-border contentSelect" style="overflow: hidden; display: block;">

                                                    <div id="filters-region" class="m-b-10"></div>

                                                    <ul class="nav nav-tabs b-grey b-l b-r b-t" id="addContent">
                                					            <li class="active"><a href="#all-content-region"><span class="semi-bold">All</span> Content Pieces</a></li>
                                					            <li><a href="#search-results-region"><span class="semi-bold">Search</span> Content Pieces</a></li>
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