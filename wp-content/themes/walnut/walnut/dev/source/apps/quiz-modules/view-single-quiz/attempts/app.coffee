define ['app'
		'controllers/region-controller'], (App, RegionController)->
	App.module "QuizModuleApp.AttemptsController", (AttemptsController, App)->
		class AttemptsController.Controller extends RegionController

			initialize : (opts)->

				{@model,@quizResponseSummaryCollection}= opts

				@view = view = @_getAttemptsView @model,@quizResponseSummaryCollection

				@show view

				@listenTo @view, 'view:summary', (summary_id)-> @region.trigger 'view:summary', summary_id

			_getAttemptsView :(quizModel,collection) ->

				new QuizAttemptsView
					model : quizModel
					collection: collection

		class AttemptsItemView extends Marionette.ItemView

			template : '<div class="col-md-4">
							<h5 class="semi-bold">{{taken_on}}</h5>
						</div>
						<div class="col-md-4">
							<h5 class="semi-bold">{{total_marks_scored}}</h5>
						</div>
						<div class="col-md-3">
							<h5 class="semi-bold">{{time_taken}}</h5>
						</div>
						<div class="col-md-1 p-b-5">
							<button data-id={{summary_id}} type="button" class="pull-right view-summary btn btn-info btn-small m-t-5">view &nbsp; <i></i></button>
							<div class="clearfix"></div>
						</div>'

			className : 'row b-t b-grey'

			mixinTemplateHelpers:(data)->
				data.taken_on       = moment(data.taken_on).format("Do MMM YYYY")
				data.time_taken     = $.timeMinSecs data.total_time_taken
				data

		class QuizAttemptsView extends Marionette.CompositeView

			#changed for _.platform() DEVICE
			
			template : '<div class="tiles white grid simple vertical blue">
							<div class="grid-title attempts-title no-border"> 
								<h4 class="grid-body-toggle pointer">List of <span class="semi-bold">Attempts</span></h4> 
								<div class="tools"> <a class="expand"></a> </div> 
							</div>
							<div class="none grid-body attempts-body no-border contentSelect" style="display:none">
								<div class="row">
									<div class="col-md-4">
										<label class="text-grey">Attempted On </label>
									</div>
									<div class="col-md-4">
										<label class="text-grey">Marks Scored (out of {{marks}}) </label>
									</div>
									<div class="col-md-3">
										<label class="text-grey">Time Taken (out of {{total_minutes}}m) </label>
									</div>
								</div>
								<div id="attempts_list">
								</div>
							</div>
						</div>'

			itemView : AttemptsItemView

			itemViewContainer: '#attempts_list'

			events: 
				'click .view-summary':(e)-> 
					$(e.target).find('i').addClass 'fa fa-spinner fa-spin'
					
					setTimeout =>
						@trigger 'view:summary', $(e.target).attr 'data-id'                        
					,200

			#changed for _.platform() DEVICE

			onShow:->
				$(".attempts-title").click ->
					$(".attempts-body").toggle 400
				


		# set handlers
		App.commands.setHandler "show:quiz:attempts:app", (opt = {})->
			new AttemptsController.Controller opt

