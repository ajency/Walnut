define ['app'
], (App)->
    App.module "DefaultApp", (DefaultApp, App)->

        #startWithParent = false
        class DefaultAppRouter extends Marionette.AppRouter

            appRoutes:
                'route-not-found': 'routeNotFound'
				
        Controller =

            routeNotFound:->
                App.execute "show:404:app",
                    region: App.mainContentRegion


        DefaultApp.on "start", ->
            new DefaultAppRouter
                controller: Controller