define ['app', 'controllers/region-controller','text!apps/app-sync/templates/appsync.html']
		, (App, RegionController, AppSyncTpl)->

	App.module "AppSync.Controller", (Controller, App)->

		class Controller.AppSyncController extends RegionController

			initialize : ->

				@view = view = @_getAppSyncView()

				# App.commands.setHandler "close:sync:view", =>
				# 	@show view, (loading: true)

				@show view, (loading: true)


			_getAppSyncView : ->
				new AppSyncView
					


		class AppSyncView extends Marionette.ItemView

			template : AppSyncTpl

			events :
				'click #syncStartContinue' : 'startContinueSyncProcess'

				'click #syncMediaStart' : 'startMediaSyncProcess'
				


			onShow : ->
				#Hide breadcrumb region
				App.breadcrumbRegion.close()

				# Hide the splash screen image
				navigator.splashscreen.hide()

				#Display app version number
				cordova.getAppVersion().then((version)-> 
					$('#app-version').text("Version: "+version)
				)

				#Display total records to be synced
				totalRecordsTobeSynced = _.getTotalRecordsTobeSynced()
				totalRecordsTobeSynced.done (totalRecords)->
					if totalRecords is 0
						$('#totalRecordsToBeSynced').text("Data already upto date")
					else
						$('#totalRecordsToBeSynced')
						.text(""+totalRecords+" record(s) to be synced")

				
				lastSyncOperation = _.getLastSyncOperation()
				lastSyncOperation.done (typeOfOperation)->

					switch typeOfOperation

						when 'none'
							$('#syncButtonText').text('Start')

						when 'file_import'
							$('#syncButtonText').text('Start')
							

						when 'file_download'
							$('#syncButtonText').text('Continue')
						

						when 'file_generate'
							$('#syncButtonText').text('Continue')
							

						when 'file_upload'
							$('#syncButtonText').text('Continue')




			startContinueSyncProcess : ->

				#Hide error message
				$('#syncError').css("display","none")

				#Create 'SynapseData' directory inside 'SynapseAssets'
				synapseDataDirectory = _.createSynapseDataDirectory()
				synapseDataDirectory.done ->

					lastSyncOperation = _.getLastSyncOperation()
					lastSyncOperation.done (typeOfOperation)->
						
						switch typeOfOperation
							
							when 'none'
								$('#syncStartContinue').css("display","none")
								
								$('#syncSuccess').css("display","block")
								.text("Started sync process...")
								
								setTimeout(=>
									syncController = App.request "get:sync:controller"
									syncController.getDownloadURL()
						
								,2000)
								
							
							when 'file_import'
								$('#syncStartContinue').css("display","none")

								$('#syncSuccess').css("display","block")
								.text("Started sync process...")
								
								
								setTimeout(=>
									_.generateZipFile()
						
								,2000)
							
							
							when 'file_download'
								$('#syncStartContinue').css("display","none")

								$('#syncSuccess').css("display","block")
								.text("Resuming sync process...")

								setTimeout(=>
									syncController = App.request "get:sync:controller"
									syncController.readUnzipFile1()
						
								,2000)
							
							

							when 'file_generate'
								$('#syncStartContinue').css("display","none")

								$('#syncSuccess').css("display","block")
								.text("Resuming sync process...")
								
								setTimeout(=>
									_.uploadGeneratedZipFile()
						
								,2000)
								

							when 'file_upload'
								$('#syncStartContinue').css("display","none")

								$('#syncSuccess').css("display","block")
								.text("Resuming sync process...")

								setTimeout(=>
									# _.checkIfServerImportOperationCompleted()
									syncController = App.request "get:sync:controller"
									syncController.getDownloadURL()
						
								,2000)



			startMediaSyncProcess : ->

				#Hide error message
				$('#syncMediaError').css("display","none")
				
				$('#syncMediaStart').css("display","none")
				
				$('#syncMediaSuccess').css("display","block")
				.text("Started media sync process...")
				
				setTimeout(=>
					_.startMediaSync()
		
				,2000)
				