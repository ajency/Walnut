define ['app'
		'apps/login/logincontroller'	
		'apps/login/app-login/app-login-controller'	
		], (App)->

			App.module "LoginApp", (LoginApp, App)->

				#startWithParent = false
				class LoginRouter extends Marionette.AppRouter

					appRoutes : 
						'login' : 'showLogin'
						'app-login' : 'appLogin'


				Controller = 
					showLogin : ->
						new LoginApp.Controller.LoginController
											region : App.loginRegion

					appLogin:->
						new LoginApp.Controller.AppController
											region : App.loginRegion


				LoginApp.on "start", ->
					new LoginRouter
							controller : Controller