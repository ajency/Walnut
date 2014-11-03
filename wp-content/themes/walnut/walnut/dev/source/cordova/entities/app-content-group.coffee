define ['underscore', 'unserialize'], ( _) ->

	#Functions related to content-group entity

	_.mixin


		cordovaContentGroupCollection : (textbookId, division)->

			defer = $.Deferred()

			result = []

			_.getContentGroupByTextbookId(textbookId)
			.then (contentGroupData)->
				console.log 'getContentGroupByTextbookId done'

				length = contentGroupData.rows.length

				if length is 0
					defer.resolve result
				else
					forEach = (row, i)->

						_.getContentPiecesAndDescription(row['id'])
						.then (contPiecesNDesc)->
							console.log 'getContentPiecesAndDescription done'

							contentPieces = _.unserialize(contPiecesNDesc.content_pieces)
							description = _.unserialize(contPiecesNDesc.description)

							_.getDateAndStatus(row['id'], division, contentPieces)
							.then (dateNStatus)->
								console.log 'getDateAndStatus done'

								status = dateNStatus.status
								date = dateNStatus.start_date

								if not (row['status'] is 'archive' and status is 'not started')
												
									data = 
										id: row['id']
										name: row['name']
										created_on: row['created_on']
										created_by: row['created_by']
										last_modified_on: row['last_modified_on']
										last_modified_by: row['last_modified_by']
										published_on: row['published_on']
										published_by: row['published_by']
										type: row['type']
										term_ids: unserialize(row['term_ids'])
										duration: _.getDuration(row['duration'])
										minshours: _.getMinsHours(row['duration'])
										total_minutes: row['duration']
										status: status
										training_date: date
										content_pieces: contentPieces
										description: description
										post_status: row['status']

									result.push data


								i = i + 1
								if i < length
									forEach contentGroupData.rows.item(i), i 
								else 
									defer.resolve result


					forEach contentGroupData.rows.item(0), 0


			defer.promise()



		
		getContentGroupByTextbookId : (textbookId)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				defer.resolve data


			_.db.transaction (tx)->

				pattern = '%"'+textbookId+'"%'

				tx.executeSql "SELECT * 
								FROM wp_content_collection 
								WHERE term_ids LIKE '"+pattern+"' 
								AND status IN ('publish', 'archive') 
								AND type=?"
								, ['teaching-module']

				, onSuccess, _.transactionErrorHandler


			defer.promise()


		
		
		getContentGroupById : (id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				row = data.rows.item(0)

				_.getContentPiecesAndDescription(row['id'])
				.then (contPiecesNDesc)->
					console.log 'getContentPiecesAndDescription done'

					contentPieces = _.unserialize(contPiecesNDesc.content_pieces)
					description = _.unserialize(contPiecesNDesc.description)

					result = 
						id: row['id']
						name: row['name']
						created_on: row['created_on']
						created_by: row['created_by']
						last_modified_on: row['last_modified_on']
						last_modified_by: row['last_modified_by']
						published_on: row['published_on']
						published_by: row['published_by']
						type: row['type']
						term_ids: unserialize(row['term_ids'])
						duration: _.getDuration(row['duration'])
						minshours: _.getMinsHours(row['duration'])
						total_minutes: row['duration']
						status: row['status']
						content_pieces: contentPieces
						description: description

					defer.resolve result


			_.db.transaction (tx)->

				tx.executeSql "SELECT * 
								FROM wp_content_collection 
								WHERE id=?"
								, [id]

				, onSuccess, _.transactionErrorHandler


			defer.promise()
			



		getContentPiecesAndDescription : (collection_id)->

			defer = $.Deferred()

			contentPiecesAndDescription = content_pieces: '', description: ''

			onSuccess = (tx, data)->

				length = data.rows.length

				if length is 0
					defer.resolve contentPiecesAndDescription
				else
					forEach = (row, i)->

						if row['meta_key'] is 'description'
							contentPiecesAndDescription.description = row['meta_value']

						if row['meta_key'] is 'content_pieces'
							contentPiecesAndDescription.content_pieces = row['meta_value']

						i = i + 1
						if i < length
							forEach data.rows.item(i), i 
						else
							defer.resolve contentPiecesAndDescription

					forEach data.rows.item(0), 0


			_.db.transaction (tx)->

				tx.executeSql "SELECT * 
								FROM wp_collection_meta 
								WHERE collection_id=?"
								,[collection_id]

				, onSuccess, _.transactionErrorHandler


			defer.promise()



		
		getDateAndStatus : (collection_id, division, content_pieces)->

			defer = $.Deferred()

			data = start_date:'', status:''

			_.getModuleResponses(collection_id, division)
			.then (module_responses)->
				console.log 'getModuleResponses done'

				if _.isEmpty module_responses
					data.status = 'not started'

				if not _.isEmpty module_responses
					if _.first(module_responses).status is 'scheduled' 
						data.status = 'scheduled'
					else data.status = 'started'

					data.start_date = _.last(module_responses).start_date

					response_content_ids = []

					_.each module_responses, (response, key)->
						if response.status is 'completed'
							response_content_ids[key] = response.content_piece_id

					if (content_pieces.length - response_content_ids.length) is 0
						data.status = 'completed'


				defer.resolve data

			defer.promise()




		#Get content_piece_id, status, start_date from table 'wp_question_response'
		getModuleResponses : (collection_id, division)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				result = []

				length = data.rows.length

				if length is 0
					defer.resolve result
				else 
					forEach = (row, i)->

						result[i] = row

						i = i + 1
						if i < length
							forEach data.rows.item(i), i 
						else
							defer.resolve result

					forEach data.rows.item(0), 0


			_.db.transaction (tx)->

				tx.executeSql "SELECT content_piece_id, status, start_date 
								FROM "+_.getTblPrefix()+"question_response 
								WHERE collection_id=? 
								AND division=?"
								, [collection_id, division]

				, onSuccess, _.transactionErrorHandler


			defer.promise()
		

		
		
		getDuration : (duration)->

			if duration > 60
				duration/60
			else
				duration

		
		getMinsHours : (duration)->

			if duration > 60
				'hrs'
			else 'mins'	

			