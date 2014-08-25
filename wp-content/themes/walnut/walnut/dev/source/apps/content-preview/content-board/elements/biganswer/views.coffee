define ['app'],(App)->

	App.module "ContentPreview.ContentBoard.Element.BigAnswer.Views",
	(Views, App, Backbone, Marionette,$, _)->

		class Views.BigAnswerView extends Marionette.ItemView

			template : '<textarea class="autogrow" type="text" maxlength="{{maxlength}}" contenteditable="false" style="
						font-family: {{font}}; font-size: {{font_size}}px; color: {{color}}; 
						 max-width:100%; width :100%; height: 100%; line-height : inherit;" ></textarea>'

			onShow : ->
				# initialiaze the styles property on first show
				@_setBGColor()
				@_autoPopulateAnswers()
				@_setBigAnswerStyle @model.get 'style'



			_autoPopulateAnswers:->
				answerModel=Marionette.getOption @, 'answerModel'
				if answerModel and answerModel.get('status') isnt 'not_attempted'
					@$el.find('textarea').val answerModel.get 'answer'
					
			# on change of bg_color property
			_setBGColor:->
					@$el.find('textarea').css 'background-color', _.convertHex @model.get('bg_color'),@model.get('bg_opacity')

			# on change of style property
			_setBigAnswerStyle:(style)->
					# if underline
					if style is 'uline'
						@$el.find('textarea').removeClass("border").addClass "underline"
					# if box
					else if style is 'box'
						@$el.find('textarea').removeClass("underline").addClass "border"
					# if blank
					else 
						@$el.find('textarea').removeClass "underline border"

					@$el.find('textarea').css 'height' : @$el.find('textarea').prop('scrollHeight') + "px";

			
					console.log 'test'

