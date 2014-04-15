define ['app'
		'apps/teachers-dashboard/dashboard/dashboard-controller'
		'apps/teachers-dashboard/list-textbooks/list-textbooks-controller'
		], (App)->

			App.module "TeachersDashboardApp", (TeachersDashboardApp, App)->

				#startWithParent = false
				class TeachersDashboardRouter extends Marionette.AppRouter

					appRoutes : 
						'teachers/dashboard' 					: 'teachersDashboard'
						'teachers/take-class/:class_id-*div' 	: 'takeClass'
						'teachers/start-training/:class_id' 	: 'startTraining'


				Controller = 
					teachersDashboard : ->
						new TeachersDashboardApp.View.DashboardController
											region : App.mainContentRegion

					takeClass :(class_id) ->
						@chooseTextbooks 'take-class', class_id

					startTraining :(class_id,div) ->
						@chooseTextbooks 'start-training', class_id, div

					chooseTextbooks:(str,class_id,div)->
						new TeachersDashboardApp.View.TextbooksListController
							region 		: App.mainContentRegion
							classID 	: class_id
							division	: div

	
				TeachersDashboardApp.on "start", ->
					new TeachersDashboardRouter
							controller : Controller 

							