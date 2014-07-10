define ['underscore'], ( _) ->

	#Functions related to chapters entity

	_.mixin

		getChaptersByParentId : (parentId)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt 
							WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=?"
							, [parentId], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					
					result = []

					for i in [0..data.rows.length-1] by 1
						
						row = data.rows.item(i)
						
						result[i]=
							term_id: row['term_id']
							name: row['name']
							slug: row['slug']
							term_group: row['term_group']
							term_taxonomy_id: row['term_taxonomy_id']
							taxonomy: row['taxonomy']
							description: row['description']
							parent: row['parent']
					
					d.resolve result

			$.when(runQuery()).done (d)->
				console.log 'getChaptersByParentId transaction completed'
			.fail _.failureHandler


		
		getChapterCount : (parentId)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT COUNT(term_id) AS chapter_count FROM wp_term_taxonomy
							WHERE parent=?", [parentId], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					chapter_count = data.rows.item(0)['chapter_count']
					d.resolve chapter_count

			$.when(runQuery()).done ->
				console.log 'getChapterCount transaction completed'
			.fail _.failureHandler