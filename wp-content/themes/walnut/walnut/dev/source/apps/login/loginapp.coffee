define ['app'
		'apps/login/logincontroller'		
		], (App)->

			App.module "LoginApp", (LoginApp, App)->

				#startWithParent = false
				class LoginRouter extends Marionette.AppRouter

					appRoutes : 
						'' : 'showLogin'


				Controller = 
					showLogin : ->
						new LoginApp.Controller.LoginController
											region : App.loginRegion


				LoginApp.on "start", ->
					new LoginRouter
							controller : Controller