define ['app'
], (App)->
	App.module "ContentModulesApp", (ContentModulesApp, App)->

		#startWithParent = false
		class ContentModulesRouter extends Marionette.AppRouter

			appRoutes:
				'add-student-training-module': 'addStudentModule'
				'view-student-training-module/:id': 'viewStudentModule'
				'edit-student-training-module/:id': 'editStudentModule'
				'view-student-training-modules': 'listStudentModules'


		Controller =
			addStudentModule: ->
				console.log 'add student module'
				if $.allowRoute 'add-module'
					App.execute 'show:edit:module:controller',
						region : App.mainContentRegion
						groupType : 'teaching-module'

			editStudentModule:(id) ->

			viewStudentModule:(id)->

			listStudentModules:->

		ContentModulesApp.on "start", ->
			new  ContentModulesRouter
				controller: Controller