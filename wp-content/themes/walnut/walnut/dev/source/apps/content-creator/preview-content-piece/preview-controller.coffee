define ['app'
		'controllers/region-controller'
		], (App, RegionController)->

	App.module "ContentCreator.View", (View, App)->

		class View.PreviewController extends RegionController

			initialize :->

				breadcrumb_items = 'items':[
						{'label':'Dashboard','link':'javascript://'}
					]

				App.execute "update:breadcrumb:model", breadcrumb_items

				@view = view = @_getPreviewView()

				@show view, (loading: true)
				

			_getPreviewView :(divisions) ->
				new ContentPieceView



		class ContentPieceView extends Marionette.ItemView

			template 	: 	'<div class="tiles grey text-grey p-t-10 p-l-15 p-r-10 p-b-10 b-grey b-b"> 
								<p class="bold small-text">Question Info: </p> 
								<p class="">Maths Chapter 2 Qt</p> 
							</div>
							<div class="teacherCanvas "> 
								<div class="grid-body p-t-20 p-b-15 no-border"></div> 
							</div>'