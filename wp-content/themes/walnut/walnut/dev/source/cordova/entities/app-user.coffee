define ['underscore'], ( _) ->

	#Functions related to user entity

	_.mixin

		getStudentsByDivision : (division)->
			
			defer = $.Deferred()
			
			onSuccess = (tx, data)->

				result = []

				forEach = (row,i)->

					result[i] = 
						ID: row['ID']
						display_name: row['display_name']
						user_email: row['user_email']
						profile_pic: '/images/avtar.png'


					i = i + 1
					if (i < data.rows.length)
						forEach data.rows.item(i), i
					else
						defer.resolve result


				forEach data.rows.item(0), 0

			_.db.transaction (tx)->
				
				tx.executeSql "SELECT * FROM wp_users u INNER JOIN wp_usermeta um 
					ON u.ID=um.user_id AND um.meta_key='student_division' AND um.meta_value=?"
					, [division]
				, onSuccess, _.transactionErrorHandler


			defer.promise()



		getNamesOfAllOfflineUsers : ->

			defer = $.Deferred()

			onSuccess =(tx, data)->

					result = []

					forEach = (row,i)->
						
						result[i] = 
							username: data.rows.item(i)['username']
						
						console.log JSON.stringify result[i]

						i = i + 1
						if (i < data.rows.length)
							forEach data.rows.item(i), i
						else
							defer.resolve result

					forEach data.rows.item(0), 0
			
			_.db.transaction (tx)->
				tx.executeSql "SELECT username FROM USERS"
					, []
				, onSuccess, _.transactionErrorHandler

			defer.promise()