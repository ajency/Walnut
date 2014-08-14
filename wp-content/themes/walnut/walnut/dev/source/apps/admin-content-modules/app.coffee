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
                user = App.request "get:user:model"

                if user.current_user_can('administrator') or user.current_user_can('school-admin')
                    new AdminContentModulesApp.View.AdminModulesController
                        region: App.mainContentRegion

                else
                    App.execute "show:no:permissions:app",
                        region: App.mainContentRegion


        AdminContentModulesApp.on "start", ->
            new AdminContentModulesRouter
                controller: Controller