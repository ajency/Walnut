define ['app'
        'apps/content-pieces/list-content-pieces/app'
], (App)->
    App.module "ContentPiecesApp", (ContentPiecesApp, App)->

        #startWithParent = false
        class ContentPiecesListRouter extends Marionette.AppRouter

            appRoutes:
                'content-pieces': 'listContentPieces'

        Controller =
            listContentPieces: ->
                console.log "content"
                new ContentPiecesApp.ContentList.ListController
                    region: App.mainContentRegion


        ContentPiecesApp.on "start", ->
            new ContentPiecesListRouter
                controller: Controller