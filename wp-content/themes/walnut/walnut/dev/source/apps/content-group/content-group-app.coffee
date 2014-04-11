define ['app'
		'apps/content-group/edit-group/group-edit-controller'
		'apps/content-group/view-group/group-view-controller'
		], (App)->

			App.module "ContentGroupApp", (ContentGroupApp, App)->

				#startWithParent = false
				class ContentGroupRouter extends Marionette.AppRouter

					appRoutes : 
						'edit-group' : 'editGroup'
						'view-group/:id' : 'viewGroup'


				Controller = 
					editGroup : ->
						new ContentGroupApp.Edit.GroupController
											region : App.mainContentRegion

					viewGroup : (id)->
						new ContentGroupApp.View.GroupController
						 					region : App.mainContentRegion
						 					modelID: id

	
				ContentGroupApp.on "start", ->
					new ContentGroupRouter
							controller : Controller 

							