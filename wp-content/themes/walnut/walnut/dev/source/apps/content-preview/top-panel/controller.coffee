define ['app'
		'controllers/region-controller'
		'apps/content-preview/top-panel/view'
		],(App,RegionController)->

			App.module "ContentPreview.TopPanel",(TopPanel,App,Backbone,Marionette,$,_)->

				class TopPanel.Controller extends RegionController

					initialize:(options)->

						@view = @_showView()

						@total = 0

						triggerOnce = _.once @triggerShowTotalMarks

						App.commands.setHandler "show:total:marks",(total)=>
							@total += parseInt total
							triggerOnce()

						@show @view

					triggerShowTotalMarks:=>
						_.delay =>
							@view.triggerMethod "show:total:marks", @total
						,500

					_showView:->
						new TopPanel.Views.TopPanelView



				App.commands.setHandler 'show:top:panel',(options)->
					new TopPanel.Controller options