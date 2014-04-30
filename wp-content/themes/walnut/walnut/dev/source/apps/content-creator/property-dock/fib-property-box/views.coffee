define ['app'
		'text!apps/content-creator/property-dock/fib-property-box/templates/fibpropview.html'],
		(App,Template)->

			App.module "ContentCreator.PropertyDock.FibPropertyBox.Views",
			(Views,App,Backbone,Marionette,$,_)->

				class Views.PropertyView extends Marionette.ItemView

					template : Template

					ui : 
						marksTextbox : 'input#marks'

					# view events 
					events : 
						'change input#check-case-sensitive': '_checkCaseSensitive'
						'change select#fib-font' : '_changeFont'
						# 'change select#marks' : '_changeMarks'
						'change select#fib-style' : '_changeStyle'

				

					onShow:(options)->
							

							#initialize Case Sensitive Checkbox based on model
							if @model.get 'case_sensitive'
									@$el.find('#check-case-sensitive').prop 'checked',true

							# initialize the dropdown to use select2 plugin
							@$el.find('#fib-font').select2
									minimumResultsForSearch: -1
							# initialize font dropdown based on model
							@$el.find('#fib-font').select2 'val',@.model.get 'font'

							# initialize the dropdown to use select2 plugin
							# @$el.find('#marks').select2
							# 		minimumResultsForSearch: -1
							# initialize font dropdown based on model
							@$el.find('#marks').select2 'val',@model.get 'marks'

							# initialize the dropdown to use select2 plugin
							@$el.find('#fib-style').select2
									minimumResultsForSearch: -1
							# initialize font dropdown based on model
							@$el.find('#fib-style').select2 'val',@model.get 'style'
						
							# initialize font size to use slider plugin
							@$el.find('.fontSize').slider()
							# listen to slide event of slider
							# on slide change the model
							@$el.find('#fib-fontsize').slider().on 'slide',=>
									# on click of slider , value set to null
									# resolved with this
									size = @model.get 'font_size'
									@model.set 'font_size', @$el.find('.fontSize').slider('getValue').val()||size

							# initialize colorpicker for font color and set the on change event
							@$el.find('#font-color.color-picker').minicolors
									animationSpeed: 200
									animationEasing: 'swing'
									control: 'hue'
									position: 'top left'
									showSpeed: 200

									change :(hex,opacity)=>
											@model.set 'color', hex

							# initialize colorpicker for background color and set the on change event
							@$el.find('#bg-color.color-picker').minicolors
									animationSpeed: 200
									animationEasing: 'swing'
									control: 'hue'
									position: 'top right'
									showSpeed: 200
									opacity :true
									change :(hex,opacity)=>
											@model.set 'bg_color', hex
											@model.set 'bg_opacity', opacity



							@$el.closest('#property-dock').on 'blur', 
								'#question-elements-property #individual-marks',(evt)=>
									@_updateMarks()

							@listenTo @model.get('blanksArray') , 'add',@_updateMarks
							@listenTo @model.get('blanksArray') , 'remove',@_updateMarks
					

					_updateMarks:=>
							console.log 'change'
							
							totalMarks = 0
							@model.get('blanksArray').each (option)=>
								# console.log option
								totalMarks = totalMarks + parseInt option.get('marks')
							@model.set 'marks',totalMarks
							@ui.marksTextbox.val totalMarks

					
							
					# function for changing model on change of 
					# case sensitive checkbox
					_checkCaseSensitive:(evt)->
							if $(evt.target).prop 'checked'
								@model.set 'case_sensitive', true
								
							else
								@model.set 'case_sensitive',false


					# function for changing model on change of font dropbox
					_changeFont:(evt)-> 
							@model.set 'font', $(evt.target).val()

					# function for changing model on change of marks dropbox
					# _changeMarks:(evt)->
					# 		@model.set 'marks', $(evt.target).val()


					_changeStyle:(evt)->
							@model.set 'style',$(evt.target).val()

					onClose:->
						@$el.closest('#property-dock').off 'blur', 
								'#question-elements-property #individual-marks'
									
