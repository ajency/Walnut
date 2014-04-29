define ['app'
		'controllers/region-controller'
		'apps/content-preview/side-panel/controller'
		],(App,RegionController)->

			App.module "ContentPreview.SidePanel",(SidePanel,App,Backbone,Marionette,$,_)->

				class SidePanel.Controller extends RegionController

					initialize:(options)->

						@view = @_showView()

						@show @view

					_showView:->
						new SidePanel.Views.SidePanelView



				App.commands.setHandler 'show:side:panel',(options)->
					new SidePanel.Controller options