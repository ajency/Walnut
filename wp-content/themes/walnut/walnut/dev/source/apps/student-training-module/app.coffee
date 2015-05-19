define ['app',
		'apps/student-training-module/edit-module/module-edit-controller'
		'apps/student-training-module/view-module/single-module-controller'
        'apps/content-modules/modules-listing/app'
		
], (App)->
	App.module "StudentTrainingApp", (StudentTrainingApp, App)->

		#startWithParent = false
		class StudentTrainingRouter extends Marionette.AppRouter

			appRoutes:
				'add-student-training-module': 'addStudentModule'
				'view-student-training-module/:id': 'viewStudentModule'
				'edit-student-training-module/:id': 'editStudentModule'
				'view-student-training-modules': 'listStudentModules'


		Controller =
			addStudentModule: ->
				if $.allowRoute 'add-module'
					App.execute 'show:student:training:edit:module:controller',
						region : App.mainContentRegion

			editStudentModule:(id) ->
				if $.allowRoute 'edit-module'
					App.execute 'show:student:training:edit:module:controller',
						region	: App.mainContentRegion
						id		: id

			viewStudentModule:(id)->
				@studentTrainingModel = App.request "get:student:training:by:id", id

				breadcrumb_items =
					'items': [
						{'label': 'Dashboard', 'link': 'javascript://'},
						{'label': 'Content Management', 'link': 'javascript:;'},
						{'label': 'View Student Training Module', 'link': 'javascript:;', 'active': 'active'}
					]

				App.execute "update:breadcrumb:model", breadcrumb_items

				App.execute "show:student:training:module",
					region: App.mainContentRegion
					model: @studentTrainingModel
					
			listStudentModules:->
				if $.allowRoute 'module-list'
					App.execute "show:module:listing:app",
						region: App.mainContentRegion
						groupType : 'student-training'

		StudentTrainingApp.on "start", ->
			new StudentTrainingRouter
				controller: Controller