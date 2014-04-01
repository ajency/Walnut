define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.Breadcrumb", (Breadcrumb, App, Backbone, Marionette, $, _)->

			# Breadcrumb model
			class Breadcrumb.BreadcrumbModel extends Backbone.Model

				name: 'breadcrumb'

				defaults : ->
					'items':[
						{'label':'Dashboard','link':'javascript://'},
						{'label':'Content Creator','link':'javascript://'},
						{'label':'Textbooks','link':'javascript://','active':'active'}
					]


			window.breadcrumb = new Breadcrumb.BreadcrumbModel


			API=
				updateBreadcrumbModel:(data)->
					breadcrumb.set data
					App.execute "show:breadcrumbapp", region:App.breadcrumbRegion
			
			App.reqres.setHandler "get:breadcrumb:model", ->
				breadcrumb


			App.commands.setHandler "update:breadcrumb:model",(data)->
				API.updateBreadcrumbModel data
