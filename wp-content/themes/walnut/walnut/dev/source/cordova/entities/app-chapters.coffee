define ['underscore'], ( _) ->

	#Functions related to chapters entity

	_.mixin

		getChaptersByParentId : (parentId)->

			defer = $.Deferred()

			result = []

			onSuccess = (tx, data)->

				forEach = (row, i)->

					result[i]=
						term_id: row['term_id']
						name: row['name']
						slug: row['slug']
						term_group: row['term_group']
						term_taxonomy_id: row['term_taxonomy_id']
						taxonomy: row['taxonomy']
						description: row['description']
						parent: row['parent']

					
					i = i + 1
					if i < data.rows.length
						forEach data.rows.item(i), i
					else
						defer.resolve result


				forEach data.rows.item(0), 0


			_.db.transaction (tx)->

				tx.executeSql "SELECT * FROM wp_terms t, wp_term_taxonomy tt 
								WHERE t.term_id=tt.term_id 
								AND tt.taxonomy='textbook' 
								AND tt.parent=?"
								, [parentId]

				, onSuccess, _.transactionErrorHandler


			defer.promise()


		
		# Get the total count of chapters assigned to a textbook.
		getChapterCount : (parentId)->

			defer = $.Deferred()

			onSuccess = (tx, data)->

				chapter_count = data.rows.item(0)['chapter_count']
				defer.resolve chapter_count


			_.db.transaction (tx)->

				tx.executeSql "SELECT COUNT(term_id) AS chapter_count 
								FROM wp_term_taxonomy 
								WHERE parent=?"
								, [parentId]

				, onSuccess, _.transactionErrorHandler


			defer.promise()


