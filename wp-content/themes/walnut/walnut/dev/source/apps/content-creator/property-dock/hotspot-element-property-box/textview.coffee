define ['app'
		'text!apps/content-creator/property-dock/hotspot-element-property-box/templates/textview.html'],
		(App,Template)->

			App.module "ContentCreator.PropertyDock.HotspotElementPropertyBox.Views",
				(Views, App, Backbone, Marionette, $, _)->

					class Views.TextView extends Marionette.ItemView

						template : Template

						events:
							# on change of font family
							'change #hotspot-textelement-fontfamily' : (e)->@model.set 'fontFamily', $(e.target).val()
							# on change of text
							'input #hotspot-textelement-text' : (e)->@model.set "text", $(e.target).val()
							'click #delete.text-danger'	: ->@model.set 'toDelete', true

						mixinTemplateHelpers:(data)->
							data.getText = ->
								 console.log  _.stripslashes @text
								 _.stripslashes @text
							data

						onShow:->
							self = @	
						
							#FONT SIZE
							# initialize font size slider
							@$el.find('.fontSize').slider()

							# on change of font size do
							@$el.find('#hotspot-textelement-fontsize').slider().on 'slide',=>
								size = @model.get 'fontSize'
								@model.set 'fontSize', @$el.find('.fontSize').slider('getValue').val()||size


							# TEXT ROTATION
							# initialize the knob
							@$el.find('.dial').val self.model.get 'textAngle'
							@$el.find(".dial").knob
									change :(val)->
										self.model.set "textAngle",val
										


								

							# FONT COLOR
							# initialize colorpicker and set the on change event
							@$el.find('.fontColor').minicolors
									animationSpeed: 200
									animationEasing: 'swing'
									control: 'hue'
									position: 'top left'
									showSpeed: 200

									change :(hex,opacity)->
										self.model.set 'fontColor', hex

							# set the vale of color picker according to the current model
							@$el.find('.fontColor').minicolors 'value', self.model.get 'fontColor'


							# FONT FAMILY
							# initialize font family accorging to the model
							@$el.find('#hotspot-textelement-fontfamily').select2
									minimumResultsForSearch: -1

							@$el.find('#hotspot-textelement-fontfamily').select2 'val',self.model.get 'fontFamily'

							
							# BOLD and ITALICS
							if @model.get('fontBold') is 'bold'
								@$el.find('#font-style #bold-checkbox').prop 'checked',true
							if @model.get('fontItalics') is 'italic'
								@$el.find('#font-style #italic-checkbox').prop 'checked',true

							@$el.find('#font-style .btn').on 'click',=>
								_.delay =>
									console.log "timeout"
									if @$el.find('#font-style #bold-checkbox').prop 'checked'
									 	self.model.set 'fontBold', "bold"
									else
										self.model.set 'fontBold', ""
									if @$el.find('#font-style #italic-checkbox').prop 'checked'
										self.model.set 'fontItalics', "italic"
									else
										self.model.set 'fontItalics', ""
								,200
								
								

