define ['app',
		'apps/student-training-module/view-module/single-module-controller'
        'apps/student-app-training-modules/training-modules-controller'		
], (App)->
	App.module "StudentAppTrainingModules", (StudentAppTrainingModules, App)->

		#startWithParent = false
		class StudentTrainingRouter extends Marionette.AppRouter

			appRoutes:
				'students/training-module/:id'				: 'viewStudentModule'
				'students/training-modules/textbook/:tid'	: 'listStudentModules'


		Controller =

			viewStudentModule:(id)->
				$("#header-region").hide()
				$("#left-nav-region").hide()
				@studentTrainingModel = App.request "get:student:training:by:id", id

				breadcrumb_items =
					'items': [
						{'label': 'Dashboard', 'link': 'javascript://'},
						{'label': 'View Student Training Module', 'link': 'javascript:;', 'active': 'active'}
					]

				App.execute "update:breadcrumb:model", breadcrumb_items

				App.execute "show:student:training:module",
					region: App.mainContentRegion
					model: @studentTrainingModel

			listStudentModules:(tid)->
				if $.allowRoute 'quiz-list'
					App.execute "show:student:app:training:modules",
						region: App.mainContentRegion
						groupType	: 'student-training'
						textbookID	: tid

		StudentAppTrainingModules.on "start", ->
			new StudentTrainingRouter
				controller: Controller