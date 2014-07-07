define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.Chapters", (Chapters, App, Backbone, Marionette, $, _)->

			# chapter model
			class Chapters.ItemModel extends Backbone.Model

				idAttribute : 'chapter_id'

				defaults:
					name       		   	: ''
					slug    			: ''
					description        	: ''
					parent      	   	: 0
					term_order 			: 0

				name: 'chapter'

			# chapters collection class
			class Chapters.ItemCollection extends Backbone.Collection
				model : Chapters.ItemModel
				comparator : 'term_order'
				name : 'chapter'

				url :->
					 AJAXURL + '?action=get-chapters'
				
				parse:(resp)->
					@total = resp.count	
					resp.data

			
			# subsections collection class
			class Chapters.SubSectionCollection extends Backbone.Collection
				model : Chapters.ItemModel
				comparator : 'term_order'
				url :->
					 AJAXURL + '?action=get-chapter-subsections'
				
				parse:(resp)->
					@total = resp.count	
					resp.data

			# API 
			API = 
				# get all chapters
				getChapters:(param = {})->
					chapterCollection = new Chapters.ItemCollection
					chapterCollection.fetch
										reset : true 
										data  : param

					chapterCollection


				getChapterByID:(id)->
					chapter = chapterCollection.get id

					if not chapter 
						chapter = new Chapters.ItemModel term_id : id
						console.log chapter
						chapter.fetch()
					chapter


				getSubsectionByChapterID:(param = {})->
					subSectionsCollection = new Chapters.SubSectionCollection
					subSectionsCollection.fetch
										reset : true
										data  : param

					subSectionsCollection
					

				# get chapters from local database
				getChaptersFromLocal : (parent)->

					runFunc = ->
						$.Deferred (d)->
							chapters = _.getChaptersByParentId(parent)
							chapters.done (result)->

								d.resolve result

					$.when(runFunc()).done	->
						console.log 'getChaptersFromLocal done'
					.fail _.failureHandler


			
			# request handler to get all Chapters
			App.reqres.setHandler "get:chapters", (opt) ->
				API.getChapters(opt)

			App.reqres.setHandler "get:chapter:by:id", (id)->
				API.getChapterByID id

			App.reqres.setHandler "get:subsections:by:chapter:id", (id)->
				API.getSubsectionByChapterID id

			# request handler to get all chapters from local database
			App.reqres.setHandler "get:chapter:local", (parent)->
				API.getChaptersFromLocal parent	