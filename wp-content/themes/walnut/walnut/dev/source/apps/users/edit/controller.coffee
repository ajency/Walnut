define ['app'
        'controllers/region-controller'
        'apps/users/edit/edituser'
],(App,RegionController)->
	App.module 'UsersApp.Edit', (EditApp,App)->

		class EditApp.Controller extends RegionController

			initialize : (options)->
				
				if options.id
					userModel = App.request "get:user:by:id", options.id 
					App.execute "when:fetched", userModel, => @_showView userModel
					
				else
					userModel = App.request "new:user" 
					@_showView userModel
			
			_showView:(userModel)=>
				@view = new EditApp.Views.EditUser model:userModel
				@show @view