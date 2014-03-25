define ['app'
		'backbone'],(App,Backbone)->

			App.module "Entities.HotspotElementBox", (HotspotElementBox, App, Backbone, Marionette, $, _)->


				class HotspotElementBox.ElementModel extends Backbone.Model

					idAttribute : 'element'

					name : 'hotspotelementbox'

				class HotspotElementBox.ElementCollection extends Backbone.Collection

					model : HotspotElementBox.ElementModel


				hotspotelementCollection = new HotspotElementBox.ElementCollection

				hotspotelementCollection.add [
							element : 'Hotspot-Circle'
							icon	: 'fa-circle-o'
						,
							element : 'Hotspot-Rectangle'
							icon	: 'fa-square-o'
						,
							element : 'Hotspot-Image'
							icon	: 'fa-camera'
				]

				API =

					getElements :->
						hotspotelementCollection



				App.reqres.setHandler "get:all:hotspot:elements", ->
						API.getElements()
