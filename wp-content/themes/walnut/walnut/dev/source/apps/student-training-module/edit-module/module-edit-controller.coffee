define ['app'
		'controllers/region-controller'
		'apps/student-training-module/edit-module/module-edit-views'
		'apps/student-training-module/edit-module/module-description/module-description-controller'], (App, RegionController)->
	App.module "StudentTrainingApp.Edit", (Edit, App)->
		class Edit.GroupController extends RegionController

			initialize : (options) ->
				{@id,@groupType} = options
				@contentLayoutItems = null
				@studentTrainingModel = if @id then App.request "get:student:training:by:id", @id else App.request "new:student:training:module"				
				@studentTrainingModel.set 'type', 'student-training'

				App.execute "when:fetched", @studentTrainingModel, =>
					@contentLayoutItems = @_getContentGroupCollection()

					App.execute "when:fetched", @contentLayoutItems, =>
						@showContentGroupView()

			_getContentGroupCollection:=>
				@contentLayoutItems = new Backbone.Collection

				_.each @studentTrainingModel.get('content_layout'),(content)=>
					if content.type is 'content-piece'
						itemModel = App.request "get:content:piece:by:id",content.id
					else
						itemModel = App.request "get:quiz:by:id",content.id
					@contentLayoutItems.add itemModel
				@contentLayoutItems

			showContentGroupView : ->
				breadcrumb_items =
					'items' : [
						{ 'label' : 'Dashboard', 'link' : 'javascript://' },
						{ 'label' : 'Content Management', 'link' : 'javascript:;' },
						{ 'label' : 'Create Content Group', 'link' : 'javascript:;', 'active' : 'active' }
					]

				App.execute "update:breadcrumb:model", breadcrumb_items
				@layout =  @_getModuleEditLayout()

				@listenTo @layout, 'show', =>
					@showGroupDetailsApp()
					@_showContentSelectionApp @studentTrainingModel if @id

				@listenTo @studentTrainingModel, 'change:id', @_showContentSelectionApp, @

				@listenTo @layout.collectionDetailsRegion, 'close:content:selection:app', =>
					console.log 'close:content:selection:app '
					@layout.contentSelectionRegion.close()

				@show @layout, (loading : true)

			showGroupDetailsApp : =>
				App.execute "show:student:training:edit:description",
					region : @layout.collectionDetailsRegion
					model : @studentTrainingModel
					contentGroupCollection: @contentLayoutItems

			_getModuleEditLayout : =>
				new Edit.Views.EditLayout

			_showContentSelectionApp : (model)=>

				App.execute "when:fetched", @contentLayoutItems, =>
					if model.get('post_status') is 'underreview'
						App.execute "show:content:selectionapp",
							region : @layout.contentSelectionRegion
							model : model
							contentGroupCollection : @contentLayoutItems

					App.execute "show:editgroup:content:displayapp",
						region : @layout.contentDisplayRegion
						model : model
						contentGroupCollection : @contentLayoutItems


		App.commands.setHandler 'show:student:training:edit:module:controller',(opts)->
			new Edit.GroupController opts








