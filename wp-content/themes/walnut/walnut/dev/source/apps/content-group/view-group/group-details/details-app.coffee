define ['app'
		'controllers/region-controller'
		'text!apps/content-group/view-group/group-details/templates/group-details.html'], (App, RegionController, collectionDetailsTpl)->

	App.module "CollecionDetailsApp.Controller", (Controller, App)->

		class Controller.ViewCollecionDetailsController extends RegionController

			initialize :(opts)->

				{@model}= opts

				@view= view = @_getCollectionDetailsView @model

				@show view, (loading:true)
				
			_getCollectionDetailsView : (model)->
				new CollectionDetailsView
					model 	: model 								


		class CollectionDetailsView extends Marionette.ItemView

			template 	: collectionDetailsTpl

			className 	: 'tiles white grid simple vertical green'


		# set handlers
		App.commands.setHandler "show:viewgroup:content:group:detailsapp", (opt = {})->
			new Controller.ViewCollecionDetailsController opt		

