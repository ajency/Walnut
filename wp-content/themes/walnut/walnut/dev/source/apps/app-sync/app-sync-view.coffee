define ['app', 'controllers/region-controller','text!apps/app-sync/templates/appsync.html'], (App, RegionController, AppSyncTpl)->

	App.module "AppSync.Controller", (Controller, App)->

		class Controller.AppSyncController extends RegionController

			initialize : ->

				@view = view = @_getAppSyncView()

				# listen to the close event of the view
				@listenTo view, 'close', ->
					App.navigate('teachers/dashboard', trigger: true)

				App.commands.setHandler "close:sync:view", =>
					@view.close()	

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
				if _.getInitialSyncFlag() is null
					$('#JsonToCSV').attr("disabled","disabled")
					syncController = App.request "get:sync:controller"
					syncController.totalRecordsUpdate()

				else
					@checkForRecords()
					

				
			checkForRecords:->
				alert _.getTotalRecords()
				if _.getTotalRecords() is null
					$('#JsonToCSV').attr("disabled","disabled")
					$('#CSVupload').attr("disabled","disabled")
					$('#syncNow').removeAttr("disabled")
					syncController = App.request "get:sync:controller"
					syncController.totalRecordsUpdate()	

				else
					$('#JsonToCSV').removeAttr("disabled")
					$('#CSVupload').attr("disabled","disabled")
					$('#syncNow').attr("disabled","disabled")
					syncController = App.request "get:sync:controller"
					syncController.totalRecordsUpdate()	

			fileUpload : ->
				syncController = App.request "get:sync:controller"
				syncController.fileReadZip()
				
			
			startConversion : ->
				syncController = App.request "get:sync:controller"
				syncController.selectRecords()

					

			startSyncProcess : ->
				$('i').addClass('fa-spin')
				$('#syncText').text('Syncing now...')

				syncController = App.request "get:sync:controller"
				syncController.startSync()


				
				

