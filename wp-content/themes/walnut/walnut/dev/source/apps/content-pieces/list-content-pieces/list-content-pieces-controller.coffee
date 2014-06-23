define ['app'
        'controllers/region-controller'
        'apps/content-pieces/list-content-pieces/views'], (App, RegionController)->
    App.module "ContentPiecesApp.ContentList", (ContentList, App)->
        class ContentList.ListController extends RegionController

            initialize: ->
                console.log "list"
                @contentPiecesCollection = App.request "get:content:pieces"
                @textbooksCollection = App.request "get:textbooks"

                breadcrumb_items =
                    'items': [
                        {'label': 'Dashboard', 'link': 'javascript://'},
                        {'label': 'Content Management', 'link': 'javascript://'},
                        {'label': 'All Content Pieces', 'link': 'javascript://', 'active': 'active'}
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                App.execute "when:fetched", [@contentPiecesCollection,@textbooksCollection ], =>
                    @fullCollection = @contentPiecesCollection.clone()

                    @view = view = @_getContentPiecesListView()

                    @show view,
                        loading: true
                        entities: [@contentPiecesCollection, @textbooksCollection, @fullCollection]

                    @listenTo @view, "fetch:chapters:or:sections", (parentID, filterType) =>
                        chaptersOrSections= App.request "get:chapters", ('parent' : parentID)
                        App.execute "when:fetched", chaptersOrSections, =>
                            @view.triggerMethod "fetch:chapters:or:sections:completed", chaptersOrSections,filterType

            _getContentPiecesListView: ->
                console.log @fullCollection
                new ContentList.Views.ListView
                    collection: @contentPiecesCollection
                    fullCollection: @fullCollection
                    textbooksCollection: @textbooksCollection


