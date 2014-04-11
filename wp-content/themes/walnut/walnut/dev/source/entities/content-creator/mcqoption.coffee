define ['app'
		'backbone'],(App,Backbone)->

			App.module "Entities.McqOption" ,(McqOption, App, Backbone, Marionette, $, _)->

				class McqOption.McqModel extends Backbone.Model

					defaults: ->
						marks : 0
						text : ''


				class McqOption.McqCollection extends Backbone.Collection

					model : McqOption.McqModel


				API = 
					createMcqOption:(data)->
							mcqOption = new McqOption.McqModel

							mcqOption.set data

							mcqOption

					createMcqOptionCollection:(data={})->
							mcqCollection = new McqOption.McqCollection

							mcqCollection.set data

							mcqCollection					

				App.reqres.setHandler "create:new:mcq:option",(data)->
						API.createMcqOption data


				App.reqres.setHandler "create:new:mcq:option:collection",(data)->

						API.createMcqOptionCollection data
