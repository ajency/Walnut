define ['app', 'controllers/region-controller', 'apps/header/left/leftapp', 'apps/header/right/rightapp'], (App, RegionController)->

	App.module "HeaderApp.Controller", (Controller, App)->

		class Controller.HeaderController extends RegionController

			initialize : ->
				
				@view= view = @_getHeaderView()

				@show view

			_getHeaderView : ->
				new HeaderView


		class HeaderView extends Marionette.ItemView

			template : 'login'

			className : 'error-body no-top  pace-done'


		# set handlers
		App.commands.setHandler "show:headerapp", (opt = {})->
			console.info "sasa", opt
			new Controller.HeaderController opt		

