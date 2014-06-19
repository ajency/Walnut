define ['underscore'], ( _) ->

	#Synapse app error handlers

	_.mixin

		#Deferred error handler
		deferredErrorHandler : (d)->			
			(tx, error)->
				
				d.reject error

		
		#Failure handler
		failureHandler : (error)->

			console.log 'ERROR: '+error.message

		
		#Database transaction error handler
		transactionErrorHandler : (error)->

			console.log 'ERROR: '+error.message

		
		#File error handler
		fileErrorHandler : (error)->

			console.log 'FILE ERROR: '+error.code

		
		#File system error handler
		fileSystemErrorHandler : (evt)->

			console.log 'FILE SYSTEM ERROR: '+evt.target.error.code

		
		#Directory error handler
		directoryErrorHandler : (error)->

			console.log 'DIRECTORY ERROR: '+error.code

		
		#File transfer error handler
		fileTransferErrorHandler : (error)->

			switch error.code
				when 1 
					err_msg = 'FILE NOT FOUND'
				when 2
					err_msg = 'INVALID URL'	
				when 3
					err_msg = 'CONNECTION'
				when 4
					err_msg = 'ABORT'
				else
					err_msg = 'UNKNOWN'	

			console.log 'ERROR: '+err_msg
			console.log 'ERROR SOURCE: '+error.source
			console.log 'ERROR TARGET: '+error.target