define ['underscore', 'unserialize'], ( _) ->

	#Functions related to media entity

	_.mixin

		getListOfMediaByID : (ids)->
			defer = $.Deferred()
			result = []

				
			forEach = (mediaId, index)->
				
				_.getMediaById mediaId
				.then (data)->
					result[index] = data
				i = i + 1

				if i < _.size(ids)
					forEach ids[i], i

				else
					defer.resolve result
			
			forEach ids[0], 0

			defer.promise()



		getMediaById : (id)->
			
			defer = $.Deferred()

			onSuccess = (tx,data)->
				
				result = []

				if data.rows.length is 0
					defer.resolve result
				else

					forEach = (row, i)->

						_.getAttachmentData id
						.then (data)->

							url = row['guid']
							mediaUrl = _.getSynapseMediaDirectoryPath() + url.substr(url.indexOf("uploads/"))

							if data.sizes
								sizes = data.sizes
								full = full: {}
								_.extend(sizes, full)

								_.each sizes, (size)->
									size.url = mediaUrl
							else
								sizes = ''
							
							result = 
								id: row['ID']
								filename: data.file
								url: mediaUrl
								mime: row['post_mime_type']
								icon: ''
								sizes: sizes
								height: data.height
								width: data.width

							i = i + 1

							if ( i < data.rows.length)
								forEach data.rows.item(i), i

							else
								defer.resolve result

					forEach data.rows.item(0), 0



			_.db.transaction (tx)->
				
				tx.executeSql "SELECT * FROM wp_posts 
								WHERE id=?"
								, [id]
				, onSuccess, _.transactionErrorHandler

			defer.promise()


		

		# get meta_value from wp_postmeta having meta_key='_wp_attachment_metadata'
		getAttachmentData : (id)->

			defer = $.Deferred()

			onSuccess = (tx,data)->
				meta_value = ''
				if data.rows.length isnt 0
					meta_value = unserialize(data.rows.item(0)['meta_value'])
				
				defer.resolve(meta_value)
			

			_.db.transaction (tx)->
				
				tx.executeSql "SELECT * FROM wp_postmeta 
								WHERE meta_key=? 
								AND post_id=?"
								, ['_wp_attachment_metadata', id]
				, onSuccess, _.transactionErrorHandler

			defer.promise()
