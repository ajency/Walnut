define ['app'
		'backbone'],(App, Backbone)->

			App.module "Entities.HotspotElement" , (HotspotElement, App, Backbone)->

				class HotspotElement.ElementModel extends Backbone.Model

					defaults :->
						family : 'hotspot'
						toDelete : false

				class HotspotElement.ElementCollection extends Backbone.Collection

					model : HotspotElement.ElementModel



				API = 

					createHotspotElement : (data)->
							hotspotElement = new HotspotElement.ElementModel

							hotspotElement.set data

							hotspotElement

					createHotspotElementCollection :(data={})->
							hotspotCollection = new HotspotElement.ElementCollection
							
							hotspotCollection.set data
							hotspotCollection 


				App.reqres.setHandler "create:new:hotspot:element",(data)->

						API.createHotspotElement data

				App.reqres.setHandler "create:new:hotspot:element:collection",(data)->
						if data!=undefined
							jsonData = data
						else
							jsonData = ''
						API.createHotspotElementCollection jsonData