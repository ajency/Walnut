define ['app'
        'controllers/region-controller'
        'apps/content-modules/edit-module/content-selection/all-content-app'
        'apps/content-modules/edit-module/content-selection/search-results-app'
        'apps/textbook-filters/textbook-filters-app'
], (App, RegionController)->
    App.module "ContentSelectionApp.Controller", (Controller, App)->
        class Controller.ContentSelectionController extends RegionController

            initialize: (opts) ->

                @contentPiecesCollection = App.request "get:content:pieces",
                    content_type: ['teacher_question','content_piece']
                    post_status : 'publish'

                {@model,@contentGroupCollection}= opts

                App.execute "when:fetched", [@contentPiecesCollection,@contentGroupCollection], =>
                    @contentPiecesCollection.remove model for model in @contentGroupCollection.models

                    @layout = @_getContentSelectionLayout()
                    @show @layout,
                        loading: true

                    @listenTo @layout, "show",=>

                        App.execute "show:textbook:filters:app",
                            region: @layout.filtersRegion
                            collection: @contentPiecesCollection
                            model: @model
                            filters : ['textbooks', 'chapters','sections','subsections','content_type']

                        App.execute "show:all:content:selection:app",
                            region: @layout.allContentRegion
                            contentPiecesCollection: @contentPiecesCollection
                            contentGroupCollection:@contentGroupCollection

                        App.execute "show:content:search:results:app",
                            region: @layout.searchResultsRegion
                            contentGroupCollection:@contentGroupCollection

                    @listenTo @layout.filtersRegion, "update:pager",=> @layout.allContentRegion.trigger "update:pager"



            _getContentSelectionLayout:->
                new ContentSelectionLayout()


            class ContentSelectionLayout extends Marionette.Layout
                template : '<div class="grid-title no-border">
                                    <h4 class="">Content <span class="semi-bold">Selection</span></h4>
                                    <div class="tools">
                                        <a href="javascript:;" class="collapse"></a>
                                    </div>
                                </div>

                                <div class="grid-body no-border contentSelect" style="overflow: hidden; display: block;">

                                    <div id="filters-region" class="m-b-10"></div>

                                    <ul class="nav nav-tabs b-grey b-l b-r b-t" id="addContent">
                					            <li class="active"><a href="#all-content-region"><span class="semi-bold">All</span> Questions</a></li>
                					            <li><a href="#search-results-region"><span class="semi-bold">Search</span> Questions</a></li>
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

        # set handlers
        App.commands.setHandler "show:content:selectionapp", (opt = {})->
            new Controller.ContentSelectionController opt
