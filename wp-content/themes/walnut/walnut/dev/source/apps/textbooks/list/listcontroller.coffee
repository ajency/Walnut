define ['app', 'controllers/region-controller', 'apps/textbooks/list/views'], (App, RegionController)->
    App.module "TextbooksApp.List", (List, App)->
        class List.ListController extends RegionController

            initialize: ->
                textbooksCollection = App.request "get:textbooks"
                breadcrumb_items =
                    'items': [
                        {'label': 'Dashboard', 'link': 'javascript://'},
                        {'label': 'Content Management', 'link': 'javascript://'},
                        {'label': 'Textbooks', 'link': 'javascript://', 'active': 'active'}
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                @view = view = @_getTextbooksView textbooksCollection

                @show view, (loading: true)

            _getTextbooksView: (collection)->
                new List.Views.ListView
                    collection: collection


