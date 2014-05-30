define ['underscore', 'unserialize'], ( _) ->

	# Functions related to app sync

	_.mixin

		getTotalSyncDetailsCount : ->
			console.log 'getTotalSyncDetailsCount'

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT COUNT(*) AS count FROM sync_details", []
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->

					count = data.rows.item(0)['count']
					d.resolve count

			$.when(runQuery()).done ->
				console.log 'getTotalSyncDetailsCount transaction completed'
			.fail _.failureHandler