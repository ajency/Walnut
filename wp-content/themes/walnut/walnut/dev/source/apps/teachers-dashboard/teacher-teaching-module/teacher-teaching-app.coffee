  define ['app'
		'apps/teachers-dashboard/teacher-teaching-module/teacher-teaching-controller'
		], (App)->

			App.module "TeacherTeachingApp", (TeacherTeachingApp, App)->

				#startWithParent = false
				class TeacherTeachingRouter extends Marionette.AppRouter

					appRoutes : 
						'teachers/take-class/:classID/:div/textbook/:tID/module/:mID/:qID' 	: 'teacherTeachingModule'

				Controller = 

					teacherTeachingModule: (classID,div,tID, mID, qID) ->

						new TeacherTeachingApp.TeacherTeachingController
							region 		: App.mainContentRegion
							textbookID 	: tID
							classID 	: classID
							division	: div
							moduleID 	: mID
							questionID	: qID
	
				TeacherTeachingApp.on "start", ->
					new TeacherTeachingRouter
							controller : Controller 


			# set handlers
			App.commands.setHandler "start:teacher:teaching:app", (opt = {})->
				new App.TeacherTeachingApp.TeacherTeachingController opt	