define ['app', 'controllers/region-controller'], (App, RegionController)->

	App.module "TextbooksApp.Controller", (Controller, App)->

		class Controller.TextbooksController extends RegionController

			initialize : ->
				
				@view= view = @_getTextbooksView()
				@show view

			_getTextbooksView : ->
				new TextbooksView

		

		class TextbooksView extends Marionette.Layout

			template : textbooksTpl

			className : ''

	

