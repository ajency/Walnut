define ['app'
        'apps/app-sync/app-sync-view'
        'apps/app-sync/app-sync-controller'
        ], (App)->

        App.module "AppSync", (AppSync, App)->

            #startWithParent = false
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