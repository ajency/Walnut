define ['app'
		'controllers/region-controller'
		'apps/teachers-dashboard/list-textbooks/views'
		], (App, RegionController)->

	App.module "TeachersDashboardApp.View", (View, App)->

		#List of textbooks available to a teacher for training or to take a class

		class View.TextbooksListController extends RegionController

			initialize :(opts)->

				breadcrumb_items = 'items':[
						{'label':'Dashboard','link': '#teachers/dashboard'},
						{'label':'Start Training','link':'javascript://'}
					]

				App.execute "update:breadcrumb:model", breadcrumb_items

				{classID} = opts



				textbooks = App.request "get:textbooks", (class_id : classID)

				@view = view = @_getTextbooksListView textbooks

				@show view, (loading: true)
				


			_getTextbooksListView :(collection)->
				new View.List.TextbooksListView
					collection: collection



		


