define ['app'
		'controllers/region-controller'
		'apps/student-training-module/edit-module/module-edit-views'
		'apps/student-training-module/edit-module/module-description/module-description-controller'], (App, RegionController)->
	App.module "StudentTrainingApp.Edit", (Edit, App)->
		class Edit.GroupController extends RegionController

			initialize : (options) ->
				{@group_id,@groupType} = options
				@studentTrainingCollection = null
				@studentTrainingModel = App.request "new:student:training:module"
				@studentTrainingModel.set 'type', 'student_training'

				App.execute "when:fetched", @studentTrainingModel, =>
					@studentTrainingCollection = @_getContentGroupCollection()

					App.execute "when:fetched", @studentTrainingCollection, =>
						@showContentGroupView()

			_getContentGroupCollection:=>
				@studentTrainingCollection = App.request "get:content:pieces:of:group", @studentTrainingModel
				@studentTrainingCollection

			showContentGroupView : ->
				breadcrumb_items =
					'items' : [
						{ 'label' : 'Dashboard', 'link' : 'javascript://' },
						{ 'label' : 'Content Management', 'link' : 'javascript:;' },
						{ 'label' : 'Create Content Group', 'link' : 'javascript:;', 'active' : 'active' }
					]

				App.execute "update:breadcrumb:model", breadcrumb_items
				@layout =  @_getContentGroupEditLayout()

				@listenTo @layout, 'show', =>
					@showGroupDetailsApp()
	#                    if @group_id
	#                        @_showContentSelectionApp @studentTrainingModel

				#@listenTo @studentTrainingModel, 'change:id', @_showContentSelectionApp, @

				@listenTo @layout.collectionDetailsRegion, 'close:content:selection:app', =>
					console.log 'close:content:selection:app '
					@layout.contentSelectionRegion.close()

				@show @layout, (loading : true)

			showGroupDetailsApp : =>
				App.execute "show:student:training:edit:description",
					region : @layout.collectionDetailsRegion
					model : @studentTrainingModel
					studentTrainingCollection: @studentTrainingCollection

			_getContentGroupEditLayout : =>
				new Edit.Views.ContentGroupEditLayout

			_showContentSelectionApp : (model)=>

				App.execute "when:fetched", @studentTrainingCollection, =>
					if model.get('post_status') is 'underreview'
						App.execute "show:content:selectionapp",
							region : @layout.contentSelectionRegion
							model : model
							studentTrainingCollection : @studentTrainingCollection

					App.execute "show:editgroup:content:displayapp",
						region : @layout.contentDisplayRegion
						model : model
						studentTrainingCollection : @studentTrainingCollection


		App.commands.setHandler 'show:student:training:edit:module:controller',(opts)->
			new Edit.GroupController opts








