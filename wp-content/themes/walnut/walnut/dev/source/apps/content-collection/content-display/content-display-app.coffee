define ['app'
		'controllers/region-controller'
		'text!apps/content-collection/content-display/templates/content-display.html'], (App, RegionController, contentDisplayTpl)->

	App.module "CollectionContentDisplayApp.Controller", (Controller, App)->

		class Controller.CollectionContentDisplayController extends RegionController

			initialize : ->
				
				@view= view = @_getCollectionContentDisplayView()

				@show view

			_getCollectionContentDisplayView : ->
				new contentDisplayView


		class contentDisplayView extends Marionette.ItemView

			template 	: contentDisplayTpl

			className 	: 'col-md-10'

			id 			: 'myCanvas-miki'


		# set handlers
		App.commands.setHandler "show:content:displayapp", (opt = {})->
			new Controller.CollectionContentDisplayController opt		

