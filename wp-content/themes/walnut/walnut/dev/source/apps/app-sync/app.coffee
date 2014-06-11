define ['app'
        'apps/app-sync/app-sync-view'
        'apps/app-sync/app-sync-controller'
        'apps/app-sync/app-sync-underscore'
        'apps/app-sync/app-sync-operations/sync-operations-loader'
        ], (App)->

        
        App.module "AppSync", (AppSync, App)->

            class AppSyncRouter extends Marionette.AppRouter

                appRoutes:
                    'sync': 'showAppSync'


            Controller =
                showAppSync: ->
                    new AppSync.Controller.AppSyncController
                        region: App.mainContentRegion    



            AppSync.on "start", ->
                new AppSyncRouter
                    controller: Controller