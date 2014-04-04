define ['app'
		'controllers/region-controller'
		'text!apps/content-collection/collection-details/templates/collection-details.html'], (App, RegionController, collectionDetailsTpl)->

	App.module "CollecionDetailsApp.Controller", (Controller, App)->

		class Controller.CollecionDetailsController extends RegionController

			initialize : ->
				
				@view= view = @_getCollectionDetailsView()

				@show view

			_getCollectionDetailsView : ->
				new collectionDetailsView


		class collectionDetailsView extends Marionette.ItemView

			template 	: collectionDetailsTpl

			className 	: 'tiles white grid simple vertical green'


		# set handlers
		App.commands.setHandler "show:collections:detailsapp", (opt = {})->
			new Controller.CollecionDetailsController opt		

