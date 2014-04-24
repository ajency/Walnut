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
							    	<div >Max Characters
										<input id="answer-max-length" type="type"  value="{{maxlength}}">											
									</div>

									<div class="form-group">
										<div class="bootstrap-tagsinput"> 
											<input id="correct-answers" value="{{correctanswersFn}}" type="text" data-role="tagsinput" placeholder="Type Answer and press Enter" />
										</div>
									</div>

								</div>
							  </div>
							</div>
							    	'

				# view events 
				events : 
					'blur #answer-max-length' : '_changeMaxLength'
					'change input#correct-answers' : '_changeCorrectAnswers'

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
							console.log @model
							@model.set 'maxlength',$(evt.target).val()
							console.log @model