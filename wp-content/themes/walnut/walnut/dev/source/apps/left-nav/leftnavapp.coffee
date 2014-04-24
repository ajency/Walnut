define ['app'
		'controllers/region-controller'
		'apps/left-nav/views'], (App, RegionController)->

	App.module "LeftNavApp.Controller", (Controller, App)->

		class Controller.LeftNavController extends RegionController

			initialize : ->
				
				menuCollection = App.request "get:site:menus"

				@view= view = @_getLeftNavView menuCollection

				@show view,(loading:true)

			_getLeftNavView :(collection) ->
				new Controller.Views.LeftNavView
								collection: collection


		# set handlers
		App.commands.setHandler "show:leftnavapp", (opt = {})->
			new Controller.LeftNavController opt		

