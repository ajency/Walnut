define ['app', 'controllers/region-controller','text!apps/login/templates/login.html'], (App, RegionController, loginTpl)->

	App.module "LoginApp.Controller", (Controller, App)->

		class Controller.LoginController extends RegionController

			initialize : (opts)->
				# username used for mobile
				{@username} = opts

				@view = view = @_getLoginView()

				# listen to authenticate:user event from the view.
				@listenTo view, 'authenticate:user' , @authenticateUser

				# listen to the close event of the view
				@listenTo view, 'close', ->
					App.vent.trigger 'show:dashboard'

				# listen to prepopulate:username event from the view for mobile
				@listenTo view, 'prepopulate:username', @prepopulateUsername	

				@show view, (loading: true)


			_getLoginView : ->
				new LoginView


			authenticateUser : (data)=>

				authOptions =
					url : AJAXURL + '?action=get-user-profile'
					data : data
					success : (resp)=>
						if resp.error
							@view.triggerMethod 'login:fail', resp
						else
							user = App.request "get:user:model"
							user.set resp
							@view.close()

				authController = App.request "get:auth:controller", authOptions

				authController.authenticate()

			
			# pre-populate username from list of logged in users
			prepopulateUsername : ->
				
				$('#txtusername').val($.trim(@username)) if @username isnt 'undefined'
					


		class LoginView extends Marionette.ItemView

			template : loginTpl

			className : ''

			events: 
				'click #login-submit'	: 'submitLogin' 
			
			onShow:->
				$('body').addClass 'error-body no-top'

				#Changes for mobile
				@trigger "prepopulate:username"
				
				_.setMainLogo()
				

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



		# set handlers
		App.commands.setHandler "show:login:view:app", (opt = {})->
			new Controller.LoginController opt

