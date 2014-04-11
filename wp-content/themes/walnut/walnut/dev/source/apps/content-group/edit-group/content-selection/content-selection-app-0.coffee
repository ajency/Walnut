define ['app'
		'controllers/region-controller'
		'components/data-content-table/content-table-view'
		'text!apps/content-collection/content-selection/templates/content-selection.html'],
		(App, RegionController,contentDataView, contentSelectionTpl)->

	App.module "ContentSelectionApp.Controller", (Controller, App)->

		class Controller.ContentSelectionController extends RegionController

			initialize : ->
				questionsCollection = new Backbone.Collection [
						{
							'id'			:'1'
							'title'			:'test1'
							'creator'		:'Bob'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
						{
							'id'			:'2'
							'title'			:'Question Test'
							'creator'		:'John'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
						{
							'id'			:'3'
							'title'			:'test34'
							'creator'		:'Bob'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
						{
							'id'			:'4'
							'title'			:'Trial 4324'
							'creator'		:'Jane'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
						{
							'id'			:'5'
							'title'			:'Test Stuff'
							'creator'		:'Bob'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
						{
							'id'			:'6'
							'title'			:'New Trials'
							'creator'		:'Bessie'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
						{
							'id'			:'7'
							'title'			:'Blast'
							'creator'		:'Shawn'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
						{
							'id'			:'8'
							'title'			:'Do test'
							'creator'		:'Mike'
							'published_by'	: 'Admin'
							'created_on'	:'4/10/2013'
							'last_modified'	: '2/02/2014'
						}
				]

				tableConfig = 
					'data': [
						{
							'label':'Question'
							'value':'title'
						}
						{
							'label':'Creator'
							'value':'creator'
						}
						{
							'label':'Last Modified'
							'value':'last_modified'
						}
					]
					'id_attribute': 'id' # id attribute of the model
					'selectbox': true
					'pagination': true
				
				@layout = layout= @_getContentSelectionLayout()
				@listenTo layout, 'show', @showLeftRightViews
				@view= view = @_getContentDataView(questionsCollection, tableConfig)

				@show view, (loading:true)

			_getContentDataView : (collection, tableConfig)->
				new dataContentTableView
					collection: collection
					tableConfig: tableConfig


			_getContentSelectionLayout : =>
				new ContentSelectionLayout

		class ContentSelectionLayout extends Marionette.Layout

			template 	: contentSelectionTpl

			className 	: 'tiles white grid simple vertical green'

			regions 	: 
				contentTableRegion: 'content-data-table-region' 
				

		# set handlers
		App.commands.setHandler "show:content:selectionapp", (opt = {})->
			new Controller.ContentSelectionController opt		
