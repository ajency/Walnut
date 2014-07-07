define ['app', 'controllers/region-controller', 'text!apps/login/app-login/templates/applogin.html'], (App, RegionController, appLoginTpl)->

	App.module "LoginApp.Controller", (Controller, App)->

		class Controller.AppController extends RegionController

			initialize : ->

				LoginCollection = App.request "get:loggedin:user:collection"
				
				@view = view = @_getLoginView LoginCollection

				@show view

				@listenTo view, "goto:login:view", (username)->
					App.navigate "login/"+username, trigger:true

				App.leftNavRegion.close()
				App.headerRegion.close()
				App.mainContentRegion.close()
				App.breadcrumbRegion.close()	


			_getLoginView :(collection) ->
				new AppLoginView
					collection: collection


		class LoginListView extends Marionette.ItemView

			template : '<div class="message-wrapper">
							<h4 class="bold"> <a href="#">{{username}}</a></h4>
						</div>
						<div class="pull-right p-t-15"> <i class="fa fa-chevron-right"></i> </div>'

			className : 'notification-messages info'



		class AppLoginView extends Marionette.CompositeView

			template : appLoginTpl

			className : 'row login-container'

			itemView : LoginListView

			itemViewContainer: '#loginAccounts'

			events: 
				'click #loginAccounts' :'gotoLogin'

				'click #addNewAccount' : 'gotoNewLogin'


			gotoLogin:(e)->

				username= $(e.target).text()
				@trigger "goto:login:view", username

			gotoNewLogin: ->

				App.navigate('login', trigger: true)

			onShow: ->
				
				# change mainLogo to school logo
				_.setSchoolLogo()

				_.cordovaHideSplashscreen()

				_.enableCordovaBackbuttonNavigation()