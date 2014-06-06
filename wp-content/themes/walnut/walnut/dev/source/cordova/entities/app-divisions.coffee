define ['underscore', 'unserialize'], ( _) ->

	#Functions related to divisions entity

	_.mixin

		getDivisionIds : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE user_id=? 
							AND meta_key=?", [_.getUserID(), 'divisions']
							,onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					ids = ''
					if data.rows.length isnt 0
						ids = unserialize(unserialize(data.rows.item(0)['meta_value']))

					d.resolve ids

			$.when(runQuery()).done ->
				console.log 'getDivisionIds transaction completed'
			.fail _.failureHandler


		
		getStudentsCount : (id)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT COUNT(umeta_id) AS students_count FROM wp_usermeta 
							WHERE meta_key=? AND meta_value=?", ['student_division', id]
							,onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					students_count = data.rows.item(0)['students_count']
					d.resolve students_count

			$.when(runQuery()).done ->
				console.log 'getStudentsCount transaction completed'
			.fail _.failureHandler


		
		fetchSingleDivision	: (id)->

			divisionData = id:'', division:'', class_id:'', class_label:'', students_count:''

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"class_divisions 
							WHERE id=?", [id], onSuccess(d), _.deferredErrorHandler(d))

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


		getAllDivisions : ->

			runFunc = ->
				$.Deferred (d)->

					divisionIds = _.getDivisionIds()
					divisionIds.done (ids)->
						
						if _.isArray(ids)
							ids = _.compact ids.reverse()

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


		getDivisionById : (id)->

			runFunc = ->
				$.Deferred (d)->

					division = _.fetchSingleDivision(id)
					division.done (result)->

						d.resolve result

			$.when(runFunc()).done ->
				console.log 'getDivisionById done'
			.fail _.failureHandler