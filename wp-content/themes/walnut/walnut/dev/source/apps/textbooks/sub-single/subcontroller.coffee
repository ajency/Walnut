define ['app','controllers/region-controller','apps/textbooks/sub-single/single_views'
		'apps/textbooks/sub-single/list'
], (App, RegionController)->

	App.module "TextbooksApp.Single", (Single, App)->

		class Single.SingleSub extends RegionController

			initialize :(opt)->
				console.log opt

				textbook_id = opt.model_id
				chapter_id = opt.chapter
				section_id = opt.section
				term_id = opt.sub

				console.log term_id
				@textbook = App.request "get:textbook:by:id", term_id


				@chapters = App.request "get:chapters", ('parent': term_id, 'to_fetch':'chapters')

				@layout= layout = @_getSubSingleLayout()
				@listenTo layout, "show", @_showSubSingle
				@listenTo layout, "show", @_showSubSubView

				@show layout


			_showSubSingle: =>

				App.execute "when:fetched", @textbook, =>
					breadcrumb_items = 'items':[
						{'label':'Dashboard','link':'javascript://'},
						{'label':'Content Management','link':'javascript:;'},
						{'label':'Textbooks','link':'#textbooks'},
						{'label':@textbook.get('name'),'link':'javascript:;','active':'active'}
					]
						
					App.execute "update:breadcrumb:model", breadcrumb_items

					# get the single view 
					subDescView= new Single.Views.SubDescriptionView 
						model: @textbook

					@layout.subDescriptionRegion.show(subDescView)
			
			_getSubSingleLayout : ->
				new Single.Views.SubSingleLayout

			_showSubSubView : =>
				App.execute "when:fetched", @chapters, =>
					#get the chapters view
					subsubListView= new Single.Views.SubListView
						collection: @chapters

					@layout.subRegion.show(subsubListView)

					