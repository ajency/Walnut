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
				'click #JsonToCSV' : 'startConversion'
				'click #syncNow' : 'startSyncProcess'
				'click #CSVupload' : 'fileUpload'


			onShow : ->
				$('#syncText').text('')
				syncController = App.request "get:sync:controller"
				syncController.totalRecordsUpdate()

			fileUpload : ->
				syncController = App.request "get:sync:controller"
				syncController.dwnldUnZip()
				
			
			startConversion : ->
				syncController = App.request "get:sync:controller"
				syncController.selectRecords()

					

			startSyncProcess : ->
				$('i').addClass('fa-spin')
				$('#syncText').text('Syncing now...')

				syncController = App.request "get:sync:controller"
				syncController.startSync()


				
				

