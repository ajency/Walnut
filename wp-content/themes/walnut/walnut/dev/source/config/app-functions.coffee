define ['underscore', 'underscorestring'], ( _) ->

	_.mixin _.str.exports()

	# mixin to add additional functionality underscore
	_.mixin

		#Deferred error handler
		deferredErrorHandler : (d)->
			(tx, error)->
				d.reject error

		#Failure handler
		failureHandler : (error)->
			console.log 'ERROR: '+error.message

		#Database transaction error handler
		transactionErrorHandler : (tx, error)->
			console.log 'ERROR: '+error.message

		#File error handler
		fileErrorHandler : (error)->
			console.log 'FILE ERROR: '+error.code

		#File system error handler
		fileSystemErrorHandler : (evt)->
			console.log 'FILE SYSTEM ERROR: '+evt.target.error.code

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


		#Check if user is admin for app navigation based on user roles.
		getUserRole : (username)->
			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM USERS", [], onSuccess(d), _.deferredErrorHandler(d))
			
			onSuccess = (d)->
				(tx, data)->
					i = 0
					while i < data.rows.length
						r = data.rows.item(i)
						if r['username'] is username
							role = r['user_role']
						i++
					d.resolve(role)

			$.when(runQuery()).done ->
				console.log 'getUserRole transaction completed'
			.fail _.failureHandler


		#Get question_type from wp_postmeta
		getQuestionType : (content_piece_id)->
			question_type = ''
			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT meta_value FROM wp_postmeta WHERE post_id=? AND meta_key='question_type'", [content_piece_id], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					if data.rows.length isnt 0
						question_type = data.rows.item(0)['meta_value']
					d.resolve(question_type)

			$.when(runQuery()).done ->
				console.log 'getQuestionType transaction completed'
			.fail _.failureHandler


		#Get last details i.e id, status and date from wp_training_logs
		getLastDetails : (collection_id, division)->
			lastDetails = 
				id: ''
				date: ''
				status: ''

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT id, status, date FROM wp_training_logs 
							WHERE collection_id=? AND division_id=? ORDER BY id DESC LIMIT 1", [collection_id, division], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->
				(tx, data)->
					if data.rows.length isnt 0
						lastDetails.id = data.rows.item(0)['id']
						lastDetails.date  = data.rows.item(0)['date']
						lastDetails.status = data.rows.item(0)['status']
					d.resolve(lastDetails)

			$.when(runQuery()).done ->
				console.log 'getLastDetails transaction completed'
			.fail _.failureHandler			


		#Get current date
		getCurrentDate : ->
			d = new Date()
			date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()
			date		