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
						'teachers/take-class/:classID/:div/textbook/:tID/module/:mID' 	: 'takeClassSingleModule'


				Controller = 
					editGroup : ->
						new ContentGroupApp.Edit.GroupController
											region : App.mainContentRegion

					viewGroup : (id)->
						@contentGroupModel = App.request "get:content:group:by:id", id

						breadcrumb_items = 'items':[
							{'label':'Dashboard','link':'javascript://'},
							{'label':'Content Management','link':'javascript:;'},
							{'label':'View Content Group','link':'javascript:;','active':'active'}
						]
							
						App.execute "update:breadcrumb:model", breadcrumb_items

						new ContentGroupApp.View.GroupController
						 					region : App.mainContentRegion
						 					model: @contentGroupModel

					groupsListing : ->
						new ContentGroupApp.ListingView.GroupController
											region : App.mainContentRegion

					takeClassSingleModule:(classID,div,tID,mID)->
						
						@textbook= App.request "get:textbook:by:id",tID 
						@contentGroupModel = App.request "get:content:group:by:id", mID

						App.execute "when:fetched", @textbook, =>
							App.execute "when:fetched", @contentGroupModel, =>
								textbookName= @textbook.get 'name'
								moduleName = @contentGroupModel.get 'name'
								breadcrumb_items = 'items':[
									{'label':'Dashboard','link':'#teachers/dashboard'},
									{'label':'Take Class','link':'#teachers/take-class/'+classID+'/'+div},
									{'label':textbookName,'link':'#teachers/take-class/'+classID+'/'+div+'/textbook/'+tID},
									{'label':moduleName,'link':'javascript:;','active':'active'}
								]
									
								App.execute "update:breadcrumb:model", breadcrumb_items

						new ContentGroupApp.View.GroupController
		 					region 		: App.mainContentRegion
		 					model 		: @contentGroupModel
		 					module 		: 'take-class'

	
				ContentGroupApp.on "start", ->
					new ContentGroupRouter
							controller : Controller 

							