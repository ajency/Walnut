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

				getChaptersFromLocal:(parent)->
					runQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt 
									WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=?", [parent], onSuccess(d), onFailure(d))

					onSuccess =(d)->
						(tx,data)->
							console.log 'Chapter success'
							result = []
							i=0
							while i < data.rows.length
								r = data.rows.item(i)
								result[i] = 
									term_id: r['term_id']
									name: r['name']
									slug: r['slug']
									term_group: r['term_group']
									term_order: r['term_order']
									term_taxonomy_id: r['term_taxonomy_id']
									taxonomy: r['taxonomy']
									description: r['description']
									parent: r['parent']
									count: r['count']
									thumbnail: ''
									cover_pic: ''
									author: ''
									classes: null
									subjects: null
									modules_count: ''
									chapter_count: ''

								i++
							
							d.resolve(result)

					onFailure =(d)->
						(tx,error)->
							d.reject('OnFailure: '+error)	

					$.when(runQuery()).done (d)->
						console.log 'Chapters transaction completed'

					.fail (err)->
						console.log 'Error: '+err


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
				

