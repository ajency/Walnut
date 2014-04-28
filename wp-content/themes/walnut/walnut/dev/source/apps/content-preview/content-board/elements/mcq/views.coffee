define ['app'],(App)->

	App.module "ContentPreview.ContentBoard.Element.Mcq.Views",
	(Views, App, Backbone, Marionette,$, _)->

		class Views.McqView extends Marionette.ItemView

			className : 'mcq'

			

			onShow:->
				@$el.attr 'id','mcq-container'

				@trigger "create:row:structure",
						container : @$el

				


		class Views.McqOptionView extends Marionette.ItemView

			className : 'mcq-option'

			tagName : 'div'

			template : '<input class="mcq-option-select" id="option-{{optionNo}}" type="checkbox"  value="no">
						
						<p class="mcq-option-text"></p>'

			
			events:
				
				'change input:checkbox' : '_onClickOfCheckbox'
							# @trigger "text:element:blur"



		
			onShow:->
				@$el.attr 'id', 'mcq-option-'+@model.get 'optionNo'
				@$el.find('p').append _.stripslashes @model.get 'text'

				

				# custom checkbox
				@$el.find('input:checkbox').screwDefaultButtons
					image: 'url("../wp-content/themes/walnut/images/csscheckbox.png")'
					width: 32
					height: 26

				# @$el.parent().on "class:changed",=>
				# 	@model.set 'class', @$el.parent().attr('data-class')
					# if e.originalEvent.attrName is 'data-class'
					# 	console.log @$el.parent().attr('data-class')

			

			_onClickOfCheckbox:(evt)->

					if $(evt.target).prop 'checked'
						console.log 'checked'
						@trigger 'option:checked' , @model
					else 
						console.log 'unchecked'
						@trigger 'option:unchecked' , @model


			# onClickCheckbox:()->

			# 	@$el.find('input:checkbox').attr 'checked',true
			# 	@$el.find('input:checkbox').parent().css('background-position','0px -26px')
					

