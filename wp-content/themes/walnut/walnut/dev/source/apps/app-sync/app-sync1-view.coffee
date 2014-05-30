define ['app', 'controllers/region-controller','text!apps/app-sync/templates/appsync1.html'], (App, RegionController, AppSyncTpl)->

	App.module "AppSync.Controller", (Controller, App)->

		class Controller.AppSync1Controller extends RegionController

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
				'click #last5downloads' : 'showlast5downloads'


			onShow : ->
				# Hide the splash screen image
				navigator.splashscreen.hide()
				
				$('#syncText').text('')
				if _.getInitialSyncFlag() is null
					$('#JsonToCSV').attr("disabled","disabled")
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
				syncController.getuploadURL()
				
			
			startConversion : ->
				syncController = App.request "get:sync:controller"
				syncController.selectRecords()

					

			startSyncProcess : ->
				$('i').addClass('fa-spin')
				$('#syncText').text('Syncing now...')

				syncController = App.request "get:sync:controller"
				syncController.startSync()

			showlast5downloads : ->
				App.navigate('sync2', trigger: true)	


				
				

