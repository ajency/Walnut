define ['app','controllers/region-controller','apps/textbooks/textbook-single/single_views'
		'apps/textbooks/textbook-single/chapters-list'
], (App, RegionController)->

	App.module "TextbooksApp.Single", (Single, App)->

		class Single.SingleTextbook extends RegionController

			initialize : (opt) ->

				term_id = opt.model_id
				@textbook = App.request "get:textbook:by:id", term_id
				@chapters = App.request "get:textbooks", ('parent': term_id) 

				@layout= layout = @_getTextbookSingleLayout()
				@listenTo layout, "show", @_showTextBookSingle
				@listenTo layout, "show", @_showChaptersView

				@show layout, (loading: true)

			_showTextBookSingle: =>
				# get the single view 
				textbookDescView= new Single.Views.TextbookDescriptionView 
					model: @textbook

				@layout.textbookDescriptionRegion.show(textbookDescView)
				console.log 'after region'
				console.log @textbook

			_getTextbookSingleLayout : ->
				new Single.Views.TextbookSingleLayout

			_showChaptersView : =>
				chaptersListView= new Single.Views.ChapterListView
					collection: @chapters

				@layout.chaptersRegion.show(chaptersListView)