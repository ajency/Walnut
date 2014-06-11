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

			elementboxCollection = new ElementBox.ElementCollection
			elementboxCollection.add [{element : "Hotspot"},{element : "Row"}]
		
				
			# PUBLIC API FOR ENitity
			API =
				getElements: (param = {})->
				   

				getElementSettingOptions:(ele)->
					console.log elementboxCollection.get ele
					element = elementboxCollection.get ele

					element

			# REQUEST HANDLERS
			App.reqres.setHandler "get:elementbox:elements", ->
				API.getElements()

			App.reqres.setHandler "get:element:settings:options",(ele)->
                API.getElementSettingOptions ele


