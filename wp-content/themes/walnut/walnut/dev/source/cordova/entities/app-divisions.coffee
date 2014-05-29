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
					if data.results.length isnt 0
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



		getAllDivisions : ->

			divisionIds = _.getDivisionIds()
			divisionIds.done (ids)->
				console.log ''

				



									