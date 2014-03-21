define ['app'
		'controllers/region-controller'
		'apps/header/left/leftapp'
		'apps/header/right/rightapp'
		'text!apps/header/templates/header.html'], (App, RegionController, LeftApp, RightApp,  headerTpl)->

	App.module "HeaderApp.Controller", (Controller, App)->

		class Controller.HeaderController extends RegionController

			initialize : ->
				
				@layout = layout = @_getHeaderView()

				@listenTo layout, 'show', @showLeftRightViews

				@show layout

			showLeftRightViews:->
				App.execute "show:leftheaderapp", region : @layout.leftRegion
				App.execute "show:rightheaderapp", region : @layout.rightRegion


			_getHeaderView : ->
				new HeaderView


		class HeaderView extends Marionette.Layout

			template 	: headerTpl

			className 	: 'header navbar navbar-inverse'

			regions:
				leftRegion	: '#header-left'
				rightRegion	: '#header-right'

		# set handlers
		App.commands.setHandler "show:headerapp", (opt = {})->
			new Controller.HeaderController opt		

