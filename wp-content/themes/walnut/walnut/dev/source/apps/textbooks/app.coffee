define ['app'
        'controllers/region-controller'
        'apps/textbooks/list/listcontroller'
        'apps/textbooks/textbook-single/textbookcontroller'
        'apps/textbooks/textadd-popup/add-textbook-app'
], (App)->
    App.module "TextbooksApp", (TextbooksApp, App)->

        #startWithParent = false
        class TextbooksRouter extends Marionette.AppRouter

            appRoutes:
                'textbooks': 'showTextbooks'
                'textbook/:term_id': 'showSingleTextbook'


        Controller =
            showTextbooks: ->
                if $.allowRoute 'textbooks'
                    new TextbooksApp.List.ListController
                        region: App.mainContentRegion

            showSingleTextbook: (term_id)->
                if $.allowRoute 'textbooks'
                    new TextbooksApp.Single.SingleTextbook
                        region: App.mainContentRegion
                        model_id: term_id

        TextbooksApp.on "start", ->
            new TextbooksRouter
                controller: Controller

	