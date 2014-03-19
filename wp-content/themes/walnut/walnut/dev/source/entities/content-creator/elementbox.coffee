define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.ElementBox", (ElementBox, App, Backbone, Marionette, $, _)->

			# Element Model
			class ElementBox.ElementModel extends Backbone.Model
				idAttribute : 'element'

				name: 'elementbox'

			# Element collection
			class ElementBox.ElementCollection extends Backbone.Collection
				# model
				model : ElementBox.ElementModel

				url : ''

				

				
			# PUBLIC API FOR ENitity
			API =
				getElements: (param = {})->
				   new ElementBox.ElementCollection [{element : "Hotspot"},{element : "Row"}]


			# REQUEST HANDLERS
			App.reqres.setHandler "get:elementbox:elements", ->
				API.getElements()


