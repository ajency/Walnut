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
						textbook.fetch()
					textbook

				getTextBookNameByID:(id)->
					textbook = textbookCollection.get id

					if not textbook 
						textbook = new Textbooks.ItemModel term_id : id
						textbook.fetch()

					textbookName= textbook.get('name')

					textbookName


			# request handler to get all textbooks
			App.reqres.setHandler "get:textbooks", (opt) ->
				API.getTextbooks(opt)

			App.reqres.setHandler "get:textbook:by:id", (id)->
				API.getTextBookByID id

			App.reqres.setHandler "get:textbook:name:by:id", (id)->
				API.getTextBookNameByID id
