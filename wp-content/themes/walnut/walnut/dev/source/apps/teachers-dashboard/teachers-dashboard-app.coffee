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
						'teachers/dashboard' 						: 'teachersDashboard'
						'teachers/take-class/:classID/:div' 		: 'takeClass'
						'teachers/start-training/:classID' 			: 'startTraining'
						'teachers/take-class/:classID/:div/textbook/:tID' 	: 'textbookModules'


				Controller = 
					teachersDashboard : ->
						new TeachersDashboardApp.View.DashboardController
											region : App.mainContentRegion

					takeClass :(classID,div) ->
						new TeachersDashboardApp.View.TakeClassController
							region 		: App.mainContentRegion
							classID 	: classID
							division	: div

					startTraining :(classID) ->
						new TeachersDashboardApp.View.StartTrainingController
							region 		: App.mainContentRegion
							classID 	: classID

					textbookModules :(classID,div,tID) ->
						new TeachersDashboardApp.View.textbookModulesController
							region 		: App.mainContentRegion
							textbookID 	: tID


	
				TeachersDashboardApp.on "start", ->
					new TeachersDashboardRouter
							controller : Controller 

							