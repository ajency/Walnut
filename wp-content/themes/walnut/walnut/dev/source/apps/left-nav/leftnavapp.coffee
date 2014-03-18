define ['app'
		'controllers/region-controller'
		'text!apps/left-nav/templates/leftnav.html'], (App, RegionController, leftNavTpl)->

	App.module "LeftNavApp.Controller", (Controller, App)->

		class Controller.LeftNavController extends RegionController

			initialize : ->
				
				@view= view = @_getLeftNavView()

				@show view

			_getLeftNavView : ->
				new LeftNavView


		class LeftNavView extends Marionette.ItemView

			template 	: leftNavTpl
			id 			: 'main-menu' 
			className	: 'page-sidebar'



		# set handlers
		App.commands.setHandler "show:leftnavapp", (opt = {})->
			new Controller.LeftNavController opt		

