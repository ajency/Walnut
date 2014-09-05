define ['app'], (App)->
    App.module 'ContentPreview.ContentBoard.Views', (Views, App, Backbone, Marionette, $, _)->
        class Views.ContentBoardView extends Marionette.ItemView

            id: 'myCanvas'

            template: ' <h1 id="loading-content-board">Loading ... <span class="fa fa-spin fa-spinner"></span></h1>
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
						</div>'

            mixinTemplateHelpers:(data)->
                data.correct_answer_msg              = 'You are correct!'
                data.incorrect_answer_msg            = 'Sorry, you did not answer correctly'
                data.partial_correct_answers_msg     = 'You are almost correct'

                quizModel = Marionette.getOption @, 'quizModel'

                if quizModel
                    data.correct_answer_msg              = quizModel.getMessageContent 'correct_answer'
                    data.incorrect_answer_msg            = quizModel.getMessageContent 'incorrect_answer'
                    data.partial_correct_answers_msg     = quizModel.getMessageContent 'partial_correct_answers'

                data

            onRender: ->
                @$el.find('#feedback-area div').hide()

            onShowResponse : (marks,total)->
                @$el.find('.total-marks').text total
                @$el.find('.marks').text marks
                @$el.find('#feedback-area div').hide()

                if marks is 0
                    @$el.find('#wrong').show()

                if marks is total
                    @$el.find('#correct').show()

                if marks > 0 and marks < total
                    @$el.find('#partially-correct').show()


			

