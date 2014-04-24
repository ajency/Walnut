define ["app", 'backbone', 'unserialize'], (App, Backbone) ->

		App.module "Entities.Divisions", (Divisions, App, Backbone, Marionette, $, _)->
			

			# divisions model
			class DivisionModel extends Backbone.Model

				idAttribute : 'id'
				
				defaults:
					division 		   	: ''
					class_id			: ''
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


			divisionCollection = new DivisionCollection

			# API 
			API = 
				# get all divisions
				getDivisions:(param = {})->

					if not divisionCollection.length >0
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


				getDivisionsFromLocal:->
					runQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql('SELECT meta_value FROM wp_usermeta WHERE user_id=1 AND meta_key="classes"', [], onSuccess(d), onFailure(d))

					onSuccess = (d)->
						(tx, data)->
							console.log 'Division success'
							result = []

							tx.executeSql('SELECT cd.id AS id, cd.division AS division, cd.class_id AS class_id, COUNT(umeta_id) AS students_count 
								FROM wp_class_divisions cd LEFT JOIN wp_usermeta um ON cd.id = meta_value AND meta_key="student_division" 
								WHERE class_id in ('+unserialize(data.rows.item(0)['meta_value'])+') GROUP BY cd.id', []

									,(tx, data)->
										i=0
										while i < data.rows.length
											r = data.rows.item(i)
											result[i] =
												id:r['id']
												division:r['division']
												class_id:r['class_id']
												class_label:getClassLabel(r['class_id'])
												students_count:r['students_count']

											i++		

										d.resolve(result)

									,(tx,err)->
										console.log 'Error: '+err
									)
							

					onFailure = (d)->
						(tx, error)->
							d.reject('OnFailure!: '+error)


					getClassLabel = (class_id)->
						if class_id is 1
							'Junior KG'
						else if class_id is 2
							'Senior KG'
						else
							'Class '+(class_id - 2)


					$.when(runQuery()).done (data)->
						console.log 'Division transaction completed'
					.fail (err)->
						console.log 'Error: '+err



			# request handler to get all divisions
			App.reqres.setHandler "get:divisions", (opt) ->
				API.getDivisions(opt)

			# request handler to get single division
			App.reqres.setHandler "get:division:by:id", (id) ->
				API.getDivisionByID(id)

			# request handler to get all divisions from local database
			App.reqres.setHandler "get:division:local", ->
				API.getDivisionsFromLocal()	
