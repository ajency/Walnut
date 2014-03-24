define ['app'
		'apps/textbooks/list/listcontroller'
		'plugins/search_results'], (App)->

			App.module "TextbooksApp", (TextbooksApp, App)->

				#startWithParent = false
				class TextbooksRouter extends Marionette.AppRouter

					appRoutes : 
						'textbooks' : 'showTextbooks'


				Controller = 
					showTextbooks : ->
						new TextbooksApp.List.ListController
											region : App.mainContentRegion


				TextbooksApp.on "start", ->
					new TextbooksRouter
							controller : Controller

							