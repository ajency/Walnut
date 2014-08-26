define ['app'
], (App)->
    App.module "DefaultApp", (DefaultApp, App)->

        #startWithParent = false
        class DefaultAppRouter extends Marionette.AppRouter

            appRoutes:
                '*path': 'default'


        Controller =

            default:->
                console.log 'defaulted'
                App.navigate '',
                    trigger : true


        DefaultApp.on "start", ->
            new DefaultAppRouter
                controller: Controller