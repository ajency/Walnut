define ['app', 'controllers/region-controller','text!apps/login/templates/login.html'], (App, RegionController, loginTpl)->

	App.module "LoginApp.Controller", (Controller, App)->

		class Controller.LoginController extends RegionController

			initialize : ->
				
				view = @_getLoginView()

				@show view

			_getLoginView : ->
				new LoginView


		class LoginView extends Marionette.ItemView

			template : loginTpl

			className : 'error-body no-top  pace-done'

