define ["app", 'backbone'], (App, Backbone) ->

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


			# textbook model
			class Textbooks.NameModel extends Backbone.Model

				defaults:
					name       		   	: ''

				name: 'textbookName'

			# textbooks collection class
			class Textbooks.ItemCollection extends Backbone.Collection
				model : Textbooks.ItemModel
				name: 'textbook'
				comparator : 'term_order'
				url :->
					 AJAXURL + '?action=get-textbooks'
				
				parse:(resp)->
					@total = resp.count	
					resp.data


			# textbooks collection class
			class Textbooks.NamesCollection extends Backbone.Collection
				model : Textbooks.NameModel
				name: 'textbookName'
				comparator : 'term_order'

				url :->
					 AJAXURL + '?action=get-textbook-names'

			

			# API 
			API =
				# get all textbooks
				getTextbooks:(param = {})->
					textbookCollection = new Textbooks.ItemCollection
					textbookCollection.fetch
										reset : true
										data  : param

					textbookCollection


				getTextBookByID:(id)->
					textbook = textbookCollection.get id if textbookCollection?

					if not textbook 
						textbook = new Textbooks.ItemModel term_id : id
						textbook.fetch()
					textbook

				getTextBookNameByID:(id)->
					textbook = textbookCollection.get id if textbookCollection?

					if not textbook 
						textbook = new Textbooks.ItemModel term_id : id
						textbook.fetch()

					textbookName= textbook.get('name')

					textbookName

				getTextBookNamesByIDs:(ids)->
					ids = _.compact _.flatten ids
					textbookNamesCollection = new Textbooks.NamesCollection
					textbookNamesCollection.fetch
										reset : true
										data:
											term_ids  : ids
											
					textbookNamesCollection	


				#get all textbooks from local database
				getTextbooksFromLocal:->

					runQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt 
									LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id  
									WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0", [], onSuccess(d), _.deferredErrorHandler(d));
								

					onSuccess =(d)->
						(tx,data)->
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

					$.when(runQuery()).done (data)->
						console.log 'getAllTextbooks transaction completed'
					.fail _.failureHandler


				# get textbooks by class id from local database
				getTextbooksByClassIDFromLocal:(class_id)->
					#user id hardcoded as 1 for now
					getTextBookIds =->
						runQ =->
							$.Deferred (d)->
								_.db.transaction (tx)->
									tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE meta_key='textbooks' AND user_id='1'", [], success(d), _.deferredErrorHandler(d))

						success =(d)->
							(tx,data)->
								ids = unserialize(data.rows.item(0)['meta_value'])
								d.resolve(ids)

						$.when(runQ()).done ->
							console.log 'getTextBookIds transaction completed'
						.fail _.failureHandler
							
								
					runMainQuery = ->
						textbook_ids = ''
						textbookIds = getTextBookIds()
						textbookIds.done (ids)=>
							textbook_ids = ids

						$.Deferred (d)->
							_.db.transaction (tx)->
								pattern = '%"'+class_id+'"%'
								tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt 
									LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id 
									WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0
					 				AND wtr.class_id LIKE '"+pattern+"' AND wtr.textbook_id IN ("+textbook_ids+")", [], onSuccess(d), _.deferredErrorHandler(d));
								

					onSuccess =(d)->
						(tx,data)->
							result = []
							i = 0
							while i < data.rows.length
								row = data.rows.item(i)
								p = '%"'+row['textbook_id']+'"%'
								
								do (tx, row ,p, i)->
									tx.executeSql("SELECT count(id) AS count FROM wp_content_collection WHERE term_ids LIKE '"+p+"'", []

										,(tx, d)->
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
										
										,_.transactionErrorHandler)
								i++

							d.resolve(result)
					
					$.when(runMainQuery()).done (data)->
						console.log 'getTextbooksByClassIDFromLocal transaction completed'
					.fail _.failureHandler


				# get textbooks by textbook id from local database
				getTextBookByIDFromLocal : (id)->

					runQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt 
									LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id  
									WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0 AND tt.term_id=?", [id], onSuccess(d), _.deferredErrorHandler(d));
								

					onSuccess =(d)->
						(tx,data)->
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

					$.when(runQuery()).done (data)->
						console.log 'getTextBookByIDFromLocal transaction completed'
					.fail _.failureHandler



				getTextBookNamesByIDsFromLocal : (ids)->
					
					runQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql("SELECT term_id, name FROM wp_terms WHERE term_id IN ("+ids+")", [], onSuccess(d), _.deferredErrorHandler(d))

					onSuccess =(d)->
						(tx, data)->
							result = []
							i = 0
							while i < data.rows.length
								r = data.rows.item(i)
								result[i] =
									id: r['term_id']
									name: r['name']
								i++
							d.resolve(result)

					$.when(runQuery()).done ->
						console.log 'getTextBookNamesByIDsFromLocal transaction completed'
					.fail _.failureHandler	


			# request handler to get all textbooks
			App.reqres.setHandler "get:textbooks", (opt) ->
				API.getTextbooks(opt)

			App.reqres.setHandler "get:textbook:by:id", (id)->
				API.getTextBookByID id

			App.reqres.setHandler "get:textbook:name:by:id", (id)->
				API.getTextBookNameByID id

			App.reqres.setHandler "get:textbook:names:by:ids", (ids)->
				API.getTextBookNamesByIDs ids	

			# request handler to get all textbooks from local database
			App.reqres.setHandler "get:textbook:local", ->
				API.getTextbooksFromLocal()

			App.reqres.setHandler "get:textbook:by:classid:local", (class_id)->
				API.getTextbooksByClassIDFromLocal class_id

			App.reqres.setHandler "get:textbook:by:id:local", (id)->
				API.getTextBookByIDFromLocal id	

			App.reqres.setHandler "get:textbookName:by:term_ids:local", (ids)->
				API.getTextBookNamesByIDsFromLocal ids




