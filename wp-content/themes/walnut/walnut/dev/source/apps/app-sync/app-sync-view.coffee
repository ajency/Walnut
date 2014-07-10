define ['app', 'controllers/region-controller','text!apps/app-sync/templates/appsync.html']
		, (App, RegionController, AppSyncTpl)->

	App.module "AppSync.Controller", (Controller, App)->

		class Controller.AppSyncController extends RegionController

			initialize : ->

				@view = view = @_getAppSyncView()

				@show view


			_getAppSyncView : ->
				new AppSyncView
					


		class AppSyncView extends Marionette.ItemView

			template : AppSyncTpl

			events :
				'click #syncStartContinue' : 'startContinueSyncProcess'

				'click #syncMediaStart' : 'startMediaSyncProcess'
				


			onShow : ->

				# Hide breadcrumb region
				App.breadcrumbRegion.close()
				
				_.cordovaHideSplashscreen()

				_.disableCordovaBackbuttonNavigation()
				
				#Display The User name
				# $('#userName').text("Username: "+_.getUserName())
				
				# Display app version number
				cordova.getAppVersion().then((version)-> 
					$('#app-version').text("Version: "+version)
				)
				
				# Invoke synchronization controller
				App.request "get:sync:controller"




			startContinueSyncProcess : ->

				if _.isOnline()
					@connectionErrorMessage false
					syncController = App.request "get:sync:controller"
					syncController.startContinueDataSyncProcess()
				else
					@connectionErrorMessage true


			startMediaSyncProcess : ->

				if _.isOnline()
					@connectionErrorMessage false
					syncController = App.request "get:sync:controller"
					syncController.startMediaSyncProcess()
				else
					@connectionErrorMessage true

			
			connectionErrorMessage : (display)->

				if display
					$('#syncInternetConnection').css("display", "block").addClass("shake")
					setTimeout(=>
						$('#syncInternetConnection').removeClass("shake")
					,1000)

				else $('#syncInternetConnection').css("display", "none")