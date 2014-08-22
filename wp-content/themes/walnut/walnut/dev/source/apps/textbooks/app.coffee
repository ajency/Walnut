define ['app'
        'apps/textbooks/list/listcontroller'
        'apps/textbooks/textbook-single/textbookcontroller'
], (App)->
    App.module "TextbooksApp", (TextbooksApp, App)->

        #startWithParent = false
        class TextbooksRouter extends Marionette.AppRouter

            appRoutes:
                'textbooks': 'showTextbooks'
                'textbook/:term_id': 'showSingleTextbook'


        Controller =
            showTextbooks: ->
                new TextbooksApp.List.ListController
                    region: App.mainContentRegion

            showSingleTextbook: (term_id)->
                new TextbooksApp.Single.SingleTextbook
                    region: App.mainContentRegion
                    model_id: term_id

        TextbooksApp.on "start", ->
            new TextbooksRouter
                controller: Controller

	