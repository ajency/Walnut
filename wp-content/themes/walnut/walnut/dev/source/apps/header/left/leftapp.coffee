define ['app'
		'controllers/region-controller'
		'text!apps/header/left/templates/left.html'], (App, RegionController, leftTpl)->

	App.module "LeftHeaderApp.Controller", (Controller, App)->

		class Controller.LeftHeaderController extends RegionController

			initialize : ->
				
				@view= view = @_getLeftHeaderView()

				@show view

			_getLeftHeaderView : ->
				new LeftHeaderView


		class LeftHeaderView extends Marionette.ItemView

			template 	: leftTpl

			className 	: 'pull-left'

			events : 
				'click #layout-condensed-toggle'	: 'toggleLeftSidebar'

			toggleLeftSidebar: -> 
				if($('#main-menu').attr('data-inner-menu')=='1')
					console.log("Menu is already condensed");
				
				else
					if($('#main-menu').hasClass('mini'))
						$('body').removeClass('grey');
						$('#main-menu').removeClass('mini');
						$('.page-content').removeClass('condensed');
						$('.scrollup').removeClass('to-edge');
						$('.header-seperation').css("width", "250px");
						$('.header-seperation').css('height','61px');
						$('.footer-widget').show();
					
					else
						$('body').addClass('grey');
						$('#main-menu').addClass('mini');
						$('.page-content').addClass('condensed');
						$('.scrollup').addClass('to-edge');
						$('.header-seperation').css("width", "0");
						$('.footer-widget').hide();

			
					
				

		# set handlers
		App.commands.setHandler "show:leftheaderapp", (opt = {})->
			new Controller.LeftHeaderController opt		

