define ['app'
		'apps/users/list/controller'
		'apps/users/edit/controller'
], (App)->
	App.module "UsersApp", (UsersApp, App)->

		#startWithParent = false
		class UsersRouter extends Marionette.AppRouter

			appRoutes:
				'parents'			: 'listUser'
				'parents/edited/:id': 'listUser'
				'add-parent'		: 'addUser'
				'edit-parent/:id'	: 'addUser'
			  
		Controller =
			listUser:(editedID=0) ->
				new UsersApp.List.Controller 
					region: App.mainContentRegion
					editedID: editedID
				
			addUser:(id=0) ->
				new UsersApp.Edit.Controller 
					region	: App.mainContentRegion
					id		: id

		UsersApp.on "start", ->
			new UsersRouter
				controller: Controller