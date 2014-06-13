define ['underscore', 'unserialize'], ( _) ->

	#Functions related to media entity

	_.mixin

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
