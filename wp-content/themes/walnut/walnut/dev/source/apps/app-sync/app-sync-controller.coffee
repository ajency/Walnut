define ["marionette","app", "underscore", "csvparse" ], (Marionette, App, _, parse) ->

	class SynchronizationController extends Marionette.Controller


		initialize : ->

			@displayTotalRecordsToBeSynced()

			@displayLastDownloadTimeStamp()

			@changeSyncButtonTextBasedOnLastSyncOperation()


		
		displayTotalRecordsToBeSynced : ->

			totalRecordsTobeSynced = _.getTotalRecordsTobeSynced()
			totalRecordsTobeSynced.done (totalRecords)->
				
				if totalRecords is 0
					$('#totalRecordsToBeSynced').text("Data already upto date")
				else
					$('#totalRecordsToBeSynced')
					.text(""+totalRecords+" record(s) to be synced")


		displayLastDownloadTimeStamp : ->

			lastSyncOperation = _.getLastSyncOperation()
			lastSyncOperation.done (typeOfOperation)->

				if typeOfOperation is 'file_import'

					lastDownloadTimeStamp = _.getLastDownloadTimeStamp()
					lastDownloadTimeStamp.done (time_stamp)->
						
						escaped = $('<div>').text("Last synced on \n"+time_stamp+"").text()
						$('#lastDownloadTimeStamp').html(escaped.replace(/\n/g, '<br />'))

				else
					$('#totalRecords').css("display","none")
					$('#lastDownload').css("display","none")



		
		changeSyncButtonTextBasedOnLastSyncOperation : ->

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



		startContinueDataSyncProcess : ->

			# Hide sync details
			$('#totalRecords').css("display","none")
			$('#lastDownload').css("display","none") 

			# Hide error message
			$('#syncError').css("display","none")

			# Create 'SynapseData' inside 'SynapseAssets' directory
			synapseDataDirectory = _.createSynapseDataDirectory()
			synapseDataDirectory.done ->

				lastSyncOperation = _.getLastSyncOperation()
				lastSyncOperation.done (typeOfOperation)->
					
					switch typeOfOperation
						
						when 'none'
							$('#syncStartContinue').css("display","none")
							
							$('#syncSuccess').css("display","block").text("Started sync process...")
							
							setTimeout(=>
								_.getZipFileDownloadDetails()
							,2000)
							
						
						when 'file_import'
							$('#syncStartContinue').css("display","none")

							$('#syncSuccess').css("display","block").text("Started sync process...")
							
							setTimeout(=>
								_.generateZipFile()
							,2000)
						
						
						when 'file_download'
							$('#syncStartContinue').css("display","none")

							$('#syncSuccess').css("display","block").text("Resuming sync process...")

							setTimeout(=>
								_.startFileImport()
							,2000)
						

						when 'file_generate'
							$('#syncStartContinue').css("display","none")

							$('#syncSuccess').css("display","block").text("Resuming sync process...")
							
							setTimeout(=>
								_.uploadGeneratedZipFile()
							,2000)
							

						when 'file_upload'
							$('#syncStartContinue').css("display","none")

							$('#syncSuccess').css("display","block").text("Resuming sync process...")

							setTimeout(=>
								_.checkIfServerImportOperationCompleted()
							,2000)


		
		startMediaSyncProcess : ->

			# Hide error message
			$('#syncMediaError').css("display","none")
			
			$('#syncMediaStart').css("display","none")
			
			$('#syncMediaSuccess').css("display","block").text("Started media sync process...")
			
			setTimeout(=>
				_.startMediaSync()
			,2000)


	

	# Request Handler
	App.reqres.setHandler "get:sync:controller", ->
		new SynchronizationController