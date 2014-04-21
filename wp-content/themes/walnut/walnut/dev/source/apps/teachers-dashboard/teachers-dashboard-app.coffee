define ['app'
		'apps/teachers-dashboard/dashboard/dashboard-controller'
		'apps/teachers-dashboard/start-training/start-training-controller'
		'apps/teachers-dashboard/take-class/take-class-controller'
		'apps/teachers-dashboard/textbook-modules/textbook-modules-controller'
		], (App)->

			App.module "TeachersDashboardApp", (TeachersDashboardApp, App)->

				#startWithParent = false
				class TeachersDashboardRouter extends Marionette.AppRouter

					appRoutes : 
						'teachers/dashboard' 					: 'teachersDashboard'
						'teachers/take-class/:class_id-*div' 	: 'takeClass'
						'teachers/start-training/:class_id' 	: 'startTraining'
						'teachers/content-modules/textbook/:t_id'		 	: 'textbookModules'


				Controller = 
					teachersDashboard : ->
						new TeachersDashboardApp.View.DashboardController
											region : App.mainContentRegion

					takeClass :(class_id,div) ->
						new TeachersDashboardApp.View.TakeClassController
							region 		: App.mainContentRegion
							classID 	: class_id
							division	: div

					startTraining :(class_id) ->
						new TeachersDashboardApp.View.StartTrainingController
							region 		: App.mainContentRegion
							classID 	: class_id

					textbookModules :(t_id) ->
						new TeachersDashboardApp.View.textbookModulesController
							region 		: App.mainContentRegion
							textbookID 	: t_id


	
				TeachersDashboardApp.on "start", ->
					new TeachersDashboardRouter
							controller : Controller 

							