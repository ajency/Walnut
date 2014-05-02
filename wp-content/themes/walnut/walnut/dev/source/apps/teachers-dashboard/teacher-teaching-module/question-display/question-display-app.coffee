define ['app'
		'controllers/region-controller', 'video'], (App, RegionController)->

	App.module "SingleQuestionDisplayApp", (SingleQuestion, App)->

		class SingleQuestion.SingleQuestionController extends RegionController

			initialize : (opts)->
				{model} = opts

				@view= view = @_showQuestionView model

				@show view, (loading:true)
			

			_showQuestionView :(model) ->
				new QuestionDisplayView 
					model: model

		class QuestionDisplayView extends Marionette.ItemView

			template: '<div class="teacherCanvas ">
						<div class="grid-body p-t-20 p-b-15 no-border"></div>
					</div>

					<div class="tiles grey text-grey p-t-10 p-l-15 p-r-10 p-b-10 b-grey b-b">
				    	<p class="bold small-text">Question Info: </p>
				    	<p class="">{{post_title}}</p>
				    </div>'
			

		# set handlers
		App.commands.setHandler "show:single:question:app", (opt = {})->
			new SingleQuestion.SingleQuestionController opt

