define ["app", 'backbone', 'unserialize'], (App, Backbone) ->

		App.module "Entities.Divisions", (Divisions, App, Backbone, Marionette, $, _)->
			

			# divisions model
			class DivisionModel extends Backbone.Model

				idAttribute : 'id'
				
				defaults:
					division 		   	: ''
					class_id			: 0
					students_count		: 0

				name: 'division'

				

			# collection of divisions 
			class DivisionCollection extends Backbone.Collection
				model : DivisionModel
				name: 'division'

				url :->
					 AJAXURL + '?action=get-divisions'

				parse:(resp)->
					resp.data
			

			# API 
			API = 
				# get all divisions
				getDivisions:(param = {})->
					divisionCollection = new DivisionCollection

					if not divisionCollection.length >0
						divisionCollection.fetch
											reset : true
											data  : param

					divisionCollection

				getDivisionByID:(id)->
					
					division = divisionCollection.get id if divisionCollection?

					if not division 
						division = new DivisionModel ('id':id)
						division.fetch()
						console.log division
					division


				#get divisions from local database
				getDivisionsFromLocal:->

					runFunc = ->
						$.Deferred (d)->
							divisions = _.getAllDivisions()
							divisions.done (result)->

								d.resolve result

					$.when(runFunc()).done	->
						console.log 'getDivisionsFromLocal done'
					.fail _.failureHandler		

					



			# request handler to get all divisions
			App.reqres.setHandler "get:divisions", (opt) ->
				API.getDivisions(opt)

			# request handler to get single division
			App.reqres.setHandler "get:division:by:id", (id) ->
				API.getDivisionByID(id)

			# request handler to get all divisions from local database
			App.reqres.setHandler "get:division:local", ->
				API.getDivisionsFromLocal()	
