define ['app', 'controllers/region-controller','text!apps/login/templates/login.html'], (App, RegionController, loginTpl)->

	App.module "LoginApp.Controller", (Controller, App)->

		class Controller.LoginController extends RegionController

			initialize : ->
				
				@view= view = @_getLoginView()

				# listen to authenticate:user event from the view
				@listenTo view, 'authenticate:user' , @authenticateUser

				@show view

			_getLoginView : ->
				new LoginView


			authenticateUser : (data)=>
				$.get(AJAXURL + '?action=get-user-profile' 
					data: data
					(response) ->
						@view.close()
					'json');


		class LoginView extends Marionette.ItemView

			template : loginTpl

			className : 'error-body no-top  pace-done'

			events: 
				'click #login-submit'	: 'submitLogin' 
			
			submitLogin: (e)->
				e.preventDefault()
				if @$el.find('form').valid()
					data = Backbone.Syphon.serialize (@)
					@trigger "authenticate:user",data




