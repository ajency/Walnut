define ['app'
        'controllers/region-controller'
], (App, RegionController)->
    App.module "ContentPiecesApp.ContentList.SearchResults", (SearchResults, App, Backbone, Marionette, $, _)->
        class SearchResults.Controller extends RegionController
            initialize:(opts) ->
                {@textbooksCollection,@selectedFilterParamsObject} =opts
                @layout = layout = @_getSearchResultsLayout()

                @searchCollection = App.request "empty:content:pieces:collection"

                @show layout,
                    loading: true

                @listenTo @layout, "show", =>
                    App.execute "show:list:content:pieces:app",
                        region: @layout.contentSelectionRegion
                        contentPiecesCollection: @searchCollection
                        textbooksCollection: @textbooksCollection

                @listenTo @layout, "search:content", @_searchContent

            _searchContent:(searchStr,useFilters)=>
                
                filters = {}
                if useFilters
                    filters= @selectedFilterParamsObject.request "get:parameters:for:search"

                @newCollection = App.request "get:content:pieces",
                    search_str      : searchStr
                    textbook        : filters.term_id if filters.term_id?

                App.execute "when:fetched", @newCollection, =>
                    @searchCollection.reset @newCollection.models
                    @layout.contentSelectionRegion.trigger "update:pager"

            _getSearchResultsLayout:->
                new SearchResultsLayout()

        class SearchResultsLayout extends Marionette.Layout

            template: 'Search: <input type="text" class="search-box" id="search-box">
                                     <input id="use-filters" type="checkbox"> <span class="small"> Search with filters</span>
                                    <button class="btn btn-success btn-cons2" id="search-btn">Search</button>
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

                @trigger("search:content", searchStr,useFilters) if searchStr