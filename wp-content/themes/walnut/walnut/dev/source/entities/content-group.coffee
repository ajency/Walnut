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
								i = 0
								while i < data.rows.length
									row = data.rows.item(i)
									if row['meta_key'] is 'description'
										contentPiecesAndDescription.description = row['meta_value']

									if row['meta_key'] is 'content_pieces'
										contentPiecesAndDescription.content_pieces = row['meta_value']

									i++	
								
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
							i = 0
							while i < data.rows.length
								r = data.rows.item(i)

								do (r, i, division)->
									dateAndStatus = _.getLastDetails(r['id'], division)
									dateAndStatus.done (d)->
										status = d.status
										date = d.date

										do (r, i, date, status)->
											contentPiecesAndDescription = getContentPiecesAndDescription(r['id'])
											contentPiecesAndDescription.done (d)->
												content_pieces = description = ''
												content_pieces = unserialize(d.content_pieces) if d.content_pieces isnt ''
												description = unserialize(d.description) if d.description isnt ''

												result[i] = 
													id: r['id']
													name: r['name']
													created_on: r['created_on']
													created_by: r['created_by']
													last_modified_on: r['last_modified_on']
													last_modified_by: r['last_modified_by']
													published_on: r['published_on']
													published_by: r['published_by']
													type: r['type']
													term_ids: unserialize(r['term_ids'])
													duration: getDuration(r['duration'])
													minshours: getMinsHours(r['duration'])
													total_minutes: r['duration']
													status: status
													training_date: date
													content_pieces: content_pieces
													description: description
										
								i++
							
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


				saveOrUpdateContentGroupLocal:(p) ->
					#function to insert record in wp_training_logs
					insertTrainingLogs =(data)->
						_.db.transaction( (tx)->
							tx.executeSql("INSERT INTO wp_training_logs (division_id, collection_id, teacher_id, date, status) 
								VALUES (?, ?, ?, ?, ?)", [data.division_id, data.collection_id, data.teacher_id, data.date, data.status])
							
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
						division_id: p.division
						collection_id: p.id
						teacher_id: 1  #teacher id hardcoded as 1 for now
						date: _.getCurrentDateTime(0)
						status: p.status

					if p.status is 'completed' or p.status is 'scheduled'
						if p.status is 'scheduled'
							data.date = p.training_date
						#insert new record in wp_training_logs
						insertTrainingLogs(data)

					else
						#get last status
						lastStatus = _.getLastDetails(p.id, p.division)
						lastStatus.done (d)=>
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

			App.reqres.setHandler "save:update:content-group:local", (params)->
				API.saveOrUpdateContentGroupLocal params	
