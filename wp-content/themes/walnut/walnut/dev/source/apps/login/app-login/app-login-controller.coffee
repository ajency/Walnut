define ['app', 'controllers/region-controller', 'text!apps/login/app-login/templates/applogin.html'], (App, RegionController, appLoginTpl)->

	App.module "LoginApp.Controller", (Controller, App)->

		class Controller.AppController extends RegionController

			initialize : ->
				
				LoginCollection = App.request "get:loggedin:user:collection"
				
				@view = view = @_getLoginView LoginCollection

				@show view, (loading: true)

				@listenTo view, "goto:login:view", (user)->
					App.execute "show:login:view:app",
						region 		: App.loginRegion
						username 	: user


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
				'click .message-wrapper' :'gotoLogin'

				'click #addNewAccount' : 'gotoNewLogin'


			gotoLogin:(e)->
				username= $(e.target).text()
				@trigger "goto:login:view", username

			gotoNewLogin: ->
				@trigger "goto:login:view", ''