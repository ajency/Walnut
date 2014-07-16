define ['app'
        'controllers/region-controller'
        'text!apps/content-modules/edit-module/content-selection/templates/content-selection.html'
], (App, RegionController, contentSelectionTpl)->
    App.module "ContentSelectionApp.Controller.SearchResults", (SearchResults, App, Backbone, Marionette, $, _)->
        class SearchResults.Controller extends RegionController
            initialize: (opts) ->

                {@model,@contentGroupCollection}=opts

                @layout = layout = @_getSearchResultsLayout()

                @searchCollection = App.request "empty:content:pieces:collection"

                @show layout,
                    loading: true

                @listenTo @layout, "show", =>
                    App.execute "show:all:content:selection:app",
                        region: @layout.contentSelectionRegion
                        contentPiecesCollection: @searchCollection
                        contentGroupCollection:@contentGroupCollection

                @listenTo @layout, "search:content", @_searchContent

            _searchContent:(searchStr)=>

                @newCollection = App.request "get:content:pieces",
                    content_type    : ['teacher_question','content_piece']
                    search_str      : searchStr
                    exclude         : @contentGroupCollection.pluck('ID')

                App.execute "when:fetched", @newCollection, =>
                    @searchCollection.reset @newCollection.models
                    @layout.contentSelectionRegion.trigger "update:pager"

            _getSearchResultsLayout:->
                new SearchResultsLayout()

        class SearchResultsLayout extends Marionette.Layout

            template: 'Search Questions: <input type="text" class="search-box" id="search-box"> <br><br>
                                   <div id="content-selection-region"></div>'

            regions:
                contentSelectionRegion: '#content-selection-region'

            events:
                'keypress #search-box' : 'searchContent'

            searchContent:(e)=>
                p = e.which
                if p is 13
                    searchStr= _.trim $(e.target).val()
                    @trigger("search:content", searchStr) if searchStr

        # set handlers
        App.commands.setHandler "show:content:search:results:app", (opt = {})->
            new SearchResults.Controller opt