define ['app'
        'controllers/region-controller'
        'apps/edit-module/content-selection/all-content-app'
        'apps/edit-module/content-selection/search-results-app'
        'apps/edit-module/content-selection/add-set-app'
        'apps/textbook-filters/textbook-filters-app'
], (App, RegionController)->
    App.module "ContentSelectionApp.Controller", (Controller, App)->
        class Controller.ContentSelectionController extends RegionController

            initialize: (opts) ->

                {@model,@contentGroupCollection}= opts

                term_ids = @model.get 'term_ids'

                if @model.get('type') is 'teaching-module'
                    @contentPiecesCollection = App.request "get:content:pieces",
                        content_type: ['teacher_question','content_piece']
                        post_status : 'publish'
                        textbook    :  term_ids['textbook']

                if @model.get('type') is 'quiz'
                    @contentPiecesCollection = App.request "get:content:pieces",
                        content_type: ['student_question']
                        post_status : 'publish'
                        textbook    :  term_ids['textbook']

                @selectedFilterParamsObject = new Backbone.Wreqr.RequestResponse()

                App.execute "when:fetched", [@contentPiecesCollection,@contentGroupCollection], =>
                    @contentPiecesCollection.remove model for model in @contentGroupCollection.models
                    @fullCollection = @contentPiecesCollection.clone()

                    @layout = @_getContentSelectionLayout()
                    @show @layout,
                        loading: true

                    @selectedFilterParamsObject = new Backbone.Wreqr.RequestResponse()

                    @listenTo @layout, "show",=>

                        filters = ['textbooks', 'chapters','sections','subsections','content_type']

                        filters.pop() if @model.get('type') is 'quiz'

                        if @model.get('type') is 'quiz'
                            contentSelectionType = 'quiz'
                        else
                            contentSelectionType = 'teaching-module'

                        App.execute "show:textbook:filters:app",
                            region: @layout.filtersRegion
                            collection: @contentPiecesCollection
                            selectedFilterParamsObject : @selectedFilterParamsObject
                            model: @model
                            filters : filters
                            dataType: 'content-pieces'
                            contentSelectionType: contentSelectionType

                        App.execute "show:all:content:selection:app",
                            region: @layout.allContentRegion
                            contentPiecesCollection: @contentPiecesCollection
                            contentGroupCollection:@contentGroupCollection
                            groupType : @model.get('type')

                        App.execute "show:content:search:results:app",
                            region: @layout.searchResultsRegion
                            contentGroupCollection:@contentGroupCollection
                            selectedFilterParamsObject: @selectedFilterParamsObject
                            groupType : @model.get('type')

                        if @model.get('type') is 'quiz'
                            App.execute 'show:add:set:app',
                                region : @layout.addSetRegion
                                contentPiecesCollection : @contentPiecesCollection
                                contentGroupCollection : @contentGroupCollection
                                selectedFilterParamsObject : @selectedFilterParamsObject

                    @listenTo @layout.filtersRegion, "update:pager",=> @layout.allContentRegion.trigger "update:pager"



            _getContentSelectionLayout:->
                new ContentSelectionLayout
                    model : @model


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
                                        {{#isQuiz}}<li><a href="#add-set-region"><span class="semi-bold">Add</span> Set</a></li>{{/isQuiz}}
                                        <li><a href="#search-results-region"><span class="semi-bold">Search</span> Questions</a></li>

                                    </ul>

                                		<div id="tab-content" class="tab-content" >
                                        <div id="all-content-region" class="tab-pane active"></div>
                                        <div id="add-set-region" class="tab-pane"></div>
                                        <div id="search-results-region" class="tab-pane"></div>
                                    </div>
                                </div>'

                mixinTemplateHelpers : (data)->
                    data = super data

                    data.isQuiz = true if data.type is 'quiz'

                    data

                className: 'tiles white grid simple vertical green'

                regions:
                    filtersRegion       : '#filters-region'
                    allContentRegion    : '#all-content-region'
                    searchResultsRegion : '#search-results-region'
                    addSetRegion        : '#add-set-region'

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
