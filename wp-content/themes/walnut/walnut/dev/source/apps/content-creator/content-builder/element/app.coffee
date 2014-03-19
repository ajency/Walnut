define ['app'
		'controllers/region-controller'],(App,RegionController)->

			App.module "ContentCreator.ContentBuilder.Element" ,(Element, App, Backbone, Marionette, $, _)->

				class Element.Controller extends RegionController

					initialize : (options)->

						console.log "in element"