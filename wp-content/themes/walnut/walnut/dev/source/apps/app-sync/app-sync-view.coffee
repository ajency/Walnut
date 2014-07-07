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
				
				# Display app version number
				cordova.getAppVersion().then((version)-> 
					$('#app-version').text("Version: "+version)
				)
				
				# Invoke synchronization controller
				App.request "get:sync:controller"




			startContinueSyncProcess : ->

				syncController = App.request "get:sync:controller"
				syncController.startContinueDataSyncProcess()


			startMediaSyncProcess : ->

				syncController = App.request "get:sync:controller"
				syncController.startMediaSyncProcess()