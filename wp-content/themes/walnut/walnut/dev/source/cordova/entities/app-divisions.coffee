define ['underscore'], ( _) ->

	#Functions related to divisions entity

	_.mixin


		# Get all division details based on division ids assigned to the logged in user.
		getAllDivisions : ->
			
			defer = $.Deferred()

			_.getDivisionIds()
			.then (ids)->
				
				results = []

				_.each ids,(id, i)->

					_.fetchSingleDivision id
					.then (data)->
						
						results[i] = data
					
						defer.resolve results

			defer.promise()




		# Get meta_value i.e serialized string containing division ids assigned to the logged in user
		# and return the unserialized array.
		
		getDivisionIds : ->

			defer = $.Deferred()

			onSuccess = (tx,data)->

				ids = ''
				

				if data.rows.length isnt 0
					ids = _.unserialize(data.rows.item(0))['meta_value']
				

				defer.resolve ids

			
			_.db.transaction (tx)->
				
				tx.executeSql "SELECT meta_value 
								FROM wp_usermeta 
								WHERE user_id=? 
								AND meta_key=?"
								, [_.getUserID(), 'divisions']
				,onSuccess, _.transactionErrorHandler

			
			defer.promise()




		# For each division id, fetch individual division details along with total students count.
		fetchSingleDivision	: (id)->

			divisionData = id:'', division:'', class_id:'', class_label:'', students_count:''


			defer = $.Deferred()


			onSuccess = (tx,data)->

				
				if data.rows.length isnt 0
					row = data.rows.item(0)


					_.getUserDetails(_.getUserID())
					.then (userDetails)->


						_.getStudentsCountForBlogId(userDetails.blog_id)
						.then (students_count_classid_value)->


							_.getStudentsCount(row['id'], students_count_classid_value)
							.then (students_count)->


								divisionData = id: row['id']
												, division: row['division']
												, class_id: row['class_id']
												, class_label: CLASS_LABEL[row['class_id']]
												, students_count: students_count	

								
								defer.resolve divisionData
				


			_.db.transaction (tx)->
				
				tx.executeSql "SELECT * FROM 
								"+_.getTblPrefix()+"class_divisions 
								WHERE id=?", [id]
				,onSuccess, _.transactionErrorHandler

			defer.promise()




		getStudentsCountForBlogId : (blog_id)->

			defer = $.Deferred()


			onSuccess = (tx,data)->


				students_count_classid_value = []


				forEach = (row, i)->

					students_count_classid_value.push row['user_id']


					i = i + 1
					
					if (i < data.rows.length)
						forEach data.rows.item(i), i
					else 
						defer.resolve students_count_classid_value
				
				
				forEach data.rows.item(0), 0
			

			_.db.transaction (tx)->
				
				tx.executeSql "SELECT user_id FROM wp_usermeta 
								WHERE meta_key=? 
								AND meta_value=?"
								, ['primary_blog', blog_id]
				,onSuccess, _.transactionErrorHandler


			defer.promise()





		# Get the count of number of students assigned to each division.
		getStudentsCount : (division_id, ids)->

			ids = ids.join()

			defer = $.Deferred()

			onSuccess = (tx,data)->
				students_count = data.rows.item(0)['students_count']
				defer.resolve students_count

			_.db.transaction (tx)->
				
				tx.executeSql "SELECT COUNT(user_id) AS students_count 
								FROM wp_usermeta 
								WHERE meta_key=? 
								AND meta_value=? 
								AND user_id IN ("+ids+")"
								, ['student_division',division_id]
				
				,onSuccess, _.transactionErrorHandler
			

			defer.promise()