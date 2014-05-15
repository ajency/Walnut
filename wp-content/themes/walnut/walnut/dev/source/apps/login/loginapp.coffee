define ['app'
        'apps/login/logincontroller'
        'apps/login/app-login/app-login-controller'
        ], (App)->

        App.module "LoginApp", (LoginApp, App)->

            #startWithParent = false
            class LoginRouter extends Marionette.AppRouter

                appRoutes:
                    'login': 'showLogin'
                    'app-login' : 'appLogin'


            Controller =

                showLogin: ->
                    userdata= App.request "get:user:model"
                    console.log userdata.get 'ID'
                    if not userdata.get 'ID'
                        new LoginApp.Controller.LoginController
                            region: App.loginRegion


                appLogin:->
                    userdata= App.request "get:user:model"
                    if not userdata.get 'ID'
                        new LoginApp.Controller.AppController
                                            region : App.loginRegion            


            LoginApp.on "start", ->
                new LoginRouter
                    controller: Controller