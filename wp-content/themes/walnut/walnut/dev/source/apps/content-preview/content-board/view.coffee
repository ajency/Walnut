define ['app'],(App)->

	App.module 'ContentPreview.ContentBoard.Views',(Views,App,Backbone,Marionette,$,_)->

		class Views.ContentBoardView extends Marionette.ItemView

			template : '<div id="question-area"></div>
						<div id="feedback-area">
							<div id="correct" class="alert alert-success text-center answrMsg">
							    <h3 class="bold">You are right!</h3>
							    <h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4>
							</div>

							<div id="wrong" class="alert alert-error text-center answrMsg">
							    <h3 class="bold"> Sorry, you did not get this right.</h3>
							    <h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4>
							</div>

							<div id="partially-correct" class="alert alert-info text-center answrMsg">
							    <h3 class="bold">Well you are almost right.</h3>
							    <h4 class="semi-bold">You scored: <span class="bold"><span class="marks"></span>/<span class="total-marks"></span></span></h4>
							</div>
						</div>'

			onRender:->
				@$el.attr 'id','myCanvas'
				@$el.find('#feedback-area div').hide()


			onShowResponse:(marks,total)->
				console.log marks+total
				@$el.find('.total-marks').text total
				@$el.find('.marks').text marks
				if marks is 0
					@$el.find('#feedback-area div').hide()
					@$el.find('#wrong').show()

				if marks is total
					@$el.find('#feedback-area div').hide()
					@$el.find('#correct').show()

				if marks > 0 and marks < total
					@$el.find('#feedback-area div').hide()
					@$el.find('#partially-correct').show()

			

