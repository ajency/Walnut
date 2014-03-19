define ['app'
		'controllers/region-controller'
		],(App,RegionController)->

			App.module "ContentCreator.PropertyDock.QuestionElementBox",
				(QuestionElementBox, App, Backbone, Marionette, $, _)->
