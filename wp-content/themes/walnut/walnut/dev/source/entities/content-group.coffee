define ["app", 'backbone', 'unserialize'], (App, Backbone) ->

		App.module "Entities.ContentGroup", (ContentGroup, App, Backbone, Marionette, $, _)->
			

			# content group model
			class ContentGroup.ItemModel extends Backbone.Model

				idAttribute : 'id'
				
				defaults:
					name       		   	: ''
					description			: []
					created_on			: ''
					created_by			: ''
					last_modified_on	: ''
					last_modified_by	: ''
					published_on	    : ''
					published_by	    : ''
					status	   			: ''
					type	   			: ''
					total_minutes		: 0
					duration   			: 0
					minshrs				: 'mins'
					term_ids			: []
					content_pieces		: []
					training_date		: ''

				name: 'content-group'

				
				initialize:->
					@on('start:module', @startModule, @)
					@on('stop:module', @stopModule, @)

				startModule:(model)=>
					@trigger "training:module:started", model

				stopModule:(model)=>
					@trigger "training:module:stopped", model


			# collection of group of content pieces eg. quizzes, teacher training modules etc.
			class ContentGroup.ItemCollection extends Backbone.Collection
				model : ContentGroup.ItemModel
				name : 'content-group'


				url :->
					 AJAXURL + '?action=get-content-groups'

				parse:(resp)->
					resp.data


			contentGroupCollection = new ContentGroup.ItemCollection

			# API 
			API = 
				# get all content groups
				getContentGroups:(param = {})->

					contentGroupCollection.fetch
										reset : true
										data  : param

					contentGroupCollection


				getContentGroupByID:(id)->

					contentGroup = contentGroupCollection.get id if contentGroupCollection?

					if not contentGroup 
						contentGroup = new ContentGroup.ItemModel 'id': id
						contentGroup.fetch()
					contentGroup


				saveContentGroupDetails: (data)->
					contentGroupItem = new ContentGroup.ItemModel data
					contentGroupItem
					
				
				# get content group from local
				getContentGroupByIdFromLocal:(id, division)->
					#get content pieces and description
					getContentPiecesAndDescription =(collection_id)->
						contentPiecesAndDescription =
							content_pieces: ''
							description: ''

						runQ =->
							$.Deferred (d)->
								_.db.transaction (tx)->
									tx.executeSql("SELECT * FROM wp_collection_meta WHERE collection_id=?", [collection_id], success(d), _.deferredErrorHandler(d))

						success =(d)->
							(tx,data)->
								for i in [0..data.rows.length-1] by 1
									row = data.rows.item(i)
									if row['meta_key'] is 'description'
										contentPiecesAndDescription.description = row['meta_value']

									if row['meta_key'] is 'content_pieces'
										contentPiecesAndDescription.content_pieces = row['meta_value']
								
								d.resolve(contentPiecesAndDescription)

						$.when(runQ()).done ->
							console.log 'getContentPiecesAndDescription transaction completed'
						.fail _.failureHandler
												
					#get data from wp_content_collection
					runMainQuery = ->

						$.Deferred (d)->
							_.db.transaction (tx)->
								pattern = '%"'+id+'"%'
								tx.executeSql("SELECT * FROM wp_content_collection WHERE term_ids LIKE '"+pattern+"'", [], onSuccess(d), _.deferredErrorHandler(d))

					onSuccess = (d)->
						(tx, data)->
							
							result = []

							for i in [0..data.rows.length-1] by 1

								row = data.rows.item(i)

								do (row, i, division)->
									dateAndStatus = _.getLastDetails(row['id'], division)
									dateAndStatus.done (d)->
										status = d.status
										date = d.date

										do (row, i, date, status)->
											contentPiecesAndDescription = getContentPiecesAndDescription(row['id'])
											contentPiecesAndDescription.done (d)->
												content_pieces = description = ''
												content_pieces = unserialize(d.content_pieces) if d.content_pieces isnt ''
												description = unserialize(d.description) if d.description isnt ''

												result[i] = 
													id: row['id']
													name: row['name']
													created_on: row['created_on']
													created_by: row['created_by']
													last_modified_on: row['last_modified_on']
													last_modified_by: row['last_modified_by']
													published_on: row['published_on']
													published_by: row['published_by']
													type: row['type']
													term_ids: unserialize(row['term_ids'])
													duration: getDuration(row['duration'])
													minshours: getMinsHours(row['duration'])
													total_minutes: row['duration']
													status: status
													training_date: date
													content_pieces: content_pieces
													description: description
							
							d.resolve(result)

					getDuration = (duration)->
						if duration > 60
							duration/60
						else
							duration	

					getMinsHours = (duration)->
						if duration > 60
							'hrs'
						else 'mins'				

					$.when(runMainQuery()).done (data)->
						console.log 'Content-group-by-id transaction completed'
					.fail _.failureHandler


				saveOrUpdateContentGroupLocal:(model) ->
					
					#function to insert record in wp_training_logs
					insertTrainingLogs =(data)->

						_.db.transaction( (tx)->
							tx.executeSql("INSERT INTO wp_training_logs (division_id, collection_id, teacher_id, date, status, sync) 
								VALUES (?, ?, ?, ?, ?, ?)", [data.division_id, data.collection_id, data.teacher_id, data.date, data.status, 0])
							
						,_.transactionErrorHandler
						,(tx)->
							console.log 'Success: Inserted new record in wp_training_logs'
						)


					#function to update status in wp_training_logs
					updateTrainingLogs =(id, data)->
						
						_.db.transaction( (tx)->
							tx.executeSql("UPDATE wp_training_logs SET status=?, date=? WHERE id=?", [data.status, data.date, id])
							
						,_.transactionErrorHandler
						,(tx)->
							console.log 'Success: Updated record in wp_training_logs'
						)

					
					data =
						division_id: model.get('division')
						collection_id: model.get('id')
						teacher_id: _.getUserID()  #teacher id hardcoded as 1 for now
						date: _.getCurrentDateTime(0)
						status: model.get('status')

					if model.get('status') is 'completed' or model.get('status') is 'scheduled'
						if model.get('status') is 'scheduled'
							data.date = model.get('training_date')
						#insert new record in wp_training_logs
						insertTrainingLogs(data)

					else
						#get last status
						lastStatus = _.getLastDetails(model.get('id'), model.get('division'))
						lastStatus.done (d)=>
							console.log 'Last status: '+d.status
							if d.status isnt ''
								if d.status is 'started'
									data.status = 'resumed'
									insertTrainingLogs(data)

								if d.status is 'scheduled'
									data.status = 'started'
									updateTrainingLogs(d.id, data)

							else
								data.status = 'started'
								insertTrainingLogs(data)	



			# request handler to get all content groups
			App.reqres.setHandler "get:content:groups", (opt) ->
				API.getContentGroups(opt)

			App.reqres.setHandler "get:content:group:by:id", (id)->
				API.getContentGroupByID id

			App.reqres.setHandler "save:content:group:details", (data)->
				API.saveContentGroupDetails data

			# request handler to get content group by id from local database
			App.reqres.setHandler "get:content-group:by:id:local", (id, division) ->
				API.getContentGroupByIdFromLocal id,division

			App.reqres.setHandler "save:update:content-group:local", (model)->
				API.saveOrUpdateContentGroupLocal model	
