define ['app', 'controllers/region-controller', 'apps/textbooks/list/views'
		, 'apps/textbooks/list/textbook-layout'], (App, RegionController)->

	App.module "TextbooksApp.List", (List, App)->

		class List.ListController extends RegionController

			initialize : ->
				@textbooksCollection = App.request "get:textbooks"

				@layout= layout = @_getTextbooksListLayout()
				
				@listenTo layout, "show", @_showTextBooksListView
				@listenTo layout, "show", @_showBreadcrumbView

				@show layout,(loading : true)


			_showTextBooksListView:=>
				App.execute "when:fetched", @textbooksCollection, =>
					# get the single view 
					textbookListView= new List.Views.ListView
												collection : @textbooksCollection

					@layout.textbooksListRegion.show(textbookListView)


			_showBreadcrumbView:->
				breadcrumbView= new List.Views.TextbookBreadcrumbView
				@layout.breadcrumbRegion.show(breadcrumbView)

			_getTextbooksListLayout :->
				new List.Views.TextbookListLayout


