define ['app'],(App)->

	App.module "ContentCreator.ContentBuilder.Element.Fib.Views",
	(Views, App, Backbone, Marionette,$, _)->

		class Views.FibView extends Marionette.ItemView

			template : '<input height="50" type="text" maxlength="{{maxlength}}" placeholder="Answer" style="
					    font-family: {{font}}; font-size: {{font_size}}px; color: {{color}}; 
					     width:100%; height: 100%; line-height : inherit; padding:15px 2px;">'

			onShow : ->

				@$el.parent().parent().on 'click',(evt)=>
					@trigger "show:this:fib:properties"
					console.log 'show'
					evt.stopPropagation()

				@$el.find('input').css 'background-color', @_convertHex @model.get('bg_color'),@model.get('bg_opacity')

			# listen to the model events 
			modelEvents : 
					'change:maxlength'  : '_changeMaxLength'
					'change:font' : '_changeFont'
					'change:font_size' : '_changeSize'
					'change:color' : '_changeColor'
					'change:bg_color' : '_changeBGColor'
					'change:bg_opacity' : '_changeBGColor'


			# on change of maxlength property
			_changeMaxLength:(model,maxlength)->
					@$el.find('input').prop 'maxLength',parseInt maxlength


			# on change of font property
			_changeFont:(model,font)->
					@$el.find('input').css 'font-family',font


			# on change of font_size property
			_changeSize:(model,size)->
					@$el.find('input').css 'font-size',size+"px"

			# on change of color property
			_changeColor:(model,color)->
					@$el.find('input').css 'color', color

			# on change of bg_color property
			_changeBGColor:(model,bgColor)->
					@$el.find('input').css 'background-color', @_convertHex model.get('bg_color'),model.get('bg_opacity')

			# convert hex and opacity to rgba format for css
			_convertHex:(hex,opacity)->
			    hex = hex.replace '#',''
			    r = parseInt hex.substring(0,2), 16
			    g = parseInt hex.substring(2,4), 16
			    b = parseInt hex.substring(4,6), 16

			    result = 'rgba('+r+','+g+','+b+','+opacity+')'
			    

