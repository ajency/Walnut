define ['app', 'controllers/region-controller', 'apps/textbooks/list/views'], (App, RegionController)->

	App.module "TextbooksApp.List", (List, App)->

		class List.ListController extends RegionController

			initialize : ->
				textbooksCollection = App.request "get:textbooks"
				@view= view = @_getTextbooksView textbooksCollection
				@show view

			_getTextbooksView :(collection)->
				new List.Views.ListView
								collection : collection

	