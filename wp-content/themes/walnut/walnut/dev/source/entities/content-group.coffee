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
					#get the date and status from wp_training_logs
					getDateAndStatus =(collection_id, div)->
						dateAndStatus =
							date: ''
							status: ''

						runQ =->
							$.Deferred (d)->
								_.db.transaction (tx)->
									tx.executeSql("SELECT count(id) AS count, status, date FROM wp_training_logs 
										WHERE collection_id=? AND division_id=? ORDER BY id DESC LIMIT 1", [collection_id, div], success(d), deferredErrorHandler(d))

						success =(d)->
							(tx,data)->
								if data.rows.item(0)['count'] isnt 0
									dateAndStatus.date = data.rows.item(0)['date']
									dateAndStatus.status = data.rows.item(0)['status']
								d.resolve(dateAndStatus)

						$.when(runQ()).done ->
							console.log 'getDateAndStatus transaction completed'
						.fail(failureHandler)

					#get content pieces and description
					getContentPiecesAndDescription =(collection_id)->
						contentPiecesAndDescription =
							content_pieces: ''
							description: ''

						runQ =->
							$.Deferred (d)->
								_.db.transaction (tx)->
									tx.executeSql("SELECT * FROM wp_collection_meta WHERE collection_id=?", [collection_id], success(d), deferredErrorHandler(d))

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
						.fail(failureHandler)

					#get chapter name
					getChapterName =(term_ids)->
						temp = unserialize(term_ids)

						runQ =->
							$.Deferred (d)->
								_.db.transaction (tx)->
									tx.executeSql("SELECT name FROM wp_terms WHERE term_id=?", [temp.chapter], success(d), deferredErrorHandler(d))

						success =(d)->
							(tx,data)->
								if data.rows.length is 0
									name = ''
								else	
									name = data.rows.item(0)['name']
								d.resolve(name)

						$.when(runQ()).done ->
							console.log 'getChapterName transaction completed'
						.fail(failureHandler)
												
					#get data from wp_content_collection
					runMainQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								pattern = '%"'+id+'"%'
								tx.executeSql("SELECT * FROM wp_content_collection WHERE term_ids LIKE '"+pattern+"'", [], onSuccess(d), deferredErrorHandler(d))

					onSuccess = (d)->
						(tx, data)->
							result = []
							i = 0
							while i < data.rows.length
								r = data.rows.item(i)

								do (r, i, division)->
									dateAndStatus = getDateAndStatus(r['id'], division)
									dateAndStatus.done (d)->
										status = d.status
										date = d.date

										do (r, i, date, status)->
											contentPiecesAndDescription = getContentPiecesAndDescription(r['id'])
											contentPiecesAndDescription.done (d)->
												content_pieces = description = ''
												content_pieces = unserialize(d.content_pieces) if d.content_pieces isnt ''
												description = unserialize(d.description) if d.description isnt ''

												do(r, i, date, status, content_pieces, description)->
													chapterName = getChapterName(r['term_ids'])
													chapterName.done (name)->
												
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
															showChapter: name
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

					#Error handlers
					deferredErrorHandler =(d)->
						(tx, error)->
							d.reject 'ERROR: '+error

					failureHandler = (error)->
						console.log 'ERROR: '+error				

					$.when(runMainQuery()).done (data)->
						console.log 'Content-group-by-id transaction completed'
					.fail(failureHandler)	


				saveOrUpdateContentGroupLocal:(division_id, collection_id, teacher_id, training_date, current_status) ->
					#function to get the last status
					getLastStatus =->
						lastStatus = 
							id:''
							status:''

						runQ =->
							$.Deferred (d)->
								_.db.transaction (tx)->
									tx.executeSql("SELECT id,status FROM wp_training_logs WHERE division_id=? AND 
										collection_id=? ORDER BY id DESC LIMIT 1", [division_id, collection_id], success(d), failure(d))

						success =(d)->
							(tx, data)->
								if data.rows.length isnt 0
									lastStatus.id = data.rows.item(0)['id']
									lastStatus.status = data.rows.item(0)['status']
								d.resolve(lastStatus)

						failure =(d)->
							(tx, error)->
								d.reject 'ERROR: '+error

						$.when(runQ()).done ->
							console.log 'getLastStatus transaction completed'
						.fail (error)->
							console.log 'ERROR: '+error


					#function to insert record in wp_training_logs
					insertTrainingLogs =(date, status)->
						_.db.transaction( (tx)->
							tx.executeSql("INSERT INTO wp_training_logs (division_id, collection_id, teacher_id, date, status) 
								VALUES (?, ?, ?, ?, ?)", [division_id, collection_id, teacher_id, date, status])
							
						,(tx, error)->
							console.log 'ERROR: '+error.message
						,(tx)->
							console.log 'Success: Inserted new record in wp_training_logs'
						)


					#function to update status in wp_training_logs
					updateTrainingLogs =(id, status)->
						_.db.transaction( (tx)->
							tx.executeSql("UPDATE wp_training_logs SET status=? WHERE id=?", [status, id])
							
						,(tx, error)->
							console.log 'ERROR: '+error.message
						,(tx)->
							console.log 'Success: Updated record in wp_training_logs'
						)	


					#Current date
					d = new Date()
					date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()

					if current_status is 'completed' or current_status is 'scheduled'
						if current_status is 'scheduled'
							date = training_date
						#insert new record in wp_training_logs
						insertTrainingLogs(date, current_status)

					else
						#get last status
						lastStatus = getLastStatus()
						lastStatus.done (d)=>
							if d.status isnt ''
								if d.status is 'started'
									insertTrainingLogs(date, 'resumed')

								if d.status is 'scheduled'
									updateTrainingLogs(d.id, 'started')

							else
								insertTrainingLogs(date, 'started')	



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

			App.reqres.setHandler "save:update:content-group:local", (division_id, collection_id, teacher_id, training_date, status)->
				API.saveOrUpdateContentGroupLocal division_id, collection_id, teacher_id, training_date, status	
