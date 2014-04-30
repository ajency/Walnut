define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.FibElementPropertyBox.Views",
		(Views, App, Backbone, Marionette, $, _)->

			class Views.BlankElementView extends Marionette.ItemView

				template : '<div class="tile-more-content no-padding">
							  
							  <div class="tiles green">
							    
							    <div class="tile-footer drag">
							      FIB 
							      <i class="fa fa-chevron-right">
							      </i>
							      
							      <span class="semi-bold">
							        Blank
							      </span>
							      
							    </div>
							    <div class="docket-body">
							    	<div class="from-group">Max Characters
										<input id="answer-max-length" type="text"  value="{{maxlength}}">

											
									</div>

									<div class="">
										Answers
											<input id="correct-answers" value="{{correctanswersFn}}" type="text" data-role="tagsinput" placeholder="Type Answer and press Enter" />
									</div>

									<div class="m-b-10">
										Marks
										<input id="individual-marks" type="text" value="{{marks}}" class="form-control">
									</div>

								</div>
							  </div>
							</div>
							    	'
				ui :
					individualMarksTextbox : '#individual-marks'

				# view events 
				events : 
					'blur #answer-max-length' : '_changeMaxLength'
					'change input#correct-answers' : '_changeCorrectAnswers'
					'blur @ui.individualMarksTextbox' : '_changeIndividualMarks'

				mixinTemplateHelpers:(data)->
					data.correctanswersFn = ->
						@correct_answers.toString()
					data

				onShow:->

					@$el.find('input#correct-answers').tagsinput('refresh');
					# @$el.find('input#correct-answers').tagsinput('input').val @model.get('correct_answers')


				# function for changing the correct answer array						
				_changeCorrectAnswers:(evt)->
						@model.set 'correct_answers',$(evt.target).val().split(',')

				# function for changing model on change of maxlength textbox
				_changeMaxLength:(evt)-> 
					# check if the value is a number
					if  not isNaN $(evt.target).val()
							@model.set 'maxlength',parseInt $(evt.target).val()

				_changeIndividualMarks:(evt)->
					if not isNaN $(evt.target).val()
							@model.set 'marks', parseInt $(evt.target).val()