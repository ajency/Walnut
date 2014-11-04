define ['app'
		'controllers/region-controller'
		'text!apps/login/templates/login.html'
	], (App, RegionController, loginTpl)->

	App.module "LoginApp.Controller", (Controller, App)->
		class Controller.LoginController extends RegionController

			initialize: (opts)->

				# username used for mobile
				{@username} = opts

				_.app_username = @username

				App.leftNavRegion.close()
				App.headerRegion.close()
				App.mainContentRegion.close()
				App.breadcrumbRegion.close()

				@view = view = @_getLoginView()

				# listen to authenticate:user event from the view.
				@listenTo view, 'authenticate:user', @authenticateUser

				# listen to prepopulate:username event from the view for mobile
				@listenTo view, 'prepopulate:username', @prepopulateUsername

				# listen to disable:offline:login:type event from the view for mobile
				@listenTo view, 'enable:disable:offline:login:type', @enableDisableOfflineLoginType

				if _.platform() is 'BROWSER' then @show view, (loading: true)
				else @show view
			

			_getLoginView: ->
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
							App.vent.trigger 'show:dashboard'

				authController = App.request "get:auth:controller", authOptions
				authController.authenticate()


			# pre-populate username from list of logged in users
			prepopulateUsername : ->
				
				$('#txtusername').val($.trim(@username)) if not _.isUndefined @username

			
			# enable/disable offline login for select existing account/add new account option respectively.
			enableDisableOfflineLoginType : ->
				if _.isUndefined @username
					$('#onOffSwitch').prop
						"disabled" : true, "checked" : true
				else
					if _.isOnline()
						$('#onOffSwitch').prop
							"disabled" : false, "checked" : false

					else 
						$('#onOffSwitch').prop
							"disabled" : true, "checked" : false


		
		class LoginView extends Marionette.ItemView

			template: loginTpl

			className: ''

			events:
				'click #login-submit': 'submitLogin'

			onShow: ->
				$('body').addClass 'error-body no-top'
				$('.page-content').addClass 'condensed'


				if _.platform() is 'DEVICE'

					_.cordovaHideSplashscreen()

					_.setSchoolLogo()

					_.displayConnectionStatusOnMainLoginPage()

					_.cordovaOnlineOfflineEvents()

					@trigger "prepopulate:username"

					@trigger "enable:disable:offline:login:type"
					
					

			submitLogin: (e)->
				e.preventDefault()
				if @$el.find('form').valid()
					@$el.find('#checking_login').remove();

					@$el.find '#login-submit'
					.append '<i id="checking_login" class="fa fa-spinner fa fa-1x fa-spin"></i>'

					data = Backbone.Syphon.serialize (@)
					@trigger "authenticate:user", data


			onLoginFail: (resp) ->
				@$el.find('#checking_login, #invalid_login').remove();

				@$el.find('#login-form')
				.before '<div id="invalid_login" class="alert alert-error"><span class="fa fa-warning"></span> ' + resp.error + '</div>';


		

		# set handlers
		App.commands.setHandler "show:login:view:app", (opt = {})->
			new Controller.LoginController opt
