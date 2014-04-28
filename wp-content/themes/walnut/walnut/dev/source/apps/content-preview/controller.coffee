define ['app'
		'controllers/region-controller'
		'apps/content-preview/view'
		],(App,RegionController)->

			App.module "ContentPreview",(ContentPreview, App, Backbone, Marionette, $,_)->

				class ContentPreview.Controller extends RegionController

					initialize:(options)->
						breadcrumb_items = 'items':[
							{'label':'Dashboard','link':'javascript://'},
							{'label':'Content Management','link':'javascript:;'},
							{'label':'Content Preview','link':'javascript:;','active':'active'}
						]
						App.execute "update:breadcrumb:model", breadcrumb_items
						
						# get the main layout for the content preview
						@layout = @_getContentPreviewLayout()

						# eventObj = App.createEventObject()

						# listen to "show" event of the layout and start the 
						# elementboxapp passing the region 
						@listenTo @layout,'show',=>
						

							App.execute "show:preview:question:",
										region : @layout.contentPreviewRegion
										
							App.execute "show:result",
										region : @layout.previewResultRegion
						# show the layout
						@show @layout

					_getContentPreviewLayout:->
						new ContentPreview.Views.Layout

				App.commands.setHandler "show:content:preview", (options)->
								new ContentPreview.Controller
											region : options.region
