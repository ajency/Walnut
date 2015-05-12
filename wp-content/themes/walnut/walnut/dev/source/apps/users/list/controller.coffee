define ['app'
        'controllers/region-controller'
        'apps/users/list/composite-view'
],(App,RegionController)->
	App.module 'UsersApp.List', (ListApp,App)->

		class ListApp.Controller extends RegionController

			initialize : (options)->
					
				usersCollection = App.request "get:user:collection", role: 'parent'
				
				App.navigate 'parents', replace:true  if options.editedID
				
				App.execute "when:fetched", usersCollection, =>
					@view = new ListApp.Views.UsersListView 
								collection: usersCollection
								editedID: options.editedID if options.editedID
					@show @view