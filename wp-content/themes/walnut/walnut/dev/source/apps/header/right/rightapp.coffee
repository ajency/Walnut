define ['app'
		'controllers/region-controller'
		'text!apps/header/right/templates/right.html'], (App, RegionController, rightTpl)->

	App.module "RightHeaderApp.Controller", (Controller, App)->

		class Controller.RightHeaderController extends RegionController

			initialize : ->
				
				@view= view = @_getRightHeaderView()

				@show view

			_getRightHeaderView : ->
				new RightHeaderView


		class RightHeaderView extends Marionette.ItemView

			template 	: rightTpl

			className 	: 'pull-right'

			events: 
				'click #user-options'	: 'user_options_popup'


			user_options_popup : (e)->
				if $(e.target)
					.closest 'li'
					.hasClass 'open'
						$(e.target).closest 'li' 
						.removeClass 'open'
				else
					$(e.target).closest 'li' 
					.addClass 'open'
					

		# set handlers
		App.commands.setHandler "show:rightheaderapp", (opt = {})->
			new Controller.RightHeaderController opt		

