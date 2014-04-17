define ['app'
		'controllers/region-controller'
		'text!apps/content-group/edit-group/templates/content-group.html'
		'apps/content-group/view-group/group-details/details-app'
		'apps/content-group/view-group/content-display/content-display-app'
		], (App, RegionController, contentGroupTpl)->

	App.module "ContentGroupApp.View", (View, App)->

		class View.GroupController extends RegionController

			initialize :(opts) ->
				{modelID} = opts
				@contentGroupModel = App.request "get:content:group:by:id", modelID

				breadcrumb_items = 'items':[
						{'label':'Dashboard','link':'javascript://'},
						{'label':'Content Management','link':'javascript:;'},
						{'label':'View Content Group','link':'javascript:;','active':'active'}
					]
						
				App.execute "update:breadcrumb:model", breadcrumb_items


				@layout = layout = @_getContentGroupViewLayout()

				@listenTo layout, 'show', @showContentGroupViews

				@show layout, (loading:true)


			showContentGroupViews:=>
				App.execute "when:fetched", @contentGroupModel, =>
					App.execute "show:viewgroup:content:group:detailsapp", 
						region : @layout.collectionDetailsRegion
						model  : @contentGroupModel

					if _.size(@contentGroupModel.get('content_pieces'))>0
						App.execute "show:viewgroup:content:displayapp", region : @layout.contentDisplayRegion, model: @contentGroupModel

			_getContentGroupViewLayout : =>
				new ContentGroupViewLayout


		class ContentGroupViewLayout extends Marionette.Layout

			template 	: contentGroupTpl

			className 	: ''

			regions:
				collectionDetailsRegion	: '#collection-details-region'
				contentDisplayRegion	: '#content-display-region'	

