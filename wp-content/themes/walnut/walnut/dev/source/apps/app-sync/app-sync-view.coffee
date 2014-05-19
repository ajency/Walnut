define ['app', 'controllers/region-controller','text!apps/app-sync/templates/appsync.html'], (App, RegionController, AppSyncTpl)->

	App.module "AppSync.Controller", (Controller, App)->

		class Controller.AppSyncController extends RegionController

			initialize : ->

				@view = view = @_getAppSyncView()

				@show view, (loading: true)


			_getAppSyncView : ->
				new AppSyncView
					


		class AppSyncView extends Marionette.ItemView

			template : AppSyncTpl

			events :
				'click #syncNow' : 'startSyncProcess'

			onShow : ->
				$('#syncText').text('')
				syncController = App.request "get:sync:controller"
				syncController.TotalRecordsUpdate()
					

			startSyncProcess : ->
				$('i').addClass('fa-spin')
				$('#syncText').text('Syncing now...')

				syncController = App.request "get:sync:controller"
				syncController.startSync()


				
				

