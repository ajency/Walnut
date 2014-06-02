define ['app'
        'apps/app-sync/app-sync1-view'
        'apps/app-sync/app-sync2-view'
        'apps/app-sync/app-sync3-view'
        'apps/app-sync/app-sync-controller'
        'apps/app-sync/app-sync-underscore'
        ], (App)->

        App.module "AppSync", (AppSync, App)->

            class AppSyncRouter extends Marionette.AppRouter

                appRoutes:
                    'sync1': 'showAppSync1'
                    'sync2': 'showAppSync2'
                    'sync3': 'showAppSync3'


            Controller =
                showAppSync1: ->
                    new AppSync.Controller.AppSync1Controller
                        region: App.mainContentRegion

                showAppSync2: ->
                    new AppSync.Controller.AppSync2Controller
                        region: App.mainContentRegion
                        
                showAppSync3: ->
                    new AppSync.Controller.AppSync3Controller
                        region: App.mainContentRegion        



            AppSync.on "start", ->
                new AppSyncRouter
                    controller: Controller