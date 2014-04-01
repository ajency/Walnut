define ['app'
		'controllers/region-controller'], (App, RegionController)->

	App.module "BreadcrumbApp.Controller", (Controller, App)->

		class Controller.BreadcrumbController extends RegionController

			initialize : ->
				
				@view= view = @_getBreadcrumbView
				@show view

			_getBreadcrumbView : ->
				new BreadcrumbView


		class BreadcrumbView extends Marionette.ItemView

			template : '<a href="#">Dashboard</a>'

			className : ''


		# set handlers
		App.commands.setHandler "show:breadcrumbapp", (opt = {})->
			new Controller.BreadcrumbController opt		
