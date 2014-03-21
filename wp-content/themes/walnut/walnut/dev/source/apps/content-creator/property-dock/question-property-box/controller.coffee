define ['app'
		'controllers/region-controller'
		],(App, RegionController)->

			App.module "ContentCreator.PropertyDock.QuestionPropertyBox",
				(QuestionPropertyBox, App, Backbone, Marionette, $, _)->


					class QuestionPropertyBoxController extends RegionController


					