define ['app', 'controllers/region-controller', 'apps/textbooks/list/views'], (App, RegionController)->

	App.module "TextbooksApp.List", (List, App)->

		class List.ListController extends RegionController

			initialize : ->
				textbooksCollection = App.request "get:textbooks"
				@view= view = @_getTextbooksView textbooksCollection

				@listenTo @view, "sort:textbooks", (sort)=>
					textbooksCollection.fetch
											reset :true 
											data : 
												order : sort.order
												orderby : sort.orderby

				@listenTo @view, "filter:textbooks:class", (class_id)=>
					textbooksCollection.fetch
											reset :true 
											data : 
												class_id : class_id

				@listenTo @view, "single:textbook:view", (term_id)=>
					textbookModel= textbooksCollection.get({'id':term_id})
					App.navigate('textbook/'+term_id, trigger: true)

				
													

				@show view,(loading : true)

			_getTextbooksView :(collection)->
				new List.Views.ListView
								collection : collection


