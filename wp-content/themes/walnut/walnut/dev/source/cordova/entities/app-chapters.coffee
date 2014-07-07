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
							term_order: row['term_order']
							term_taxonomy_id: row['term_taxonomy_id']
							taxonomy: row['taxonomy']
							description: row['description']
							parent: row['parent']
							count: row['count']#Questions
							thumbnail: ''
							cover_pic: ''
							author: ''
							classes: null
							subjects: null
							modules_count: ''
							chapter_count: ''#Sections
					
					d.resolve result

			$.when(runQuery()).done (d)->
				console.log 'getChaptersByParentId transaction completed'
			.fail _.failureHandler