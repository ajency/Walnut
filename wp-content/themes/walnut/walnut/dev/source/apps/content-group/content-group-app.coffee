define ['app'
		'apps/content-group/edit-group/group-edit-controller'
		'apps/content-group/view-group/group-view-controller'
		'apps/content-group/groups-listing/group-listing-controller'
		], (App)->

			App.module "ContentGroupApp", (ContentGroupApp, App)->

				#startWithParent = false
				class ContentGroupRouter extends Marionette.AppRouter

					appRoutes : 
						'edit-group' : 'editGroup'
						'view-group/:id' : 'viewGroup'
						'list-groups' : 'groupsListing'


				Controller = 
					editGroup : ->
						new ContentGroupApp.Edit.GroupController
											region : App.mainContentRegion

					viewGroup : (id)->
						new ContentGroupApp.View.GroupController
						 					region : App.mainContentRegion
						 					modelID: id

					groupsListing : ->
						new ContentGroupApp.ListingView.GroupController
											region : App.mainContentRegion

	
				ContentGroupApp.on "start", ->
					new ContentGroupRouter
							controller : Controller 

							