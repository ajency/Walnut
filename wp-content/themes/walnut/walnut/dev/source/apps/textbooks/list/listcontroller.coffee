define ['app', 'controllers/region-controller', 'apps/textbooks/list/views'], (App, RegionController)->
    App.module "TextbooksApp.List", (List, App)->
        class List.ListController extends RegionController

            initialize: ->
                #console.log App
                textbooksCollection = App.request "get:textbooks", "fetch_all":true

                newCollection = App.request "get:textbooks", "fetch_all":true
                console.log newCollection
                breadcrumb_items =
                    'items': [
                        {'label': 'Dashboard', 'link': 'javascript://'},
                        {'label': 'Content Management', 'link': 'javascript://'},
                        {'label': 'Textbooks', 'link': 'javascript://', 'active': 'active'}
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                @view = view = @_getTextbooksView textbooksCollection, newCollection

                @listenTo @view, 'show:add:textbook:popup', (@collection)=>
                    App.execute 'add:textbook:popup',
                        region      : App.dialogRegion
                        collection : @collection

                @listenTo @view, 'search:textbooks', (collection,collections)=>
                    console.log collection
                    console.log collections
                    @_getSearchTextbooksView collection, collections

                @listenTo @view, 'before:search:textbook' :->
                    console.log textbooksCollection               

                @show view, (loading: true)

            _getTextbooksView: (collection,collections)->
                new List.Views.ListView
                    collection: collection
                    collections: collections

            _getSearchTextbooksView: (collection,collections)->
                new List.Views.ListView
                    collection: collection
                    model: collections


