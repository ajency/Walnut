define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.Divisions", (Divisions, App, Backbone, Marionette, $, _)->
			

			# divisions model
			class DivisionModel extends Backbone.Model

				idAttribute : 'id'
				
				defaults:
					division 		   	: ''
					class_id			: ''

				name: 'division'

				

			# collection of divisions 
			class DivisionCollection extends Backbone.Collection
				model : DivisionModel

				url :->
					 AJAXURL + '?action=get-divisions'

				parse:(resp)->
					resp.data


			divisionCollection = new DivisionCollection

			# API 
			API = 
				# get all divisions
				getDivisions:(param = {})->
					
					divisionCollection.fetch
										reset : true
										data  : param

					divisionCollection

				getDivisionByID:(id)->
					division = divisionCollection.get id

					if not division 
						division = new DivisionModel ('id':id)
						division.fetch()
						console.log division
					division

			# request handler to get all divisions
			App.reqres.setHandler "get:divisions", (opt) ->
				API.getDivisions(opt)

			# request handler to get single division
			App.reqres.setHandler "get:division:by:id", (id) ->
				API.getDivisionByID(id)
