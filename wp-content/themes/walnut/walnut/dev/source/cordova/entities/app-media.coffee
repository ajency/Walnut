define ['underscore', 'unserialize'], ( _) ->

	#Functions related to media entity

	_.mixin

		getMediaById : (id)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_posts WHERE id=?", [id]
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->

					row = data.rows.item(0)

					attachmentData = _.getAttachmentData id
					attachmentData.done (data)->

						url = row['guid']
						mediaUrl = _.getSynapseMediaDirectoryPath() + url.substr(url.indexOf("uploads/"))

						full = {
							full: {}
						}
						_.extend(data.sizes, full)

						if data.sizes
							_.each data.sizes, (size)->
								size.url = mediaUrl
						else
							data.sizes = ''
						
						result = 
							id: row['ID']
							filename: data.file
							url: mediaUrl
							mime: row['post_mime_type']
							icon: ''
							sizes: data.sizes
							height: data.height
							width: data.width

						d.resolve result    

			
			$.when(runQuery()).done ->
				console.log 'getMediaById transaction completed'
			.fail _.failureHandler

		

		# get meta_value from wp_postmeta having meta_key='_wp_attachment_metadata'
		getAttachmentData : (id)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_postmeta WHERE meta_key=? 
							AND post_id=?", ['_wp_attachment_metadata', id]
							, success(d), _.deferredErrorHandler(d))

			success = (d)->
				(tx, data)->
					meta_value = ''
					if data.rows.length isnt 0
						meta_value = unserialize(data.rows.item(0)['meta_value'])
					
					d.resolve(meta_value)

			$.when(runQuery()).done ->
				console.log 'getAttachmentData transaction completed'
			.fail _.failureHandler