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


				#get divisions from local database
				getDivisionsFromLocal:->

					runQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								# userid hardcoded as 1
								# meta_key='divisions'
								console.log 'User id: '+_.getUserID()
								tx.executeSql("SELECT meta_value FROM wp_usermeta 
									WHERE user_id=? AND meta_key=?" , [_.getUserID(), 'divisions']
									, onSuccess(d), _.deferredErrorHandler(d))

					onSuccess = (d)->
						(tx, data)->
							result = []

							tx.executeSql('SELECT cd.id AS id, cd.division AS division, cd.class_id 
								AS class_id, COUNT(um.umeta_id) AS students_count 
								FROM '+_.getTblPrefix()+'class_divisions cd LEFT JOIN wp_usermeta um 
								ON cd.id = meta_value AND meta_key="student_division" 
								WHERE id in ('+unserialize(data.rows.item(0)['meta_value'])+') 
								GROUP BY cd.id', []

									,(tx, data)->

										for i in [0..data.rows.length-1] by 1

											r = data.rows.item(i)

											result[i] =
												id:r['id']
												division:r['division']
												class_id:r['class_id']
												class_label: CLASS_LABEL[r['class_id']]
												students_count:r['students_count']

										d.resolve(result)

									,_.transactionErrorHandler)
							

					$.when(runQuery()).done (data)->
						console.log 'getDivisionsFromLocal transaction completed'
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
