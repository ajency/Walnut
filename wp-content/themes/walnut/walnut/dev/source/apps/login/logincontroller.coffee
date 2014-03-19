define ['app', 'controllers/region-controller','text!apps/login/templates/login.html'], (App, RegionController, loginTpl)->

	App.module "LoginApp.Controller", (Controller, App)->

		class Controller.LoginController extends RegionController

			initialize : ->
				
				@view= view = @_getLoginView()

				# listen to authenticate:user event from the view
				@listenTo view, 'authenticate:user' , @authenticateUser

				# listen to the close event of the view
				@listenTo view, 'close', ->
					App.vent.trigger 'show:dashboard'

				@show view

			_getLoginView : ->
				new LoginView


			authenticateUser : (data)=>
				$.post(AJAXURL + '?action=get-user-profile' 
					data: data
					(response) =>
						if response.error
							@view.triggerMethod 'login:fail', response
						else
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
					@$el.find('#checking_login').remove();

					@$el.find '#login-submit' 
					.append '<i id="checking_login" class="fa fa-spinner fa fa-1x fa-spin"></i>'

					data = Backbone.Syphon.serialize (@)
					@trigger "authenticate:user",data

			onLoginFail: (resp) ->
				@$el.find('#checking_login, #invalid_login').remove();
				
				@$el.find('#login-form')
				.before '<span id="invalid_login" class="btn btn-danger btn-cons">'+resp.error+'</span>';




