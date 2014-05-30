define ['app', 'controllers/region-controller','text!apps/app-sync/templates/appsync3.html'], (App, RegionController, AppSyncTpl)->

	App.module "AppSync.Controller", (Controller, App)->

		class Controller.AppSync3Controller extends RegionController

			initialize : ->

				@view = view = @_getAppSyncView()
				

				@show view, (loading: true)



			_getAppSyncView : ->
				new AppSyncView

					


		class AppSyncView extends Marionette.ItemView

			template : AppSyncTpl


			onShow : ->
				


				
				

