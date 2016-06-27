define ['app','controllers/region-controller','apps/textbooks/textbook-single/single_views'
		'apps/textbooks/textbook-single/chapters-list','apps/textbooks/textadd-popup/add-textbook-app'
], (App, RegionController)->

	App.module "TextbooksApp.Single", (Single, App)->

		class Single.SingleTextbook extends RegionController

			initialize : (opt) ->
				#@console.log opt
				term_id = opt.model_id
				@textbook = App.request "get:textbook:by:id", term_id
				#console.log textbook_name

				@classes = App.request "get:all:classes"

				@chapters = App.request "get:chapters", ('parent': term_id, 'term_type':'chapter')

				window.chaptersOriginalCollection = App.request "get:chapters", 'parent': term_id

				@chapters.parent = term_id

				@layout= layout = @_getTextbookSingleLayout()
				@listenTo layout, "show", @_showTextBookSingle
				@listenTo layout, "show", @_showChaptersView

				@listenTo @layout, 'show:add:textbook:popup',(@collection)=>
					App.execute 'add:textbook:popup',
                        region      : App.dialogRegion
                        collection : @collection

                @region =  new Marionette.Region el : '#dialog-region'
                region : @region
				

				@listenTo Backbone, 'reload:collection', (collection) =>
					@chapters = App.request "get:chapters", ('parent': term_id, 'term_type':'chapter')
					@_showChaptersView @chapters

				@listenTo @layout, 'search:textbooks', (collection)=>
					console.log collection
					@_getSearchChaptersView collection

				@show layout


			_showTextBookSingle: =>

				App.execute "when:fetched", @textbook, =>
					breadcrumb_items = 'items':[
						{'label':'Dashboard','link':'javascript://'},
						{'label':'Content Management','link':'javascript:;'},
						{'label':'Textbooks','link':'#textbooks'},
						{'label':@textbook.get('name'),'link':'javascript:;','active':'active'}
					]
						
					App.execute "update:breadcrumb:model", breadcrumb_items

					# get the single view 
					textbookDescView= new Single.Views.TextbookDescriptionView 
																model: @textbook

					@layout.textbookDescriptionRegion.show(textbookDescView)
			
			_getTextbookSingleLayout : ->
				new Single.Views.TextbookSingleLayout
					collection: @chapters

			_getSearchChaptersView: (collection)->
                new Single.Views.TextbookSingleLayout
                    collection: collection

			_showChaptersView : =>
				App.execute "when:fetched", @chapters, =>
					#get the chapters view
					chaptersListView= new Single.Views.ChapterListView
						collection: @chapters

					@layout.chaptersRegion.show(chaptersListView)

		
					