define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.MediaPropertyBox.Views",
	(Views,App,Backbone,Marionette,$,_)->

		class Views.PropertyView extends Marionette.ItemView

			template : '<div class="tile-more-content no-padding">
								<div class="tiles blue">
									<div class="tile-footer drag">
										Media <i class="fa fa-chevron-right"></i> <span class="semi-bold">{{element}} Properties</span>
									</div>
									<div class="docket-body">
										<br>
										<div class="radio radio-success">
											Autoplay?
											<input id="autoplayTrue" type="radio" name="autoplay" value="true">
											<label for="autoplayTrue">Yes</label>
											<input id="autoplayFalse" type="radio" name="autoplay" value="false">
											<label for="autoplayFalse">No</label>
										</div>
										<br>
										<div class="media_times hidden">
											Start Time: <input name="startTime" value="{{startTime}}" type = "text" /><br>
											End Time: <input name="endTime" value="{{endTime}}" type = "text" />
										</div>
										<br>
									</div>
								</div>
							</div>'



			# view events
			events :
				'change input[name="autoplay"]':->
					@model.set 'autoplay': _.toBool @$el.find('input[name="autoplay"]:checked').val()

				'blur input[name="startTime"]':(e)->
					$(e.target).removeClass 'error'
					startTime = parseInt $(e.target).val()
					if _.isNaN startTime
						$(e.target).addClass 'error'
						@model.set 'startTime': 0
					else
						@model.set 'startTime': startTime if not _.isNaN startTime

				'blur input[name="endTime"]':(e)->
					$(e.target).removeClass 'error'
					endTime = parseInt $(e.target).val()
					if _.isNaN endTime
						$(e.target).addClass 'error'
						@model.set 'endTime': 0
					else
						@model.set 'endTime': endTime if not _.isNaN endTime

			onShow:->
				if @model.get('element') is 'Video'
					@$el.find '.media_times'
					.removeClass 'hidden'

				if _.toBool @model.get 'autoplay'
					@$el.find '#autoplayTrue'
					.attr 'checked', true
				else
					@$el.find '#autoplayFalse'
					.attr 'checked', true
				
				if @model.attributes.videoUrl==""
					@$el.find '#autoplayTrue'
					.attr 'checked', true

			# function for changing model on change of marks dropbox
			_changeMarks:(evt)->
				if not isNaN $(evt.target).val()
					@model.set 'marks', parseInt $(evt.target).val()


			_changeOptionNumber:(evt)->
					@model.set 'optioncount',parseInt $(evt.target).val()
