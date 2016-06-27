define ['app','controllers/region-controller','apps/textbooks/section-single/single_views'
		'apps/textbooks/section-single/sub-list'
], (App, RegionController)->

	App.module "TextbooksApp.Single", (Single, App)->

		class Single.SingleSection extends RegionController

			initialize :(opt)->
				console.log opt
				textbook_id = opt.model_id
				chapter_id = opt.chapter
				term_id = opt.section
				window.base_textbook_id = textbook_id
				window.base_chapter_id = chapter_id

				console.log term_id
				@textbook = App.request "get:textbook:by:id", term_id

				@base_textbook = App.request "get:textbook:by:id", textbook_id

				App.execute "when:fetched", @base_textbook, =>
					window.base_textbook_name = @base_textbook.get 'name'
					window.base_classes_applicable = @base_textbook.get 'classes_applicable'

					@base_chapter = App.request "get:textbook:by:id", chapter_id

					App.execute "when:fetched", @base_chapter, =>
						console.log 'chapter window data'
						console.log @base_chapter
						window.base_chapter_name = @base_chapter.get 'name'

						@chapters = App.request "get:chapters", ('parent': term_id, 'term_type':'subsections')

						@chapters.textbook_id = textbook_id
						@chapters.chapter_id = chapter_id
						@chapters.parent = term_id

						@layout= layout = @_getSectionSingleLayout()
						@listenTo layout, "show", @_showSectionSingle
						@listenTo layout, "show", @_showSubView

						@listenTo @layout, 'show:add:textbook:popup',(@collection)=>
							App.execute 'add:textbook:popup',
                        		region      : App.dialogRegion
                        		collection : @collection

						@show layout


			_showSectionSingle: =>

				App.execute "when:fetched", @textbook, =>
					breadcrumb_items = 'items':[
						{'label':'Dashboard','link':'javascript://'},
						{'label':'Content Management','link':'javascript:;'},
						{'label':'Textbooks','link':'#textbooks'},
						{'label':@textbook.get('name'),'link':'javascript:;','active':'active'}
					]
						
					App.execute "update:breadcrumb:model", breadcrumb_items

					# get the single view 
					sectionDescView= new Single.Views.SectionDescriptionView 
						model: @textbook

					@layout.sectionDescriptionRegion.show(sectionDescView)
			
			_getSectionSingleLayout : ->
				new Single.Views.SectionSingleLayout
					collection : @chapters

			_showSubView : =>
				App.execute "when:fetched", @chapters, =>
					#get the chapters view
					subListView= new Single.Views.SubListView
						collection: @chapters

					@layout.sectionRegion.show(subListView)

					