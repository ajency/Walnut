define ['app'],(App)->

	App.module "TeachersDashboardApp.View.TextbookModules",(TextbookModules, App)->		

		class ContentGroupsItemView extends Marionette.ItemView

			template: '<td class="v-align-middle"><a href="#"></a>{{name}}</td>
		               <td class="v-align-middle"><span class="muted">{{duration}} {{minshours}}</span></td>
		               <td>
			                <span class="muted status_label">{{&status_str}}</span>
			               	<button data-id="{{id}}" type="button" class="btn btn-white btn-small pull-right action start-training">
			               		{{&action_str}}
			               	</button>
			               	<button type="button" class="btn btn-white btn-small pull-right m-r-10 training-date" data-toggle="modal" data-target="#schedule">
			               		<i class="fa fa-calendar"></i> 
			               			{{training_date}}
			               	</button>
		               	</td>'

			tagName : 'tr'		

			events:
				'click .training-date' : 'scheduleTraining'

			onShow:->
				@$el.attr 'id', 'row-'+ @model.get 'id'

			serializeData:->

				data=super()
				
				training_date= @model.get 'training_date'

				if training_date is '' 
					data.training_date = 'Schedule' 

				else data.training_date = moment(training_date).format("Do MMM YYYY")

				status = @model.get 'status'

				if status is 'started'
					data.status_str = '<span class="label label-info">In Progress</span>'
					data.action_str = '<i class="fa fa-pause"></i> Resume'

				else if status is'completed'
					data.status_str = '<span class="label label-success">Completed</span>'
					data.action_str = '<i class="fa fa-repeat"></i> Replay'

				else
					data.status_str = '<span class="label label-important">Not Started</span>'
					data.action_str = '<i class="fa fa-play"></i> Start'

				data

			scheduleTraining:->
				console.log 'schedule training'


		class TextbookModules.ContentGroupsView extends Marionette.CompositeView
			
			template: '<div class="tiles white grid simple vertical blue">
							<div class="grid-title no-border">
								<h4 class="">Textbook <span class="semi-bold">{{showTextbookName}}</span></h4>
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

			events: 
				'click .start-training' : 'startTraining'


			startTraining:(e)=>

				dataID = $(e.target).attr 'data-id'
				
				@trigger "save:training:status", dataID

			onStatusChange:(model)->

				status= model.get 'status'

				id = model.get 'id'

				if status is 'started'
					@$el.find 'tr#row-'+id+ ' .start-training'
					.empty()
					.html '<i class="fa fa-pause"></i> Resume'

					@$el.find 'tr#row-'+id+ ' .status_label'
					.html '<span class="label label-info">In Progress</span>'
					
					@$el.find 'tr#row-'+id+ ' .training-date'
					.html '<i class="fa fa-calendar"></i> ' + moment().format("Do MMM YYYY")


			onShow:->
				$('.input-append.date').datepicker
					autoclose: true
					todayHighlight: true
		