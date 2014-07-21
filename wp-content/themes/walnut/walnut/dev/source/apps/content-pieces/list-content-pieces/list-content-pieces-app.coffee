define ['app'
        'controllers/region-controller'
        'apps/content-pieces/list-content-pieces/views'], (App, RegionController)->
    App.module "ContentPiecesApp.ContentList", (ContentList, App)->
        class ContentList.ListContentPiecesController extends RegionController

            initialize: (opts)->

                {@contentPiecesCollection, @textbooksCollection}=opts
                @allChaptersCollection = null

                chapter_ids= _.chain @contentPiecesCollection.pluck 'term_ids'
                .pluck 'chapter'
                    .unique()
                    .compact()
                    .value()

                #all chapter names in this set of contentgroupscollection
                @allChaptersCollection = App.request "get:textbook:names:by:ids", chapter_ids

                @fullCollection = @contentPiecesCollection.clone()

                App.execute "when:fetched", @allChaptersCollection, =>
                    @view = view = @_getContentPiecesListView()

                    @show view,
                        loading: true
                        entities: [@contentPiecesCollection, @fullCollection]

                    @listenTo @region, "update:pager",=>
                        @view.triggerMethod "update:pager"

            _getContentPiecesListView: ->
                console.log @contentPiecesCollection
                new ContentList.Views.ListView
                    collection: @contentPiecesCollection
                    fullCollection: @fullCollection
                    textbooksCollection: @textbooksCollection
                    chaptersCollection  : @allChaptersCollection

        # set handlers
        App.commands.setHandler "show:list:content:pieces:app", (opt = {})->
            new ContentList.ListContentPiecesController opt