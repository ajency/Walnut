define ['underscore'], ( _) ->

	#Functions related to user entity

	_.mixin

		getStudentsByDivision : (division)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_users u INNER JOIN wp_usermeta um 
							ON u.ID=um.user_id AND um.meta_key='student_division' AND um.meta_value=?"
							, [division], onSuccess(d), _.deferredErrorHandler(d));
						

			onSuccess = (d)->
				(tx, data)->

					result = []

					for i in [0..data.rows.length-1] by 1

						row = data.rows.item(i)
						
						result[i] = 
							ID: row['ID']
							display_name: row['display_name']
							user_email: row['user_email']
							profile_pic: '/images/avtar.png'

					d.resolve(result)

			$.when(runQuery()).done (data)->
				console.log 'getStudentsByDivision transaction completed'
			.fail _.failureHandler



		getNamesOfAllOfflineUsers : ->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				result = []

				forEach = (row, i)->

					result[i] = username: row['username']

					i = i + 1

					if i < data.rows.length
						forEach data.rows.item(i), i
					else
						defer.resolve result
						console.log 'getNamesOfAllOfflineUsers done'

				forEach data.rows.item(0), 0


			_.db.transaction (tx)->

				tx.executeSql "SELECT username 
								FROM USERS", []

				, onSuccess, _.transactionErrorHandler


			defer.promise()

			
