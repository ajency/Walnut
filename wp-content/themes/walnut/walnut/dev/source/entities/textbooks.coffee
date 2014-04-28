define ["app", 'backbone', 'unserialize'], (App, Backbone) ->

		App.module "Entities.Textbooks", (Textbooks, App, Backbone, Marionette, $, _)->

			# textbook model
			class Textbooks.ItemModel extends Backbone.Model

				idAttribute : 'term_id'

				defaults:
					name       		   	: ''
					slug    			: ''
					description        	: ''
					parent      	   	: 0
					term_order 			: 0
					count	 			: 0
					chapter_count		: 0

				name: 'textbook'

			# textbooks collection class
			class Textbooks.ItemCollection extends Backbone.Collection
				model : Textbooks.ItemModel
				name : 'textbooks'
				comparator : 'term_order'
				url :->
					 AJAXURL + '?action=get-textbooks'
				
				parse:(resp)->
					@total = resp.count	
					resp.data

			textbookCollection = new Textbooks.ItemCollection

			# API 
			API =
				# get all textbooks
				getTextbooks:(param = {})->
					textbookCollection.fetch
										reset : true
										data  : param

					textbookCollection


				getTextBookByID:(id)->
					textbook = textbookCollection.get id

					if not textbook 
						textbook = new Textbooks.ItemModel term_id : id
						console.log textbook
						textbook.fetch()
					textbook


				# get all textbooks from local database
				getTextbooksFromLocal:->
					runQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt 
									LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id  
									WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0", [], onSuccess(d), onFailure(d));
								

					onSuccess =(d)->
						(tx,data)->
							console.log 'Textbook success'
							result = []
							i = 0
							while i < data.rows.length
								row = data.rows.item(i)
								
								classes = subjects = ''
								classes = unserialize(row["class_id"]) if row["class_id"] isnt ''
								subjects = unserialize(row["tags"]) if row["tags"] isnt ''
								
								result[i] = 
									term_id: row["term_id"]
									name: row["name"]
									slug: row["slug"]
									term_group: row["term_group"]
									term_order: row["term_order"]
									term_taxonomy_id: row["term_taxonomy_id"]
									taxonomy: row["taxonomy"]
									description: row["description"]
									parent: row["parent"]
									count: row["count"]
									classes: classes
									subjects: subjects

								i++	
		
							d.resolve(result)


					onFailure =(d)->
						(tx,error)->
							d.reject('OnFailure!: '+error)

					$.when(runQuery()).done (data)->
						console.log 'getAllTextbooks transaction completed'
						
					.fail (err)->
						console.log('Error: '+err);


				# get textbooks by class id from local database
				getTextbooksByIDFromLocal:(class_id)->

					getTextBookIds =->
						runQ =->
							$.Deferred (d)->
								_.db.transaction (tx)->
									tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE meta_key='textbooks' AND user_id='1'", [], success(d), failure(d))

						success =(d)->
							(tx,data)->
								ids = unserialize(data.rows.item(0)['meta_value'])
								d.resolve(ids)

						failure =(d)->
							(tx, error)->
								d.reject('Failure: '+error)

						$.when(runQ()).done ->
							console.log 'getTextBookIds transaction completed'
						.fail (err)->
							console.log 'Error: '+err	
							
								
					runQuery = ->
						ids = ''
						textbookIds = getTextBookIds()
						textbookIds.done (d)=>
							ids = d

						$.Deferred (d)->
							_.db.transaction (tx)->
								pattern = '%"'+class_id+'"%'
								tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt 
									LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id 
									WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0
					 				AND wtr.class_id LIKE '"+pattern+"' AND wtr.textbook_id IN ("+ids+")", [], onSuccess(d), onFailure(d));
								

					onSuccess =(d)->
						(tx,data)->
							result = []
							i = 0
							while i < data.rows.length
								row = data.rows.item(i)
								p = '%"'+row['textbook_id']+'"%'
								
								do (tx, row ,p, i)->
									tx.executeSql("SELECT count(id) AS count FROM wp_content_collection WHERE term_ids LIKE '"+p+"'", []

										,(tran,d)->
											classes = subjects = ''
											classes = unserialize(row["class_id"]) if row["class_id"] isnt ''
											subjects = unserialize(row["tags"]) if row["tags"] isnt ''

											result[i] = 
												term_id: row["term_id"]
												name: row["name"]
												slug: row["slug"]
												term_group: row["term_group"]
												term_order: row["term_order"]
												term_taxonomy_id: row["term_taxonomy_id"]
												taxonomy: row["taxonomy"]
												description: row["description"]
												parent: row["parent"]
												count: row["count"]
												classes: classes
												subjects: subjects
												modules_count: d.rows.item(0)['count']
										
										,(tran,err)->
											console.log 'Error: '+err.message
									)
								i++

							d.resolve(result)


					onFailure =(d)->
						(tx,error)->
							d.reject('OnFailure!: '+error)

					
					$.when(runQuery()).done (data)->
						console.log 'getTextbooksByID transaction completed'
						
					.fail (err)->
						console.log('Error: '+err);



			# request handler to get all textbooks
			App.reqres.setHandler "get:textbooks", (opt) ->
				API.getTextbooks(opt)

			App.reqres.setHandler "get:textbook:by:id", (id)->
				API.getTextBookByID id

			# request handler to get all textbooks from local database
			App.reqres.setHandler "get:textbooks:local", ->
				API.getTextbooksFromLocal()

			App.reqres.setHandler "get:textbooks:by:id:local", (class_id)->
				API.getTextbooksByIDFromLocal class_id


