define ['app', 'controllers/region-controller', 'apps/textbooks/list/views'], (App, RegionController)->
    App.module "TextbooksApp.List", (List, App)->
        class List.ListController extends RegionController

            initialize: ->
                #console.log App
                window.textbooksCollectionOrigninal = App.request "get:textbooks", "fetch_all":true

                textbooksCollection = App.request "get:textbooks", "fetch_all":true

                defer = $.Deferred()
                url     = AJAXURL + '?action=get-admin-capability'
                datas = 'data'
                $.post url, 
                    datas, (response) =>
                        #console.log 'ADMIN'
                        console.log response
                        #current_blog_id = response
                        #response = response.toString
                        if response
                            textbooksCollectionOrigninal.isAdmin = response
                            window.isAdmin = response
                            #console.log isAdmin
                        defer.resolve response
                    'json'

                defer.promise()

                breadcrumb_items =
                    'items': [
                        {'label': 'Dashboard', 'link': 'javascript://'},
                        {'label': 'Content Management', 'link': 'javascript://'},
                        {'label': 'Textbooks', 'link': 'javascript://', 'active': 'active'}
                    ]

                App.execute "update:breadcrumb:model", breadcrumb_items

                @view = view = @_getTextbooksView textbooksCollectionOrigninal

                @listenTo @view, 'show:add:textbook:popup', (@collection)=>
                    App.execute 'add:textbook:popup',
                        region      : App.dialogRegion
                        collection : @collection

                @listenTo @view, 'search:textbooks', (collection)=>
                    @_getSearchTextbooksView collection

                @listenTo Backbone, 'reload:collection', (collection) =>
                    #console.log 'Backbone'
                    textbooks = App.request "get:textbooks", "fetch_all":true
                    App.execute "when:fetched", textbooks, =>
                        window.textbooksCollectionOrigninal = textbooks
                        models = textbooks.models
                        @collection.reset(models)
                        @_getSearchTextbooksView @collection        

                @show view, (loading: true)

            _getTextbooksView: (collection)->
                new List.Views.ListView
                    collection: collection

            _getSearchTextbooksView: (collection)->
                new List.Views.ListView
                    collection: collection


