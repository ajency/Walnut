define ['underscore', 'unserialize'], ( _) ->

	# mixin to add additional functionality underscore
	_.mixin

		getTblPrefix : ->
			'wp_'+_.getBlogID()+'_'

	
		#Get all user details from local database
		getUserDetails : (userid, username)->

			userData = user_id : '', username: '', password: '', role : '', exists : false

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						if username isnt null
							tx.executeSql("SELECT * FROM USERS WHERE username=?"
								, [username], onSuccess(d), _.deferredErrorHandler(d))

						if userid isnt null
							tx.executeSql("SELECT * FROM USERS WHERE user_id=?"
								, [userid], onSuccess(d), _.deferredErrorHandler(d))	
			
			onSuccess = (d)->
				(tx, data)->

					if data.rows.length isnt 0
						row = data.rows.item(0)
						userData =
							user_id : row['user_id']
							username: row['username']
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
				instructions: ''

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

						if row['meta_key'] is 'instructions'
							meta_value.instructions = row['meta_value']				

					d.resolve(meta_value)

			$.when(runQuery()).done ->
				console.log 'getMetaValue transaction completed'
			.fail _.failureHandler


		#Get additional textbook options
		getTextbookOptions : (id)->

			options =
				author:''
				attachmenturl:''

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT option_value FROM wp_options WHERE option_name=?"
							, ['taxonomy_'+id], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					if data.rows.length isnt 0
						option_value = unserialize(data.rows.item(0)['option_value'])

						url = option_value.attachmenturl
						if url is 'false'
							attachmenturl = ''
						else
							attachmenturl = _.getSynapseAssetsDirectoryPath()+url.substr(url.indexOf("uploads/"))
							attachmenturl = '<img src="'+attachmenturl+'">'

						options = 
							author: option_value.author
							attachmenturl: attachmenturl

					d.resolve options
					
			$.when(runQuery()).done ->
				console.log 'getTextbookOptions transaction completed'
			.fail _.failureHandler	


		#Insert new records in wp_question_response_logs
		updateQuestionResponseLogs : (refID)->

			_.db.transaction((tx)->
				tx.executeSql('INSERT INTO '+_.getTblPrefix()+'question_response_logs 
					(qr_ref_id, start_time, sync) VALUES (?,?,?)'
					, [refID, _.getCurrentDateTime(2), 0])

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
			