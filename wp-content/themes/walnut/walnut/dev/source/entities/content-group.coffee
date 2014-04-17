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
					term_ids			: []
					content_pieces		: []

				name: 'content-group'

				

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
					contentGroup = contentGroupCollection.get id

					if not contentGroup 
						contentGroup = new ContentGroup.ItemModel 'id': id
						contentGroup.fetch()
					contentGroup


				saveContentGroupDetails: (data)->
					contentGroupItem = new ContentGroup.ItemModel data
					contentGroupItem


				getContentGroupFromLocal:->
					runQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql('SELECT wcc.id as id, wcc.name as name, wcc.created_on as created_on, 
									wcc.created_by as created_by, wcc.last_modified_on as last_modified_on,
									wcc.last_modified_by as last_modified_by, wcc.published_on as published_on, 
									wcc.published_by as published_by, wcc.status as status, wcc.type as type,
									wcc.term_ids as term_ids, wcm.meta_value as description, wcm2.meta_value as content_pieces 
									FROM wp_content_collection wcc 
									INNER JOIN wp_collection_meta wcm ON (wcc.id=wcm.collection_id AND wcm.meta_key=?) 
									INNER JOIN wp_collection_meta wcm2 ON (wcc.id=wcm2.collection_id AND wcm2.meta_key=?) 
									WHERE wcc.id=?', ['description', 'content_pieces', 10], onSuccess(d), onFailure(d))

					onSuccess = (d)->
						(tx, data)->
							console.log 'Content group success'
							result = []
							i = 0
							while i < data.rows.length
								r = data.rows.item(i)
								term_ids = content_pieces = description = ''
								term_ids = unserialize(r['term_ids']) if r['term_ids'] isnt ''
								content_pieces = unserialize(r['content_pieces']) if r['content_pieces'] isnt ''
								description = unserialize(r['description']) if r['description'] isnt ''

								result = 
									code:'OK'
									data:
										id: r['id']
										name: r['name']
										created_on: r['created_on']
										created_by: r['created_by']
										last_modified_on: r['last_modified_on']
										last_modified_by: r['last_modified_by']
										published_on: r['published_on']
										published_by: r['published_by']
										status: r['status']
										type: r['type']
										term_ids: term_ids
										content_pieces: content_pieces
										description: description
								i++
								
							d.resolve(result)

					onFailure = (d)->
						(tx, error)->
							d.reject('OnFailure!: '+error)

					$.when(runQuery()).done (data)->
						console.log 'Content-group transaction completed'
					.fail (err)->
						console.log 'Error: '+err



			# request handler to get all content groups
			App.reqres.setHandler "get:content:groups", (opt) ->
				API.getContentGroups(opt)

			App.reqres.setHandler "get:content:group:by:id", (id)->
				API.getContentGroupByID id

			App.reqres.setHandler "save:content:group:details", (data)->
				API.saveContentGroupDetails data

			# request handler to get all content groups from local database
			App.reqres.setHandler "get:content-group:local", ->
				API.getContentGroupFromLocal()	
