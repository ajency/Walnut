define ['app', 'controllers/region-controller','text!apps/app-sync/templates/appsync.html'], (App, RegionController, AppSyncTpl)->

	App.module "AppSync.Controller", (Controller, App)->

		class Controller.AppSyncController extends RegionController

			initialize : ->

				@view = view = @_getAppSyncView()

				# listen to the close event of the view
				# @listenTo view, 'close', ->
				# 	App.navigate('teachers/dashboard', trigger: true)

				# App.commands.setHandler "close:sync3:view", =>
				# 	@show view, (loading: true)

				@show view, (loading: true)


			_getAppSyncView : ->
				new AppSyncView
					


		class AppSyncView extends Marionette.ItemView

			template : AppSyncTpl

			events :
				'click #syncStartContinue' : 'startContinueSyncProcess'
				


			onShow : ->
				App.breadcrumbRegion.close()

				#Display total records to be synced
				totalRecordsTobeSynced = _.getTotalRecordsTobeSynced()
				totalRecordsTobeSynced.done (totalRecords)->
					if totalRecords is 0
						$('#totalRecordsToBeSynced').text("Data already upto date")
					else
						$('#totalRecordsToBeSynced').text(""+totalRecords+" record(s) to be synced")

				
				lastSyncOperation = _.getLastSyncOperation()
				lastSyncOperation.done (typeOfOperation)->
					console.log 'typeOfOperation: '+typeOfOperation
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
				lastSyncOperation = _.getLastSyncOperation()
				lastSyncOperation.done (typeOfOperation)->
					switch typeOfOperation
						when 'none'
							$('#syncStartContinue').css("display","none")
							
							$('#syncSuccess')
							.css("display","block")
							.text("Started sync process...")
							
							setTimeout(=>
								syncController = App.request "get:sync:controller"
								syncController.getDownloadURL()
					
							,3000)
							
						
						when 'file_import'
							$('#syncStartContinue').css("display","none")

							$('#syncSuccess').css("display","block").text("Started sync process...")
							
							
							setTimeout(=>
								$('#syncSuccess').css("display","block").text("Generating file...")
								# _.generateZipFile()
								syncController = App.request "get:sync:controller"
								syncController.updateSyncDetails('file_generate', _.getCurrentDateTime(2))
					
							,2000)

							setTimeout(=>
								syncController = App.request "get:sync:controller"
								syncController.updateSyncDetails('file_generate', _.getCurrentDateTime(2))
								$('#syncSuccess').css("display","block").text("File generation completed...")
								
					
							,4000)

							setTimeout(=>
								$('#syncSuccess').css("display","block").text("Starting file upload...")
								
					
							,6000)

							setTimeout(=>
								syncController = App.request "get:sync:controller"
								syncController.updateSyncDetails('file_upload', _.getCurrentDateTime(2))
								$('#syncSuccess').css("display","block").text("File upload completed...")
								
					
							,8000)

							setTimeout(=>
								syncController = App.request "get:sync:controller"
								syncController.getDownloadURL()
					
							,10000)

						
						
						when 'file_download'
							$('#syncStartContinue').css("display","none")
							$('#syncSuccess').css("display","block").text("Resuming sync process...")

							setTimeout(=>
								syncController = App.request "get:sync:controller"
								syncController.readUnzipFile1()
					
							,3000)
						
						

						when 'file_generate'
							$('#syncStartContinue').css("display","none")
							$('#syncSuccess').css("display","block").text("Resuming sync process...")
							
							setTimeout(=>
								$('#syncSuccess').css("display","block").text("Starting file upload...")
								
					
							,3000)

							setTimeout(=>
								syncController = App.request "get:sync:controller"
								syncController.updateSyncDetails('file_upload', _.getCurrentDateTime(2))
								$('#syncSuccess').css("display","block").text("File upload completed...")
								
					
							,5000)

							setTimeout(=>
								syncController = App.request "get:sync:controller"
								syncController.getDownloadURL()
					
							,7000)
							

						when 'file_upload'
							$('#syncStartContinue').css("display","none")
							$('#syncSuccess').css("display","block").text("Resuming sync process...")

							setTimeout(=>
								syncController = App.request "get:sync:controller"
								syncController.getDownloadURL()
					
							,3000)