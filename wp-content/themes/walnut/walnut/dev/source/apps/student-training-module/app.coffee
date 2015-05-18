define ['app',
		'apps/student-training-module/edit-module/module-edit-controller'
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

			listStudentModules:->
				if $.allowRoute 'module-list'
					App.execute "show:module:listing:app",
						region: App.mainContentRegion
						groupType : 'student-training'

		StudentTrainingApp.on "start", ->
			new StudentTrainingRouter
				controller: Controller