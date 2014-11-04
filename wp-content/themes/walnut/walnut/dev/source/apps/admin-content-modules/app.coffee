define ['app'
        'controllers/region-controller'
        'apps/admin-content-modules/controller'
], (App, RegionController)->
    App.module "AdminContentModulesApp", (AdminContentModulesApp, App)->

        class AdminContentModulesRouter extends Marionette.AppRouter
            appRoutes:
                'admin/view-all-modules': 'adminViewModules'

        Controller =
            adminViewModules:  ->
                if $.allowRoute 'admin/view-all-modules'

                    new AdminContentModulesApp.View.AdminModulesController
                        region: App.mainContentRegion

                else
                    App.execute "show:no:permissions:app",
                        region: App.mainContentRegion


        AdminContentModulesApp.on "start", ->
            new AdminContentModulesRouter
                controller: Controller