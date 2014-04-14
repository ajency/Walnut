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


				getTextbooksFromLocal:->
					runQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt left outer join wp_textbook_relationships wtr on t.term_id=wtr.textbook_id  WHERE t.term_id=tt.term_id and tt.taxonomy='textbook' and tt.parent=0", [], onSuccess(d), onFailure(d));
								

					onSuccess =(d)->
						(tx,data)->
							console.log 'onSuccess!'
							result = []
							i = 0
							while i < data.rows.length
								row = data.rows.item(i)
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
									classes: unserialize(row["class_id"])
									subjects: unserialize(row["tags"])

								i++	
		
							d.resolve(result)


					onFailure =(d)->
						(tx,error)->
							d.reject('OnFailure!: '+error)

					$.when(runQuery()).done (data)->
						console.log 'Database transaction completed'
						
					.fail (err)->
						console.log('Error: '+err);


			# request handler to get all textbooks
			App.reqres.setHandler "get:textbooks", (opt) ->
				API.getTextbooks(opt)

			App.reqres.setHandler "get:textbook:by:id", (id)->
				API.getTextBookByID id

			App.reqres.setHandler "get:textbookslocal", ->
				API.getTextbooksFromLocal()	
