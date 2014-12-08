define ['underscore'], ( _) ->

	#Functions related to media entity

	_.mixin
	

		getListOfMediaByID : (ids)->

			defer = $.Deferred()

			result = []

			length = ids.length

			if length is 0
				defer.resolve result
			else
				forEach = (mediaId, index)->

					_.getMediaById(mediaId)
					.then (mediaData)->
						console.log 'getMediaById done'

						result[index] = mediaData

						index = index + 1
						if index < length
							forEach ids[index], index
						else 
							defer.resolve result


				forEach ids[0], 0


			defer.promise()



		getMediaById : (id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				row = data.rows.item(0)

				_.getAttachmentData id
				.then (attachmentData)->
					console.log 'getAttachmentData done'

					url = row['guid']
					mediaUrl = _.getSynapseMediaDirectoryPath() + url.substr(url.indexOf("uploads/"))

					if attachmentData.sizes
						sizes = attachmentData.sizes
						full = full: {}
						_.extend(sizes, full)

						_.each sizes, (size)->
							size.url = mediaUrl
					else
						sizes = ''
					
					media = 
						id: row['ID']
						filename: attachmentData.file
						url: mediaUrl
						mime: row['post_mime_type']
						icon: ''
						sizes: sizes
						height: attachmentData.height
						width: attachmentData.width

					defer.resolve media 

			
			_.db.transaction (tx)->

				tx.executeSql "SELECT * 
								FROM wp_posts 
								WHERE id=?"
								, [id]

				, onSuccess, _.transactionErrorHandler


			defer.promise()

		

		# get meta_value from wp_postmeta having meta_key='_wp_attachment_metadata'
		getAttachmentData : (id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				meta_value = ''

				if data.rows.length isnt 0
					meta_value = _.unserialize(data.rows.item(0)['meta_value'])
				
				defer.resolve meta_value

			
			_.db.transaction (tx)->

				tx.executeSql "SELECT * 
								FROM wp_postmeta 
								WHERE meta_key=? 
								AND post_id=?"
								, ['_wp_attachment_metadata', id]

				, onSuccess, _.transactionErrorHandler


			defer.promise()

