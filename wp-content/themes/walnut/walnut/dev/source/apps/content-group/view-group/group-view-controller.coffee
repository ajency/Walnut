define ['app'
		'controllers/region-controller'
		'text!apps/content-group/edit-group/templates/content-group.html'
		'apps/content-group/view-group/group-details/details-app'
		'apps/content-group/view-group/content-display/content-display-app'
		], (App, RegionController, contentGroupTpl)->

	App.module "ContentGroupApp.View", (View, App)->

		class View.GroupController extends RegionController

			initialize :(opts) ->
				{model} = opts
				{@module} = opts

				@contentGroupModel = model

				@layout = layout = @_getContentGroupViewLayout()

				@listenTo layout, 'show', @showContentGroupViews

				@show layout, (loading:true)

			showContentGroupViews:=>
				App.execute "when:fetched", @contentGroupModel, =>
					App.execute "show:viewgroup:content:group:detailsapp", 
						region : @layout.collectionDetailsRegion
						model  : @contentGroupModel
						module : @module


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

