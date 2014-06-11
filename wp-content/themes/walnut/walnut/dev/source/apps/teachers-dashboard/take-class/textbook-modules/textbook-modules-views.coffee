define ['app'], (App)->
    App.module "TeachersDashboardApp.View.TakeClassTextbookModules", (TextbookModules, App)->
        class ContentGroupsItemView extends Marionette.ItemView

            # duration variable can be in hours/minutes (eg. 1 hr or 25 mins) and cannot be used in sorting.
            # hence total_minutes is used. it is the duration in minutes.
            # kept hidden coz the display doesnt need it. only tablesorter does

            template: '<td class="v-align-middle"><a href="#"></a>{{name}}</td>
            		               <td class="v-align-middle"><span style="display: none;">{{total_minutes}}</span> <span class="muted">{{duration}} {{minshours}}</span></td>
            		               <td>
            			                <span class="muted status_label">{{&status_str}}</span>

            			               	<button data-id="{{id}}" type="button" class="btn btn-success btn-small pull-right action start-training">
            			               		{{&action_str}}
            			               	</button>
            			               	{{&training_date}}
            		               	</td>'

            tagName: 'tr'


            onShow: ->
                @$el.attr 'id', 'row-' + @model.get 'id'
                @$el.attr 'data-id', @model.get 'id'

            serializeData: ->
                data = super()

                training_date = @model.get 'training_date'

                if training_date is ''
                    training_date = 'Schedule'

                else training_date = moment(training_date).format("Do MMM YYYY")

                status = @model.get 'status'

                if status is 'started' or status is 'resumed'
                    data.training_date = '<div class="alert alert-success inline pull-right m-b-0 m-r-10 dateInfo"> ' + training_date + '</div>'
                    data.status_str = '<span class="label label-info">In Progress</span>'
                    data.action_str = '<i class="fa fa-pause"></i> Resume'

                else if status is 'completed'
                    data.training_date = '<div class="alert alert-success inline pull-right m-b-0 m-r-10 dateInfo"> ' + training_date + '</div>'
                    data.status_str = '<span class="label label-success">Completed</span>'
                    data.action_str = '<i class="fa fa-repeat"></i> Replay'

                else
                    data.status_str = '<span class="label label-important">Not Started</span>'
                    data.action_str = '<i class="fa fa-play"></i> Start'
                    data.training_date = '<button type="button" data-target="#schedule" data-toggle="modal" class="btn btn-white btn-small pull-right m-r-10 training-date">
                    			               		<i class="fa fa-calendar"></i> ' + training_date + '</button>'
                data


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
            										<h4>{{&showModulesHeading}}</h4>
            										<table class="table table-hover table-condensed table-fixed-layout table-bordered" id="take-class-modules">
            							                <thead>
            							                  <tr>
            							                    <th style="width:50%">Name</th>
            							                    <th class="{sorter:\'minutesSort\'}" style="width:10%" >Duration</th>
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

            itemViewContainer: 'tbody'

            className: 'teacher-app moduleList'

            events:
                'click .start-training': 'startTraining'
                'click .training-date': 'scheduleTraining'


            startTraining: (e)=>
                dataID = $(e.currentTarget).attr 'data-id'
                currentRoute = App.getCurrentRoute()
                App.navigate currentRoute + "/module/" + dataID, true

            onScheduledModule: (id,date)->
                @$el.find 'tr#row-' + id + ' .training-date'
                .html '<i class="fa fa-calendar"></i> ' + moment(date).format("Do MMM YYYY")

            scheduleTraining: (e)->
                dataID = $ e.target
                .closest 'tr'
                .attr 'data-id'

                @trigger "schedule:training", dataID

            onShow: =>
                @$el.find '#take-class-modules'
                .tablesorter()

                pagerDiv = '<div id="pager" class="pager">
                							<i class="fa fa-chevron-left prev"></i>
                							<span style="padding:0 15px"  class="pagedisplay"></span>
                							<i class="fa fa-chevron-right next"></i>
                							<select class="pagesize">
                								  <option value="25" selected>25</option>
                								  <option value="50">50</option>
                                	<option value="100">100</option>
                              </select>
                						</div>'
                @$el.find('#take-class-modules').after(pagerDiv)
                pagerOptions =
                    totalRows: _.size(@collection.modules)
                    container: $(".pager"),
                    output: '{startRow} to {endRow} of {totalRows}'

                $('#take-class-modules').tablesorterPager pagerOptions

                # Cordova app navigation
                _.appNavigation() if _.platform() is 'DEVICE'


		