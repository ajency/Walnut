define ['app'
		'apps/content-creator/content-builder/element/controller'],
		(App.Element)->

			App.module "ContentCreator.ContentBuilder.Element.Mcq" , 
			(Mcq, App, Backbone, Marionette, _, $)->

				class Mcq.Controller extends Element.Controller