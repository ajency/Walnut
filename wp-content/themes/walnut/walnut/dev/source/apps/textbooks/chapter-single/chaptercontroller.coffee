define ['app','controllers/region-controller','apps/textbooks/chapter-single/single_views'
		'apps/textbooks/chapter-single/sections-list'
], (App, RegionController)->

	App.module "TextbooksApp.Single", (Single, App)->

		class Single.SingleChapter extends RegionController

			initialize :(opt)->
				#console.log opt
				textbook_id = opt.model_id
				#console.log textbook_id
				term_id = opt.chapter
				window.base_textbook_id = textbook_id

				#console.log term_id
				@base_textbook = App.request "get:textbook:by:id", textbook_id

				App.execute "when:fetched", @base_textbook, =>
					#console.log @base_textbook
					window.base_textbook_name = @base_textbook.get 'name'
					window.base_classes_applicable = @base_textbook.get 'classes_applicable'
				
					@textbook = App.request "get:textbook:by:id", term_id

					@textbook.textbook_id = textbook_id

					@chapters = App.request "get:chapters", ('parent': term_id, 'term_type':'sections')
					@chapters.textbook_id = textbook_id
					@chapters.parent = term_id
					@chapters.isAdmin = isAdmin

					#console.log @chapters

					@layout= layout = @_getChaptersSingleLayout()
					@listenTo layout, "show", @_showChapterSingle
					@listenTo layout, "show", @_showSectionsView @chapters

					@listenTo Backbone, 'reload:collection', (collection) =>
						@chapters = App.request "get:chapters", ('parent': term_id, 'term_type':'chapter')
						@textbook = App.request "get:textbook:by:id", term_id
						App.execute "when:fetched", @textbook, =>
							@_showReloadChapterSingle @textbook
						@_showSectionsView @chapters

					@listenTo @layout, 'show:add:textbook:popup',(@collection)=>
						App.execute 'add:textbook:popup',
                        	region      : App.dialogRegion
                        	collection : @collection

					@show layout


			_showChapterSingle: =>

				App.execute "when:fetched", @textbook, =>
					breadcrumb_items = 'items':[
						{'label':'Dashboard','link':'javascript://'},
						{'label':'Content Management','link':'javascript:;'},
						{'label':'Textbooks','link':'#textbooks'},
						{'label':@textbook.get('name'),'link':'javascript:;','active':'active'}
					]
						
					App.execute "update:breadcrumb:model", breadcrumb_items

					# get the single view 
					chapterDescView= new Single.Views.ChapterDescriptionView 
						model: @textbook

					@layout.chapterDescriptionRegion.show(chapterDescView)


			_showReloadChapterSingle:(@textbook) =>

				#App.execute "when:fetched", @textbook, =>
					breadcrumb_items = 'items':[
						{'label':'Dashboard','link':'javascript://'},
						{'label':'Content Management','link':'javascript:;'},
						{'label':'Textbooks','link':'#textbooks'},
						{'label':@textbook.get('name'),'link':'javascript:;','active':'active'}
					]
						
					App.execute "update:breadcrumb:model", breadcrumb_items

					# get the single view 
					chapterDescView= new Single.Views.ChapterDescriptionView 
						model: @textbook

					@layout.chapterDescriptionRegion.show(chapterDescView)
			
			_getChaptersSingleLayout : ->
				new Single.Views.ChapterSingleLayout
					collection : @chapters

			_showSectionsView : =>
				App.execute "when:fetched", @chapters, =>
					#console.log @chapters
					#console.log base_classes_applicable

					#get the chapters view
					sectionsListView= new Single.Views.SectionListView
						collection: @chapters

					@layout.chaptersRegion.show(sectionsListView)

					