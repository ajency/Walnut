define ['app', 'controllers/region-controller', 'apps/textbooks/list/views'], (App, RegionController)->
    App.module "TextbooksApp.List", (List, App)->
        class List.ListController extends RegionController

            initialize: ->
                #console.log App
                window.textbooksCollectionOrigninal = App.request "get:textbooks", "fetch_all":true

                textbooksCollection = App.request "get:textbooks", "fetch_all":true

                breadcrumb_items =
                    'items': [
                        {'label': 'Dashboard', 'link': 'javascript://'},
                        {'label': 'Content Management', 'link': 'javascript://'},
                        {'label': 'Textbooks', 'link': 'javascript://', 'active': 'active'}
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                @view = view = @_getTextbooksView textbooksCollection

                @listenTo @view, 'show:add:textbook:popup', (@collection)=>
                    App.execute 'add:textbook:popup',
                        region      : App.dialogRegion
                        collection : @collection

                @listenTo @view, 'search:textbooks', (collection)=>
                    @_getSearchTextbooksView collection

                @listenTo @view, 'before:search:textbook' :->
                    console.log textbooksCollection  

                @listenTo @view, 'get:all:classes' :->
                    App.request             

                @show view, (loading: true)

            _getTextbooksView: (collection)->
                new List.Views.ListView
                    collection: collection

            _getSearchTextbooksView: (collection)->
                new List.Views.ListView
                    collection: collection


