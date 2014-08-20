define ['app'
        'controllers/region-controller'
], (App, RegionController)->
    App.module "ContentSelectionApp.SearchResults", (SearchResults, App, Backbone, Marionette, $, _)->
        class SearchResults.Controller extends RegionController
            initialize: (opts) ->

                {@contentGroupCollection, @groupType,@selectedFilterParamsObject} = opts

                @layout = layout = @_getSearchResultsLayout()

                @searchCollection = App.request "empty:content:pieces:collection"

                @show layout,
                    loading: true

                @listenTo @layout, "show", =>
                    App.execute "show:all:content:selection:app",
                        region: @layout.contentSelectionRegion
                        contentPiecesCollection: @searchCollection
                        contentGroupCollection:@contentGroupCollection
                        groupType    : @groupType

                @listenTo @layout, "search:content", @_searchContent

            _searchContent:(searchStr,useFilters)=>

                content_type = if @groupType is 'teaching-module' then  ['teacher_question','content_piece'] else ['student_question']
                filters= {}
                if useFilters
                    filters= @selectedFilterParamsObject.request "get:parameters:for:search"
                    content_type=[filters.content_type] if filters.content_type
                
                @newCollection = App.request "get:content:pieces",
                    content_type    : content_type
                    search_str      : searchStr
                    textbook        : filters.term_id if filters?
                    post_status     : filters.post_status if filters?
                    exclude         : @contentGroupCollection.pluck('ID')

                App.execute "when:fetched", @newCollection, =>
                    @searchCollection.reset @newCollection.models
                    @layout.contentSelectionRegion.trigger "update:pager"

            _getSearchResultsLayout:->
                new SearchResultsLayout()

        class SearchResultsLayout extends Marionette.Layout

            template: 'Search: <input type="text" class="search-box" id="search-box">
                          <input id="use-filters" type="checkbox"> <span class="small"> Search with filters</span>
                         <button class="btn btn-success btn-cons2" id="search-btn">Search</button>
                       <label id="error-div" style="display:none"><span class="small text-error">Please enter the search keyword</span></label>
                       <div id="content-selection-region"></div>'

            regions:
                contentSelectionRegion: '#content-selection-region'

            events:
                'click #search-btn' : 'searchContent'

                'keypress .search-box' :(e)-> @searchContent() if e.which is 13

            searchContent:=>

                searchStr= _.trim @$el.find('#search-box').val()

                if @$el.find '#use-filters'
                .is(":checked")
                then useFilters = true
                else useFilters = false

                if searchStr
                    @$el.find "#error-div"
                    .hide()
                    @trigger("search:content", searchStr,useFilters)
                else
                    @$el.find "#error-div"
                    .show()

        # set handlers
        App.commands.setHandler "show:content:search:results:app", (opt = {})->
            new SearchResults.Controller opt