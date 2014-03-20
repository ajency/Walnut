define ['app', 'controllers/region-controller','text!apps/textbooks/templates/textbooks.html'], (App, RegionController, textbooksTpl)->

	App.module "TextbooksApp.Controller", (Controller, App)->

		class Controller.TextbooksController extends RegionController

			initialize : ->
				
				@view= view = @_getTextbooksView()
				@show view

			_getTextbooksView : ->
				new LoginView

		

		class TextbooksView extends Marionette.Layout

			template : textbooksTpl

			className : ''

	

