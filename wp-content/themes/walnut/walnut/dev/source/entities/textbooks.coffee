define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.Textbooks", (Textbooks, App, Backbone, Marionette, $, _)->

			#local database object
			db = Backbone.db

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
					console.log param
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
					console.log 'Database'
					`var fetchData = db.transaction(function(tx){
			 			
						},
						function(tx,err){
							console.log("Error processing SQL: "+err);
						},
						function(tx){
							
						}
					)`
					data = [{"term_id":32,"name":"Art","slug":"art","term_group":"0","term_order":"0","term_taxonomy_id":"32","taxonomy":"textbook","description":"","parent":"0","count":"0","cover_pic":"","author":"","classes":null,"subjects":null,"chapter_count":0}
			 				{"term_id":33,"name":"English","slug":"english","term_group":"0","term_order":"0","term_taxonomy_id":"32","taxonomy":"textbook","description":"","parent":"0","count":"0","cover_pic":"","author":"","classes":null,"subjects":null,"chapter_count":0}]
				


			# request handler to get all textbooks
			App.reqres.setHandler "get:textbooks", (opt) ->
				API.getTextbooks(opt)

			App.reqres.setHandler "get:textbook:by:id", (id)->
				API.getTextBookByID id

			App.reqres.setHandler "get:textbookslocal", ->
				API.getTextbooksFromLocal()	
				
