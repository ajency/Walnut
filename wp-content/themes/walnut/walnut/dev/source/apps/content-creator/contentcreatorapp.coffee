define ['app'
		'controllers/region-controller'
		'apps/content-creator/element-box/elementboxapp'
		'apps/content-creator/content-builder/app'
		'apps/content-creator/property-dock/controller'],(App,RegionController)->

			
			App.module "ContentCreator", (ContentCreator,App,Backbone,Marionette,$,_)->	

				ContentCreator.closequestionelementproperty = true
				ContentCreator.closequestionelements = true
				ContentCreator.closequestioneproperty = true

				class ContentCreatorController extends RegionController

					initialize : (options)->
						breadcrumb_items = 'items':[
							{'label':'Dashboard','link':'javascript://'},
							{'label':'Content Management','link':'javascript:;'},
							{'label':'Content Creator','link':'javascript:;','active':'active'}
						]
							
						App.execute "update:breadcrumb:model", breadcrumb_items

						# get the main layout for the content creator
						@layout = @_getContentCreatorLayout()

						eventObj = App.createEventObject()

						# listen to "show" event of the layout and start the 
						# elementboxapp passing the region 
						@listenTo @layout,'show',=>
							App.execute "show:element:box", 
										region : @layout.elementBoxRegion
										eventObj : eventObj

							App.execute "show:content:builder",
										region : @layout.contentBuilderRegion
										eventObj : eventObj

							App.execute "show:property:dock",
										region : @layout.PropertyRegion
						# show the layout
						@show @layout

					_getContentCreatorLayout:->
						new ContentCreator.ContentCreatorLayout


				class ContentCreator.ContentCreatorLayout extends Marionette.Layout 

					className : ''

					template : '<div class="page-title"> 
									<h3>Add <span class="semi-bold">Question</span></h3>
								</div>
								<div class="creator">
									<div class="tiles" id="toolbox"></div>
									<div class="" id="content-builder"></div>
									<div class="dock tiles" id="property-dock"></div>
								</div>
								'

					regions : 
						elementBoxRegion : '#toolbox'
						contentBuilderRegion : '#content-builder' 
						PropertyRegion : '#property-dock'


				# create a command handler to start the content creator controller
				App.commands.setHandler "show:content:creator", (options)->
								new ContentCreatorController
											region : options.region



