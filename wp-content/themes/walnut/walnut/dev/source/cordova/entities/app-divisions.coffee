define ['underscore'], ( _) ->

	#Functions related to divisions entity

	_.mixin


		cordovaDivisionCollection : ->

			defer = $.Deferred()

			_.getDivisionIds()
			.then (ids)->
				console.log 'getDivisionIds done'

				results = []

				length = ids.length

				if length is 0
					defer.resolve results
				else
					forEach = (id, i)->

						_.fetchSingleDivision(id)
						.then (divisionData)->
							console.log 'fetchSingleDivision done'

							results[i] = divisionData

							i = i + 1
							if i < ids.length
								forEach ids[i], i
							else
								defer.resolve results

					forEach ids[0], 0


			defer.promise()

		


		# Get meta_value i.e serialized string containing division ids assigned to the logged in user
		# and return the unserialized array.
		getDivisionIds : ->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				ids = ''
				if data.rows.length isnt 0
					ids = _.unserialize(data.rows.item(0)['meta_value'])

				defer.resolve ids


			_.db.transaction (tx)->

				tx.executeSql "SELECT meta_value 
								FROM wp_usermeta 
								WHERE user_id=? 
								AND meta_key=?"
								, [_.getUserID(), 'divisions']

				, onSuccess, _.transactionErrorHandler


			defer.promise()



		# For each division id, fetch individual division details along with total students count.
		fetchSingleDivision	: (id)->

			defer = $.Deferred()

			divisionData = id:'', division:'', class_id:'', class_label:'', students_count:''

			onSuccess = (tx, data)->

				if data.rows.length isnt 0
					row = data.rows.item(0)

					_.getStudentsCount(row['id'])
					.then (students_count)->
						console.log 'getStudentsCount done'
					
						divisionData = id: row['id'], division: row['division']
										, class_id: row['class_id']
										, class_label: CLASS_LABEL[row['class_id']]
										, students_count: students_count	

						defer.resolve divisionData


			_.db.transaction (tx)->

				tx.executeSql "SELECT * 
								FROM "+_.getTblPrefix()+"class_divisions 
								WHERE id=?"
								, [id]

				, onSuccess, _.transactionErrorHandler


			defer.promise()


		
		# Get the count of number of students assigned to each division.
		getStudentsCount : (id)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				students_count = data.rows.item(0)['students_count']
				defer.resolve students_count


			_.db.transaction (tx)->

				tx.executeSql "SELECT COUNT(umeta_id) AS students_count 
								FROM wp_usermeta 
								WHERE meta_key=? 
								AND meta_value=?"
								, ['student_division', id]

				, onSuccess, _.transactionErrorHandler


			defer.promise()


