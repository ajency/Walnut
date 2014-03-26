define ['app'
		'apps/textbook-single/controller'], (App)->

			App.module "TextbookSingleApp", (TextbookSingleApp, App)->

				#startWithParent = false
				class TextbookSingleRouter extends Marionette.AppRouter

					appRoutes : 
						'textbook/:term_id' : 'showSingleTextbook'


				Controller = 
					showSingleTextbook :(term_id)->
						new TextbookSingleApp.Controller.SingleTextbook
											region : App.mainContentRegion


				TextbookSingleApp.on "start", ->
					new TextbookSingleRouter
							controller : Controller