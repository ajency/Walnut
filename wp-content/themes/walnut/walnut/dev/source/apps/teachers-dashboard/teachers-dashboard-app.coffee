define ['app'
		'apps/teachers-dashboard/dashboard/dashboard-controller'
		'apps/teachers-dashboard/take-class/take-class-controller'
		'apps/teachers-dashboard/take-class/textbook-modules/textbook-modules-controller'
		'apps/teachers-dashboard/start-training/start-training-controller'
		'apps/teachers-dashboard/start-training/textbook-modules/textbook-modules-controller'
		], (App)->

			App.module "TeachersDashboardApp", (TeachersDashboardApp, App)->

				#startWithParent = false
				class TeachersDashboardRouter extends Marionette.AppRouter

					appRoutes : 
						'teachers/dashboard' 								: 'teachersDashboard'
						'teachers/take-class/:classID/:div' 				: 'takeClass'
						'teachers/take-class/:classID/:div/textbook/:tID' 	: 'takeClassTextbookModules'
						'teachers/start-training/:classID' 					: 'startTraining'
						'teachers/start-training/:classID/textbook/:tID' 	: 'startTrainingTextbookModules'


				Controller = 
					teachersDashboard : ->
						new TeachersDashboardApp.View.DashboardController
							region 		: App.mainContentRegion

					takeClass :(classID,div) ->
						new TeachersDashboardApp.View.TakeClassController
							region 		: App.mainContentRegion
							classID 	: classID
							division	: div

					startTraining :(classID) ->
						new TeachersDashboardApp.View.StartTrainingController
							region 		: App.mainContentRegion
							classID 	: classID

					takeClassTextbookModules :(classID,div,tID) ->
						new TeachersDashboardApp.View.textbookModulesController
							region 		: App.mainContentRegion
							textbookID 	: tID
							classID 	: classID
							division	: div

					startTrainingTextbookModules :(classID,tID) ->
						new TeachersDashboardApp.View.startTrainingTextbookModulesController
							region 		: App.mainContentRegion
							textbookID 	: tID
							classID 	: classID


	
				TeachersDashboardApp.on "start", ->
					new TeachersDashboardRouter
							controller : Controller 

							