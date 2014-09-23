define ['app'
        'controllers/region-controller'
], (App, RegionController)->
    App.module "ClassReportApp.SearchResults", (SearchResults, App, Backbone, Marionette, $, _)->
        class SearchResults.Controller extends RegionController
            initialize:(opts) ->
                {@textbooksCollection,@selectedFilterParamsObject} = opts

                @layout = layout = @_getSearchResultsLayout()

                @searchCollection = App.request "empty:content:modules:collection"

                @show layout,
                    loading: true

                @listenTo @layout, "show", =>
                    App.execute "show:list:quiz:report:app",
                        region: @layout.contentSelectionRegion
                        contentModulesCollection: @searchCollection
                        textbooksCollection: @textbooksCollection

                @listenTo @layout, "search:content", @_searchContent

            _searchContent:(searchStr)=>
                filters= @selectedFilterParamsObject.request "get:parameters:for:search"

                filters.post_status = 'any' if not filters.post_status
                
                @newCollection = App.request "get:quizes",
                    post_status     : 'any'
                    search_str      : searchStr
                    textbook        : filters.term_id  if filters.term_id?
                    post_status     : filters.post_status if filters.post_status?
                    division        : filters.division if filters.division?

                App.execute "when:fetched", @newCollection, =>
                    @searchCollection.reset @newCollection.models
                    @layout.contentSelectionRegion.trigger "update:pager"
                    
                    @layout.$el.find '.progress-spinner'
                    .hide()

            _getSearchResultsLayout:->
                new SearchResultsLayout()

        class SearchResultsLayout extends Marionette.Layout

            template: 'Search: <input type="text" class="search-box" id="search-box">
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

                if searchStr
                    @$el.find "#error-div"
                    .hide()
                    @$el.find '.progress-spinner'
                    .show()
                    @trigger "search:content", searchStr
                else
                    @$el.find "#error-div"
                    .show()