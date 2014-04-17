define ['app'
		'controllers/region-controller'
		], (App, RegionController, contentGroupTpl)->

	App.module "ContentGroupApp.ListingView", (ListingView, App)->

		class ListingView.GroupController extends RegionController

			initialize : ->

				breadcrumb_items = 'items':[
						{'label':'Dashboard','link':'javascript://'},
						{'label':'Content Management','link':'javascript:;'},
						{'label':'View All Content Groups','link':'javascript:;','active':'active'}
					]
						
				App.execute "update:breadcrumb:model", breadcrumb_items


				@view = view = @_getContentGroupsListingView()

				@show view, (loading:true)

			_getContentGroupsListingView : =>
				new ContentGroupsListingView


		class ContentGroupsListingView extends Marionette.ItemView

			template 	: '<div class="grid-title no-border">
							<div class="row">
								<div class="col-lg-12">
									<h4><span class="semi-bold">All</span> Groups</h4>
									<table class="table table-hover table-condensed table-fixed-layout table-bordered" id="dataContentTable">
										<thead>
											<td>Test</td>
										</thead>
										<tbody>
										</tbody>
								  	</table>
									
								</div>
							</div>
						</div>'

			className 	: 'tiles white grid simple vertical green'


			onShow :->
				console.log 'test listing view'

