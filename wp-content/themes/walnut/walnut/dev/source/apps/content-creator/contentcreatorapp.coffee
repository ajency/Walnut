define ['app'
        'controllers/region-controller'
        'apps/content-creator/content-creator-controller'
        'apps/content-creator/choose-content-type/choose-content-type-app'
], (App, RegionController)->
    App.module "ContentCreator", (ContentCreator, App, Backbone, Marionette, $, _)->
        ContentCreator.closequestionelementproperty = true
        ContentCreator.closequestionelements = true
        ContentCreator.closequestioneproperty = true

        class ContentCreatorRouter extends Marionette.AppRouter

            appRoutes:
                '': 'chooseContentType'
                'create-content/:contentType': 'showContentCreator'

            Controller =

                chooseContentType: ->
                    new ContentCreator.Controller.ChooseContentType
                        region: App.mainContentRegion

                showContentCreator:(contentType) ->
                    new ContentCreator.Controller.ContentCreatorController
                        region: App.mainContentRegion
                        contentType: contentType


            ContentCreator.on "start", ->
                new ContentCreatorRouter
                    controller: Controller





