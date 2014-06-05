define ["app", 'backbone', 'unserialize'], (App, Backbone) ->
	App.module "Entities.ContentGroup", (ContentGroup, App, Backbone, Marionette, $, _)->


		# content group model
		class ContentGroup.ItemModel extends Backbone.Model

			idAttribute: 'id'

			defaults:
				name: ''
				description: []
				created_on: ''
				created_by: ''
				last_modified_on: ''
				last_modified_by: ''
				published_on: ''
				published_by: ''
				status: ''
				type: ''
				total_minutes: 0
				duration: 0
				minshrs: 'mins'
				term_ids: []
				content_pieces: []
				training_date: ''

			name: 'content-group'

		# collection of group of content pieces eg. quizzes, teacher training modules etc.
		class ContentGroup.ItemCollection extends Backbone.Collection
			model: ContentGroup.ItemModel
			name: 'content-group'


			url: ->
				AJAXURL + '?action=get-content-groups'

			parse: (resp)->
				resp.data


		
		contentGroupCollection = new ContentGroup.ItemCollection

		# API
		API =
		# get all content groups
			getContentGroups: (param = {})->
				contentGroupCollection.fetch
					reset: true
					data: param

				contentGroupCollection


			getContentGroupByID: (id)->
				contentGroup = contentGroupCollection.get id if contentGroupCollection?

				if not contentGroup
					contentGroup = new ContentGroup.ItemModel 'id': id
					contentGroup.fetch()
				contentGroup


			saveContentGroupDetails: (data)->
				contentGroupItem = new ContentGroup.ItemModel data
				contentGroupItem

			newContentGroup:->
				contentGroup = new ContentGroup.ItemModel

			scheduleContentGroup:(data)->
				questionResponseModel= App.request "save:question:response"

				questionResponseModel.set data

				questionResponseModel.save()


			# get content group from local
			getContentGroupByIdFromLocal : (id, division)->

				runQuery = ->

					pattern = '%"'+id+'"%'

					$.Deferred (d)->
						_.db.transaction (tx)->
							tx.executeSql("SELECT * FROM wp_content_collection 
								WHERE term_ids LIKE '"+pattern+"'", []
								, onSuccess(d), _.deferredErrorHandler(d))

				
				onSuccess = (d)->
					(tx, data)->

						result = []

						for i in [0..data.rows.length-1] by 1

							row = data.rows.item(i)

							do (row, i, division)->
								contentPiecesAndDescription = _.getContentPiecesAndDescription(row['id'])
								contentPiecesAndDescription.done (d)->

									content_pieces = description = ''
									content_pieces = unserialize(d.content_pieces) if d.content_pieces isnt ''
									description = unserialize(d.description) if d.description isnt ''

									do (row, i, content_pieces, description)->
										dateAndStatus = _.getDateAndStatus(row['id'], division, content_pieces)
										dateAndStatus.done (d)->
											status = d.status
											date = d.date

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
												duration: _.getDuration(row['duration'])
												minshours: _.getMinsHours(row['duration'])
												total_minutes: row['duration']
												status: status
												training_date: date
												content_pieces: content_pieces
												description: description
						
						d.resolve(result)		

				$.when(runQuery()).done (data)->
					console.log 'Content-group-by-id transaction completed'
				.fail _.failureHandler

		
		# request handler to get all content groups
		App.reqres.setHandler "get:content:groups", (opt) ->
			API.getContentGroups(opt)

		App.reqres.setHandler "get:content:group:by:id", (id)->
			API.getContentGroupByID id

		App.reqres.setHandler "save:content:group:details", (data)->
			API.saveContentGroupDetails data

		App.reqres.setHandler "new:content:group",->
			API.newContentGroup()

		App.reqres.setHandler "schedule:content:group", (data)->
			API.scheduleContentGroup data


		# request handler to get content group by id from local database
		App.reqres.setHandler "get:content-group:by:id:local", (id, division) ->
			API.getContentGroupByIdFromLocal id,division

