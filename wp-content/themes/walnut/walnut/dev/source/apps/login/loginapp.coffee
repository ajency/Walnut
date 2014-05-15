define ['app'
        'apps/login/logincontroller'
], (App)->
    App.module "LoginApp", (LoginApp, App)->

        #startWithParent = false
        class LoginRouter extends Marionette.AppRouter

            appRoutes:
                'login': 'showLogin'


        Controller =

            showLogin: ->
                userdata= App.request "get:user:model"
                if not userdata
                    new LoginApp.Controller.LoginController
                        region: App.loginRegion


        LoginApp.on "start", ->
            new LoginRouter
                controller: Controller