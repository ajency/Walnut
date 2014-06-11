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
							        Blank No : <span id="blankPropertiesNo"></span>
							      </span>
							      
							    </div>
							    <div class="docket-body">
					<!-- 			<div class="from-group">Set maximum characters allowed to enter
										<input id="answer-max-length" type="text"  value="{{maxlength}}">

											
									</div>   -->

									<div class="">
										Accepted answers
											<input id="correct-answers"   value="{{correctanswersFn}}" 
											type="text" data-role="tagsinput" placeholder="Type Answer and press Enter" />
									</div>

									<div class="form-group">
						        
										<div class="textProp slider success">
											Size 
											<input type="text" id="fib-blanksize" class="blankSize" 
											data-slider-max="50" data-slider-min="1" data-slider-step="1"
											data-slider-value="{{blank_size}}" data-slider-orientation="horizontal"
											 data-slider-selection="before">

										</div>

									</div>

									<div class="m-b-10">
										Marks
										<input id="individual-marks" type="text" value="{{marks}}" 
										class="form-control">
									</div>

								</div>
							  </div>
							</div>
							    	'
				ui :
					individualMarksTextbox : '#individual-marks'

				# view events 
				events : 
					# 'blur #answer-max-length' : '_changeMaxLength'
					'change input#correct-answers' : '_changeCorrectAnswers'
					'blur @ui.individualMarksTextbox' : '_changeIndividualMarks'

				mixinTemplateHelpers:(data)->
					data.correctanswersFn = ->
						@correct_answers.toString()
					data

				initialize:(options)->
					@fibModel = options.fibModel
					# @blankNo = options.blankNo

				onShow:->

					@$el.find('input#correct-answers').tagsinput('refresh');
					@$el.find('#blankPropertiesNo').text @model.get 'blank_index'
					console.log @model.get 'blank_index'

					# initialize font size to use slider plugin
					@$el.find('.blankSize').slider()
					# listen to slide event of slider
					# on slide change the model
					@$el.find('#fib-blanksize').slider().on 'slide',=>
							# on click of slider , value set to null
							# resolved with this
							size = @model.get 'blank_size'
							@model.set 'blank_size', @$el.find('.blankSize').slider('getValue').val()||size

					if not @fibModel.get 'enableIndividualMarks'
						@_disableMarks()

					@listenTo @fibModel , 'change:enableIndividualMarks',@_toggleMarks

				_toggleMarks:(model,enableIndividualMarks)->
					if enableIndividualMarks
						@_enableMarks()

					else 
						@_disableMarks()

				_disableMarks:->
					@ui.individualMarksTextbox.val 0
					@ui.individualMarksTextbox.prop 'disabled',true

				_enableMarks:->
					@ui.individualMarksTextbox.val @model.get 'marks'
					@ui.individualMarksTextbox.prop 'disabled',false

				# function for changing the correct answer array						
				_changeCorrectAnswers:(evt)->

						@model.set 'correct_answers', $(evt.target).val().split(',')


				# function for changing model on change of maxlength textbox
				# _changeMaxLength:(evt)-> 
				# 	# check if the value is a number
				# 	if  not isNaN $(evt.target).val()
				# 			@model.set 'maxlength',parseInt $(evt.target).val()

				_changeIndividualMarks:(evt)->
					if not isNaN $(evt.target).val()
							@model.set 'marks', parseInt $(evt.target).val()