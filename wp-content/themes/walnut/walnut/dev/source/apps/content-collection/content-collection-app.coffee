define ['app'
		'controllers/region-controller'
		'text!apps/content-collection/templates/content-collection.html'
		'apps/content-collection/collection-details/details-app'
		'apps/content-collection/content-selection/content-selection-app-2'
		'apps/content-collection/content-display/content-display-app'], (App, RegionController, contentCollectionTpl)->

	App.module "ContentCollectionApp.Controller", (Controller, App)->

		class Controller.ContentCollectionController extends RegionController

			initialize : ->
				breadcrumb_items = 'items':[
						{'label':'Dashboard','link':'javascript://'},
						{'label':'Content Management','link':'javascript:;'},
						{'label':'Create Content Collection','link':'javascript:;','active':'active'}
					]
						
				App.execute "update:breadcrumb:model", breadcrumb_items


				@layout = layout = @_getContentCreatorLayout()

				@listenTo layout, 'show', @showContentCollectionViews

				@show layout, (loading:true)


			showContentCollectionViews:=>
				App.execute "show:collections:detailsapp", region : @layout.collectionDetailsRegion
				App.execute "show:content:selectionapp", region : @layout.contentSelectionRegion
				App.execute "show:content:displayapp", region : @layout.contentDisplayRegion


			_getContentCreatorLayout : =>
				new ContentCreatorLayout


		class ContentCreatorLayout extends Marionette.Layout

			template 	: contentCollectionTpl

			className 	: ''

			regions:
				collectionDetailsRegion	: '#collection-details-region'
				contentSelectionRegion	: '#content-selection-region'
				contentDisplayRegion	: '#content-display-region'

		# set handlers
		App.commands.setHandler "show:create:collection", (opt = {})->
			new Controller.ContentCollectionController opt		

