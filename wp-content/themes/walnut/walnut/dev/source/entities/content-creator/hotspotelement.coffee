define ['app'
		'backbone'],(App, Backbone)->

			App.module "Entities.HotspotElement" , (HotspotElement, App, Backbone)->

				class HotspotElement.ElementModel extends Backbone.Model

					defaults :->
						family : 'hotspot'
						toDelete : false



				API = 

					createHotspotElement : (data)->
							hotspotElement = new HotspotElement.ElementModel

							hotspotElement.set data

							hotspotElement



				App.reqres.setHandler "create:new:hotspot:element",(data)->

						API.createHotspotElement data