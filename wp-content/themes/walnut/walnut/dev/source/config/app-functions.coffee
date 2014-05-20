define ['underscore', 'unserialize'], ( _) ->

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
		transactionErrorHandler : (error)->

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


		#Get all user details from local database
		getUserDetails : (username)->

			userData = 
				user_id : ''
				password: ''
				role : ''
				exists : false

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM USERS WHERE username=?"
							, [username], onSuccess(d), _.deferredErrorHandler(d))
			
			onSuccess = (d)->
				(tx, data)->

					if data.rows.length isnt 0
						row = data.rows.item(0)
						userData =
							user_id : row['user_id']
							password : row['password']
							role : row['user_role']
							exists : true

					d.resolve(userData)

			$.when(runQuery()).done ->
				console.log 'getUserDetails transaction completed'
			.fail _.failureHandler


		#Get meta_value from wp_postmeta
		getMetaValue : (content_piece_id)->

			meta_value = 
				question_type : ''
				content_type : ''
				layout_json : ''
				post_tags : ''
				duration : ''
				last_modified_by : ''
				published_by : ''
				term_ids : ''

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_postmeta WHERE post_id=?"
							, [content_piece_id], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)

						if row['meta_key'] is 'question_type'
							meta_value.question_type = row['meta_value']

						if row['meta_key'] is 'content_type'
							meta_value.content_type = row['meta_value']

						if row['meta_key'] is 'layout_json'
							meta_value.layout_json = unserialize(unserialize(row['meta_value']))

						if row['meta_key'] is 'post_tags'
							meta_value.post_tags = row['meta_value']
						
						if row['meta_key'] is 'duration'
							meta_value.duration = row['meta_value']

						if row['meta_key'] is 'last_modified_by'
							meta_value.last_modified_by = row['meta_value']
							
						if row['meta_key'] is 'published_by'
							meta_value.published_by = row['meta_value']
							
						if row['meta_key'] is 'term_ids'
							meta_value.term_ids = unserialize(unserialize(row['meta_value']))				

					d.resolve(meta_value)

			$.when(runQuery()).done ->
				console.log 'getMetaValue transaction completed'
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
							WHERE collection_id=? AND division_id=? ORDER BY id DESC LIMIT 1"
							, [collection_id, division], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->
				(tx, data)->
					if data.rows.length isnt 0
						row = data.rows.item(0)

						lastDetails =
							id : row['id']
							date : row['date']
							status : row['status']

					d.resolve(lastDetails)

			$.when(runQuery()).done ->
				console.log 'getLastDetails transaction completed'
			.fail _.failureHandler	


		#Insert new records in wp_question_response_logs
		updateQuestionResponseLogs : (refID)->

			_.db.transaction((tx)->
				tx.executeSql('INSERT INTO wp_question_response_logs (qr_ref_id, start_time, sync) 
					VALUES (?,?,?)', [refID, _.getCurrentDateTime(2), 0])

			,_.transactionErrorHandler
            ,(tx)->
                console.log 'SUCCESS: Inserted new record in wp_question_response_logs'
            )	



		#Get current date
		getCurrentDateTime : (bit)->
			# bit = 0 - date
			# 	  = 1 - time 
			# 	  = 2 - date and time

			d = new Date()
			date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()
			time = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()

			return date if bit is 0
			return time if bit is 1
			return date+' '+time if bit is 2