define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.ContentGroup", (ContentGroup, App, Backbone, Marionette, $, _)->
			

			# content group model
			class ContentGroup.ItemModel extends Backbone.Model

				idAttribute : 'id'

				defaults:
					name       		   	: ''
					created_on			: ''
					created_by			: ''
					last_modified_on	: ''
					last_modified_by	: ''
					published_on	    : ''
					published_by	    : ''
					status	   			: ''
					type	   			: ''
					term_ids			: ''

				name: 'contentGroup'

			# collection of group of content pieces eg. quizzes, teacher training modules etc.
			class ContentGroup.ItemCollection extends Backbone.Collection
				model : ContentGroup.ItemModel
				comparator : 'id'
				url :->
					 AJAXURL + '?action=get-content-groups'
				
				parse:(resp)->
					@total = resp.count	
					resp.data

			contentGroupCollection = new ContentGroup.ItemCollection

			# API 
			API = 
				# get all content groups
				getContentGroups:(param = {})->
					console.log param
					contentGroupCollection.fetch
										reset : true
										data  : param

					contentGroupCollection


				getContentGroupByID:(id)->
					contentGroup = contentGroupCollection.get id

					if not contentGroup 
						contentGroup = new ContentGroup.ItemModel term_id : id
						console.log contentGroup
						contentGroup.fetch()
					contentGroup


				saveContentGroupDetails: (data)->
					contentGroupItem = new ContentGroup.ItemModel data
					contentGroupItem.save null,
									wait : true
					contentGroupItem


			# request handler to get all content groups
			App.reqres.setHandler "get:content:groups", (opt) ->
				API.getContentGroups(opt)

			App.reqres.setHandler "get:content:group:by:id", (id)->
				API.getContentGroupByID id

			App.reqres.setHandler "save:content:group:details", (data)->
				API.saveContentGroupDetails data
