define ['app', 'controllers/region-controller', 'text!apps/textbook-single/templates/textbook-full.html'], (App, RegionController,textbookSingleTpl)->

	App.module "TextbookSingleApp.Controller", (Controller, App)->

		class Controller.SingleTextbook extends RegionController

			initialize : ->
				
				@view= view = @_getTextbookSingleView()
				@show view

			_getTextbookSingleView : ->
				new TextbookSingleView

		

		class TextbookSingleView extends Marionette.Layout

			template : textbookSingleTpl

			className : 'page-content'

	

