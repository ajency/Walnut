define ['app'
		'controllers/region-controller'
		'apps/content-creator/element-box/elementboxapp'
		'apps/content-creator/content-builder/app'],(App,RegionController)->

			
			App.module "ContentCreator", (ContentCreator,App)->	

				class ContentCreatorController extends RegionController

					initialize : (options)->

						# get the main layout for the content creator
						@layout = @_getContentCreatorLayout()

						# listen to "show" event of the layout and start the 
						# elementboxapp passing the region 
						@listenTo @layout,'show',=>
							App.execute "show:element:box", 
										region : @layout.elementBoxRegion

							App.execute "show:content:builder",
										region : @layout.contentBuilderRegion
						# show the layout
						@show @layout

					_getContentCreatorLayout:->
						new ContentCreator.ContentCreatorLayout


				class ContentCreator.ContentCreatorLayout extends Marionette.Layout 

					className : 'content'

					template : '<div class="page-title"> 
									<h3>Add <span class="semi-bold">Question</span></h3>
								</div>
								<div class="creator">
									<div class="tiles" id="toolbox"></div>
									<div class="" id="content-builder"></div>
									<div class="dock tiles">
										<div class="tiles green">
											<div class="tiles-head">
												<h4 class="text-white"><span class="semi-bold">Properties </span>Dock</h4>
											</div>
										</div>
										<div id="questionProperties" class="docket"></div>
										<div id="hotspotProperties" class="docket"></div>
									</div>
								</div>
								'

					regions : 
						elementBoxRegion : '#toolbox'
						contentBuilderRegion : '#content-builder' 
						questionPropertiesRegion : '#questionProperties'
						hotspotPropertiesRegion : '#hotspotProperties'


				# create a command handler to start the content creator controller
				App.commands.setHandler "show:content:creator", (options)->
								new ContentCreatorController
											region : options.region



