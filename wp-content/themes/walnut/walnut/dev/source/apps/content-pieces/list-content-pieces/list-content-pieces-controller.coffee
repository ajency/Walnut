define ['app', 'controllers/region-controller', 'apps/content-pieces/list-content-pieces/views'], (App, RegionController)->
    App.module "ContentPiecesApp.ContentList", (ContentList, App)->
        class ContentList.ListController extends RegionController

            initialize: ->
                @contentPiecesCollection = App.request "get:content:pieces"
                @textbooksCollection = App.request "get:textbooks"

                breadcrumb_items =
                    'items': [
                        {'label': 'Dashboard', 'link': 'javascript://'},
                        {'label': 'Content Management', 'link': 'javascript://'},
                        {'label': 'All Content Pieces', 'link': 'javascript://', 'active': 'active'}
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                App.execute "when:fetched", @contentPiecesCollection,=>
                    @fullCollection = @contentPiecesCollection.clone()

                    @view = view = @_getContentPiecesListView()

                    @show view,
                        loading: true
                        entities: [@contentPiecesCollection, @textbooksCollection,@fullCollection]

                    @listenTo @view, "fetch:chapters": (term_id) =>
                        chaptersCollection = App.request "get:chapters", ('parent': term_id)
                        App.execute "when:fetched", chaptersCollection, =>
                            @view.triggerMethod 'fetch:chapters:complete', chaptersCollection

                    @listenTo @view, "fetch:sections:subsections": (term_id) ->
                        allSectionsCollection = App.request "get:subsections:by:chapter:id", ('child_of': term_id)
                        App.execute "when:fetched", allSectionsCollection, =>
                            #make list of sections directly belonging to chapter ie. parent=term_id
                            sectionsList = allSectionsCollection.where 'parent': term_id

                            #all the other sections are listed as subsections
                            subsectionsList = _.difference(allSectionsCollection.models, sectionsList);
                            allSections =
                                'sections': sectionsList, 'subsections': subsectionsList

                            @view.triggerMethod 'fetch:subsections:complete', allSections

            _getContentPiecesListView:->

                console.log @fullCollection
                new ContentList.Views.ListView
                    collection: @contentPiecesCollection
                    fullCollection: @fullCollection
                    templateHelpers:
                        textbooksFilter: ()=>
                            textbooks = []
                            _.each(@textbooksCollection.models, (el, ind)->
                                textbooks.push('name': el.get('name'), 'id': el.get('term_id'))
                            )
                            textbooks



