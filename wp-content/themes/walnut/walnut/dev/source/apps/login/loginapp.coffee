define ['app'
		'apps/login/logincontroller'
		'apps/login/app-login/app-login-controller'
		], (App)->

		App.module "LoginApp", (LoginApp, App)->

			#startWithParent = false
			class LoginRouter extends Marionette.AppRouter

				appRoutes:
					'login': 'showLogin'
					'login/:user' : 'showLoginWithUser'
					'app-login' : 'appLogin'



			Controller =

				showLogin: ->
					userdata= App.request "get:user:model"
					if not userdata.get 'ID'
						new LoginApp.Controller.LoginController
							region: App.loginRegion



				showLoginWithUser:(username) ->
					userdata = App.request "get:user:model"
					if not userdata.get 'ID'
						new LoginApp.Controller.LoginController
							region: App.loginRegion
							username: username


				appLogin:->
					userdata = App.request "get:user:model"
					if not userdata.get 'ID'
						new LoginApp.Controller.AppController
							region : App.loginRegion            


			LoginApp.on "start", ->
				new LoginRouter
					controller: Controller