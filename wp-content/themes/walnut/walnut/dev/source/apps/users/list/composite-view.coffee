 define ['app',
		'apps/users/list/item-view'], (App)->
		
		App.module "UsersApp.List.Views", (Views)->
		
			class Views.UsersListView extends Marionette.CompositeView

				template: '<div class="tiles white grid simple animated fadeIn">
							<div class="grid-title">
								<h3 class="m-t-5 m-b-5">List of  <span class="semi-bold">Parents</span></h3>
							</div>
							<div class="grid-body contentSelect" style="overflow: hidden; display: block;">
								
								<div class="row">
									<div class="col-lg-12">
										<a class="btn btn-small pull-right btn-info" href="#add-parent">Add Parent</a>
									</div>
								</div>
								
								<div class="row m-t-15">
									<div class="col-lg-12">
										<table class="tablesorter table table-condensed table-fixed-layout table-bordered" id="users-list">
											<thead>
											<tr>
												<th>Name</th>
												<th>Email</th>
												<th></th>
											</tr>
											</thead>
											<tbody>
											</tbody>
										</table>
										<div id="pager" class="pager">
											<i class="cursor fa fa-chevron-left prev"></i>
											<span style="padding:0 15px"  class="pagedisplay"></span>
											<i class="cursor fa fa-chevron-right next"></i>
											<select class="pagesize">
												<option selected value="25">25</option>
												<option value="50">50</option>
												<option value="100">100</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>'

				itemView: Views.UsersItemView

				itemViewContainer: 'table tbody'
				
				itemViewOptions:->
					editedID: Marionette.getOption @, 'editedID'

				className: 'row'

				onShow:->	
					@$el.find "table#users-list"
					.tablesorter()
					
					pagerOptions =
						container : @$el.find ".pager"
						output : '{startRow} to {endRow} of {totalRows}'

					@$el.find "table#users-list"
					.tablesorterPager pagerOptions