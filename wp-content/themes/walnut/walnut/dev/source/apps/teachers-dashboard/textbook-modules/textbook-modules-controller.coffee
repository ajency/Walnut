define ['app'
		'controllers/region-controller'
		], (App, RegionController)->

	App.module "TeachersDashboardApp.View", (View, App)->

		#List of textbooks available to a teacher for training or to take a class

		class View.textbookModulesController extends RegionController
			initialize : (opts) ->

				{textbookID} = opts

				contentGroupsCollection = App.request "get:content:groups", ('textbook' :textbookID)

				breadcrumb_items = 'items':[
						{'label':'Dashboard','link':'#teachers/dashboard'},
						{'label':'Take Class','link':'javascript:;'},
						{'label':'Textbook','link':'javascript:;','active':'active'}
					]
						
				App.execute "update:breadcrumb:model", breadcrumb_items


				@view = view = @_getContentGroupsListingView contentGroupsCollection

				@show view, (loading:true)

			_getContentGroupsListingView : (collection)=>
				new ContentGroupsView
					collection: collection


		class ContentGroupsItemView extends Marionette.ItemView

			template: '<td class="v-align-middle"><a href="#"></a>{{name}}</td>
		               <td class="v-align-middle"><span class="muted">{{duration}} {{minshours}}</span></td>
		               <td><span class="muted">
		               	<span class="label label-success">Completed</span></span> 
		               		<div class="alert alert-success inline pull-right m-b-0 dateInfo"> 
		               			Taught to classes: 
		               				<span class="bold">-</span>
		               				</div>
		               				</td>'

			tagName : 'tr'


			onShow :->
				console.log 'test listing view'



		class ContentGroupsView extends Marionette.CompositeView
			
			template: '<div class="tiles white grid simple vertical blue">
						<div class="grid-title no-border">
							<h4 class="">Textbook <span class="semi-bold">Abc</span></h4>
							<div class="tools">
								<a href="javascript:;" class="collapse"></a>
							</div>
						</div>
						<div class="grid-body no-border contentSelect" style="overflow: hidden; display: block;">
							<div class="row">
								<div class="col-lg-12">
									<h4><span class="semi-bold">All</span> Modules</h4>
									<table class="table table-hover table-condensed table-fixed-layout table-bordered" id="modules">
						                <thead>
						                  <tr>
						                    <th style="width:50%">Name</th>
						                    <th style="width:10%" >Duration</th>
						                    <th style="width:40%">Status</th>
						                  </tr>
						                </thead>
						                <tbody>
						                </tbody>
						            </table>
						        </div>
						    </div>
						</div>
					</div>'

			itemView: ContentGroupsItemView

			itemViewContainer : 'tbody'

			className : 'teacher-app moduleList'
				


