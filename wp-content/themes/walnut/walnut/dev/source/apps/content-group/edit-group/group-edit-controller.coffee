define ['app'
		'controllers/region-controller'
		'text!apps/content-group/edit-group/templates/content-group.html'
		'apps/content-group/edit-group/group-details/details-app'
		'apps/content-group/edit-group/content-selection/content-selection-app'
		'apps/content-group/edit-group/content-display/content-display-app'], (App, RegionController, contentGroupTpl)->

	App.module "ContentGroupApp.Edit", (Edit, App)->

		class Edit.GroupController extends RegionController

			initialize : ->
				contentGroupCollection = App.request "get:content:groups"

				breadcrumb_items = 'items':[
						{'label':'Dashboard','link':'javascript://'},
						{'label':'Content Management','link':'javascript:;'},
						{'label':'Create Content Group','link':'javascript:;','active':'active'}
					]
						
				App.execute "update:breadcrumb:model", breadcrumb_items


				@layout = layout = @_getContentGroupEditLayout()

				@listenTo layout, 'show', @showContentGroupViews

				@show layout, (loading:true)

				@listenTo contentGroupCollection, 'add', @newModelAdded,@


			showContentGroupViews:=>
				contentGroupModel = App.request "save:content:group:details", ''
				App.execute "show:editgroup:content:group:detailsapp", 
					region : @layout.collectionDetailsRegion
					model  : contentGroupModel

			_getContentGroupEditLayout : =>
				new ContentGroupEditLayout

			newModelAdded :(model)=>
				App.execute "show:content:selectionapp", region : @layout.contentSelectionRegion, model : model
				App.execute "show:editgroup:content:displayapp", region : @layout.contentDisplayRegion, model: model


		class ContentGroupEditLayout extends Marionette.Layout

			template 	: contentGroupTpl

			className 	: ''

			regions:
				collectionDetailsRegion	: '#collection-details-region'
				contentSelectionRegion	: '#content-selection-region'
				contentDisplayRegion	: '#content-display-region'	

