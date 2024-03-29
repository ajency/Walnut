define ['app'
        'controllers/region-controller'
], (App, RegionController)->
    App.module "ContentModulesApp.ModulesListing.SearchResults", (SearchResults, App, Backbone, Marionette, $, _)->
        class SearchResults.Controller extends RegionController
            initialize:(opts) ->
                {@textbooksCollection,@selectedFilterParamsObject,@groupType } = opts

                @layout = layout = @_getSearchResultsLayout()

                @searchCollection = App.request "empty:content:modules:collection"

                @show layout,
                    loading: true

                @listenTo @layout, "show", =>
                    App.execute "show:list:all:modules:app",
                        region: @layout.contentSelectionRegion
                        contentModulesCollection: @searchCollection
                        textbooksCollection: @textbooksCollection

                @listenTo @layout, "search:content", @_searchContent

            _searchContent:(searchStr,useFilters)=>
                filters= {}
                if useFilters
                    filters= @selectedFilterParamsObject.request "get:parameters:for:search"

                filters.post_status = 'any' if not filters.post_status
                
                if @groupType is 'teaching-module'
                    @newCollection = App.request "get:content:groups",
                        post_status     : 'any'
                        search_str      : searchStr
                        textbook        : filters.term_id  if filters.term_id?
                        post_status     : filters.post_status if filters.post_status?

                if @groupType is 'quiz'
                    @newCollection = App.request "get:quizes",
                        post_status     : 'any'
                        search_str      : searchStr
                        textbook        : filters.term_id  if filters.term_id?
                        post_status     : filters.post_status if filters.post_status?

                App.execute "when:fetched", @newCollection, =>
                    @searchCollection.reset @newCollection.models
                    @layout.contentSelectionRegion.trigger "update:pager"
                    
                    @layout.$el.find '.progress-spinner'
                    .hide()

            _getSearchResultsLayout:->
                new SearchResultsLayout()

        class SearchResultsLayout extends Marionette.Layout

            template: 'Search: <input type="text" class="search-box" id="search-box">
                          <input id="use-filters" type="checkbox"> <span class="small"> Search with filters</span>
                        <button class="btn btn-success btn-cons2" id="search-btn">
                            <i class="none progress-spinner fa fa-spinner fa-spin"></i>
                            Search
                        </button>
                       <label id="error-div" class="none"><span class="small text-error">Please enter the search keyword</span></label>
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
                    @$el.find '.progress-spinner'
                    .show()
                    @trigger("search:content", searchStr,useFilters)
                else
                    @$el.find "#error-div"
                    .show()