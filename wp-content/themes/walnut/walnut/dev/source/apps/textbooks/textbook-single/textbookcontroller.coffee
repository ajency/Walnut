define ['app','controllers/region-controller','apps/textbooks/textbook-single/single_views'
		'apps/textbooks/textbook-single/chapters-list'
], (App, RegionController)->

	App.module "TextbooksApp.Single", (Single, App)->

		class Single.SingleTextbook extends RegionController

			initialize : (opt) ->
				term_id = opt.model_id
				@textbook = App.request "get:textbook:by:id", term_id
				@chapters = App.request "get:chapters", ('parent': term_id)

				@layout= layout = @_getTextbookSingleLayout()
				@listenTo layout, "show", @_showTextBookSingle
				@listenTo layout, "show", @_showChaptersView

				@show layout


			_showTextBookSingle: =>

				App.execute "when:fetched", @textbook, =>
					# get the single view 
					textbookDescView= new Single.Views.TextbookDescriptionView 
																model: @textbook

					@layout.textbookDescriptionRegion.show(textbookDescView)
			
			_getTextbookSingleLayout : ->
				new Single.Views.TextbookSingleLayout

			_showChaptersView : =>
				App.execute "when:fetched", @chapters, =>
					#get the chapters view
					chaptersListView= new Single.Views.ChapterListView
						collection: @chapters

					@layout.chaptersRegion.show(chaptersListView)