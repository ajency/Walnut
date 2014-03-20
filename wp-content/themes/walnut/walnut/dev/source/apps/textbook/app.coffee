define ['app
		apps/textbooks/controller'], (App)->

			App.module "TextbooksApp", (TextbooksApp, App)->

				#startWithParent = false
				class TextbooksRouter extends Marionette.AppRouter

					appRoutes : 
						'textbooks' : 'showTextbooks'


				Controller = 
					showTextbooks : ->
						new TextbooksApp.Controller.TextbooksController
											region : App.contentRegion


				TextbooksApp.on "start", ->
					new TextbooksRouter
							controller : Controller