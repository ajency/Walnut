define ['app'
		'controllers/region-controller'], (App, RegionController)->

	App.module "BreadcrumbApp.Controller", (Controller, App)->

		class Controller.BreadcrumbController extends RegionController

			initialize : ->
				console.log 'whats happening?????'
				@view= view = @_getBreadcrumbView
				@show view

			_getBreadcrumbView : ->
				new BreadcrumbView
				console.log 'whats happening@@@@@'


		class BreadcrumbView extends Marionette.ItemView

			template : '<li>Dashboard</li>
						<li>
							<a href="javascript://">Content Management</a>
						</li>
						<li>
							<a class="active" href="javascript://">Textbooks</a>
						</li>'

			tagName	 : 'ul'
			className: 'breadcrumb'


		# set handlers
		App.commands.setHandler "show:breadcrumbapp" :->
			console.log 'whats happening!!!!!!'
			new Controller.BreadcrumbController		
