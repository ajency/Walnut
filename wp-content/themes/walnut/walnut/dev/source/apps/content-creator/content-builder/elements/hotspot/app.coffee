define ['app'
		'apps/content-creator/content-builder/element/app'],(App,Element)->

			App.module "ContentCreator.ContentBuilder.Element.Hotspot",(Hotspot, App, Backbone, Marionette, $, _)->

				class Hotspot.Controller extends Element.Controller

					initialize : (options)->

						console.log "in hotspot"

						super(options)