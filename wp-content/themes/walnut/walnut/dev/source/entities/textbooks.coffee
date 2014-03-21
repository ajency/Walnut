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

				name: 'textbook'

			# textbooks collection class
			class Textbooks.ItemCollection extends Backbone.Collection
				model : Textbooks.ItemModel
				comparator : 'term_order'


			# API 
			API = 
				# get all textbooks
				getTextbooks:(param = {})->
					textbookCollection = new Textbooks.ItemCollection

					textbookCollection.url = AJAXURL + '?action=get-textbooks'
					textbookCollection.fetch
							reset : true
							data  : param

					textbookCollection

			# request handler to get all textbooks
			App.reqres.setHandler "get:textbooks", ->
				API.getTextbooks()