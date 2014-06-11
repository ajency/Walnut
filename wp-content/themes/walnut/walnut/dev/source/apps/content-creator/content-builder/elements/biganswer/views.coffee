define ['app'],(App)->

	App.module "ContentCreator.ContentBuilder.Element.BigAnswer.Views",
	(Views, App, Backbone, Marionette,$, _)->

		class Views.BigAnswerView extends Marionette.ItemView

			template : '<textarea  type="text" maxlength="{{maxlength}}"  style="
					    font-family: {{font}}; font-size: {{font_size}}px; color: {{color}}; 
					     max-width:100%; width :100%; height: 100%; line-height : inherit;">'

			onShow : ->

				# setting of on click handler for showing of the property box for BigAnswer element
				@$el.parent().parent().on 'click',(evt)=>
					@trigger "show:this:biganswer:properties"
					# stop propogation of click event
					evt.stopPropagation()
				

				# initialiaze the styles property on first show
				@_changeBGColor()
				@_changeBigAnswerStyle @model,@model.get 'style'

			# listen to the model events 
			modelEvents : 
					'change:maxlength'  : '_changeMaxLength'
					'change:font' : '_changeFont'
					'change:font_size' : '_changeSize'
					'change:color' : '_changeColor'
					'change:bg_color' : '_changeBGColor'
					'change:bg_opacity' : '_changeBGColor'
					'change:style' : '_changeBigAnswerStyle'


			# on change of maxlength property
			_changeMaxLength:(model,maxlength)->
					@$el.find('textarea').prop 'maxLength',parseInt maxlength


			# on change of font property
			_changeFont:(model,font)->
					@$el.find('textarea').css 'font-family',font


			# on change of font_size property
			_changeSize:(model,size)->
					@$el.find('textarea').css 'font-size',size+"px"

			# on change of color property
			_changeColor:(model,color)->
					@$el.find('textarea').css 'color', color

			# on change of bg_color property
			_changeBGColor:(model,bgColor)->
					@$el.find('textarea').css 'background-color', _.convertHex @model.get('bg_color'),@model.get('bg_opacity')

			# on change of style property
			_changeBigAnswerStyle:(model,style)->
					# if underline
					if style is 'uline'
						@$el.find('textarea').removeClass("border").addClass "underline"
					# if box
					else if style is 'box'
						@$el.find('textarea').removeClass("underline").addClass "border"
					# if blank
					else 
						 @$el.find('textarea').removeClass "underline border"

			
			    

