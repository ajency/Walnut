define ['underscore', 'unserialize'], ( _) ->

	#Functions related to content-piece entity

	_.mixin

		getPostAuthorName : (post_author_id) ->

			postAuthorName = ''
			
			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT display_name FROM wp_users WHERE ID=?" 
							, [post_author_id], success(d), _.deferredErrorHandler(d))

			success = (d)->
				(tx, data)->
					if data.rows.length isnt 0
						postAuthorName = data.rows.item(0)['display_name']

					d.resolve postAuthorName
					
			$.when(runQuery()).done ->
				console.log 'getPostAuthorName transaction completed'
			.fail _.failureHandler


		
		getGradingParams : (post_id)->

			pattern = '%parameter_%'

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_postmeta WHERE post_id=? 
							AND meta_key LIKE '"+pattern+"'", [post_id], success(d), _.deferredErrorHandler(d))


			success = (d)->
				(tx, data)->

					gradingParams = []

					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)

						do(row, i)->

							attributes = ''
							attributes = unserialize(row['meta_value']) if row['meta_value'] isnt ''

							result = 
								id : row['meta_id']
								parameter : row['meta_key'].replace('parameter_', '')
								attributes : attributes

							gradingParams[i] = result

					d.resolve gradingParams

			$.when(runQuery()).done ->
				console.log 'getGradingParams transaction completed'
			.fail _.failureHandler