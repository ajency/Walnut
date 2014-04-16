define ['app'
		'backbone'],(App,Backbone)->

			App.module "Entities.Option" ,(Option, App, Backbone, Marionette, $, _)->

				class Option.OptionModel extends Backbone.Model

					defaults: ->
						marks : 0
						text : ''


				class Option.OptionCollection extends Backbone.Collection

					model : Option.OptionModel


				API = 
					createOption:(data)->
							option = new Option.OptionModel

							option.set data

							option

					createOptionCollection:(data={})->
							optionCollection = new Option.OptionCollection

							optionCollection.set data

							optionCollection					

				App.reqres.setHandler "create:new:option",(data)->
						API.createOption data


				App.reqres.setHandler "create:new:option:collection",(data)->

						API.createOptionCollection data
