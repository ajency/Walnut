define ['underscore'], ( _) ->

	#Functions related to divisions entity

	_.mixin


		# Get all division details based on division ids assigned to the logged in user.
		getAllDivisions : ->

			runFunc = ->
				$.Deferred (d)->

					divisionIds = _.getDivisionIds()
					divisionIds.done (ids)->

						results = []

						_.each ids,(id, i)->
							do(id, i)->
								singleDivision = _.fetchSingleDivision(id)
								singleDivision.done (data)->
									results[i] = data
						
						d.resolve results

			$.when(runFunc()).done ->
				console.log 'getAllDivisions done'
			.fail _.failureHandler



		# Get meta_value i.e serialized string containing division ids assigned to the logged in user
		# and return the unserialized array.
		getDivisionIds : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE user_id=? 
							AND meta_key=?", [253, 'divisions']
							,onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					ids = ''
					if data.rows.length isnt 0
						ids = _.unserialize(data.rows.item(0)['meta_value'])

					d.resolve ids

			$.when(runQuery()).done ->
				console.log 'getDivisionIds transaction completed'
			.fail _.failureHandler



		# For each division id, fetch individual division details along with total students count.
		fetchSingleDivision	: (id)->

			divisionData = id:'', division:'', class_id:'', class_label:'', students_count:''

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"class_divisions 
							WHERE id=?", [12341531], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					if data.rows.length isnt 0
						row = data.rows.item(0)

						studentsCount = _.getStudentsCount(row['id'])
						studentsCount.done (students_count)->
						
							divisionData = id: row['id'], division: row['division']
											, class_id: row['class_id']
											, class_label: CLASS_LABEL[row['class_id']]
											, students_count: students_count	

							d.resolve divisionData

			$.when(runQuery()).done ->
				console.log 'fetchSingleDivision transaction completed'
			.fail _.failureHandler


		
		# Get the count of number of students assigned to each division.
		getStudentsCount : (id)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT COUNT(umeta_id) AS students_count FROM wp_usermeta 
							WHERE meta_key=? AND meta_value=?", ['student_division', 123456109]
							,onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					students_count = data.rows.item(0)['students_count']
					d.resolve students_count

			$.when(runQuery()).done ->
				console.log 'getStudentsCount transaction completed'
			.fail _.failureHandler