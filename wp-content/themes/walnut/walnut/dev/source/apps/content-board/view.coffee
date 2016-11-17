define ['app'], (App)->
	App.module 'ContentPreview.ContentBoard.Views', (Views, App, Backbone, Marionette, $, _)->
		class Views.ContentBoardView extends Marionette.ItemView

			id: 'myCanvas'

			# className: 'animated fadeIn bb-bookblock bb-custom-wrapper'

			className: 'animated fadeIn'

			# template: ' <div class="bb-item"></div>
			# 			<div class="bb-item">
			# 				<h1 id="loading-content-board">Loading ... <span class="fa fa-spin fa-spinner"></span></h1>
			# 				<div class="vHidden" id="question-area"></div>
			# 				<div id="feedback-area">
			# 					<div id="correct" class="alert alert-success text-center answrMsg">
			# 						<h3 class="bold">{{correct_answer_msg}}</h3>
			# 						<h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4>
			# 					</div>

			# 					<div id="wrong" class="alert alert-error text-center answrMsg">
			# 						<h3 class="bold">{{incorrect_answer_msg}}</h3>
			# 						<h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4>
			# 					</div>

			# 					<div id="partially-correct" class="alert alert-info text-center answrMsg">
			# 						<h3 class="bold">{{partial_correct_answers_msg}}</h3>
			# 						<h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4>
			# 					</div>

			# 					<div id="skipped" class="alert alert-error text-center answrMsg">
			# 						<h3 class="bold">{{skipped_msg}}</h3>
			# 						<h4 class="semi-bold">You scored: <span class="bold">0/<span class="total-marks"></span></span></h4>
			# 					</div>
			# 				</div>
			# 			</div>
			# 			<div class="bb-item"></div>
			# 		</div>'

			template: ' 
						<h1 id="loading-content-board">Loading ... <span class="fa fa-spin fa-spinner"></span></h1>
						<div class="vHidden" id="question-area"></div>
						<div id="feedback-area">
							<div id="correct" class="alert alert-success text-center answrMsg">
								<h3 class="bold">{{correct_answer_msg}}</h3>
								<h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4>
							</div>

							<div id="wrong" class="alert alert-error text-center answrMsg">
								<h3 class="bold">{{incorrect_answer_msg}}</h3>
								<h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4>
							</div>

							<div id="partially-correct" class="alert alert-info text-center answrMsg">
								<h3 class="bold">{{partial_correct_answers_msg}}</h3>
								<h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4>
							</div>

							<div id="skipped" class="alert alert-error text-center answrMsg">
								<h3 class="bold">{{skipped_msg}}</h3>
								<h4 class="semi-bold">You scored: <span class="bold">0/<span class="total-marks"></span></span></h4>
							</div>
							<p class="commentMsg"><label class="fosz14">Comment : </label> {{comment}}</p>
						</div>'

			
			mixinTemplateHelpers:(data)->
				Marionette.getOption @, 'display_mode'
				console.log @
				data.correct_answer_msg              = 'You are correct!'
				data.incorrect_answer_msg            = 'Sorry, you did not answer correctly'
				data.partial_correct_answers_msg     = 'You are almost correct'

				quizModel = Marionette.getOption @, 'quizModel'

				if quizModel
					data.correct_answer_msg              = quizModel.getMessageContent 'correct_answer'
					data.incorrect_answer_msg            = quizModel.getMessageContent 'incorrect_answer'
					data.partial_correct_answers_msg     = quizModel.getMessageContent 'partial_correct_answers'
					data.skipped_msg                     = 'This question was skipped'
					data.comment						 = @.model.get('comment')

				data

			onRender: ->
				@$el.find('#feedback-area div').hide()
			
			onShowResponse : (marks,total)->

				marks = parseFloat marks
				total = parseFloat total

				

				quizModel = Marionette.getOption @, 'quizModel'

				if marks is 0 and _.toBool quizModel.get 'negMarksEnable'
					display_marks = - total*quizModel.get('negMarks')/100
				else
					display_marks = marks

				@$el.find('.total-marks').text total
				@$el.find('.marks').text display_marks
				@$el.find('#feedback-area div').hide()

				answerModel = Marionette.getOption(@, 'answerModel')

				if answerModel
					if (@.model.get('comment') != '')
						@$el.find('.commentMsg').show()

				if answerModel and answerModel.get('status') is 'skipped'
					@$el.find('#skipped').show()
					
				else

					if marks is 0
						@$el.find('#wrong').show()

					if marks is total
						@$el.find('#correct').show()

					if marks > 0 and marks < total
						@$el.find('#partially-correct').show()


			

