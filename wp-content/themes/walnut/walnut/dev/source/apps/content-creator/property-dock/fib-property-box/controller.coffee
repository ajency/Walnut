define ['app'
		'controllers/region-controller'
		'apps/content-creator/property-dock/fib-property-box/views']
		,(App,RegionController)->

			App.module "ContentCreator.PropertyDock.FibPropertyBox",
			(FibPropertyBox, App, Backbone, Marionette, $, _)->

				class FibPropertyBox.Controller extends RegionController

					initialize : (options)->

						@model = options.model
						
						# get property view
						@layout = @_getView @model

						# show view
						@show @layout

					# function to get the property view
					_getView:(model)->
						new FibPropertyBox.Views.PropertyView
								model : model

					# on close of property box save the model
					onClose:->
						App.execute 'save:fib:text'
						models= this.model.get('blanksArray').models

						elements= _.map models, (m)-> m.toJSON()

						@model.set 'blanksArray': elements

						if @model.get('marks') > 0
							
							@model.set 'complete',true

							@has_individual_marks= @model.get 'enableIndividualMarks'

							_.each @model.get('blanksArray'),(blanks)=>								

								if _.isEmpty(blanks.correct_answers) or _.isEmpty blanks.correct_answers[0]
									@model.set 'complete',false

								if @has_individual_marks and blanks.marks is 0
									@model.set 'complete',false
									
						else				
							@model.set 'complete',false

						@model.save()

						ElementCollection = App.request "create:new:question:element:collection", models
						@model.set 'blanksArray', ElementCollection
						#localStorage.setItem 'ele'+@model.get('meta_id'), JSON.stringify(@model.toJSON())

				App.commands.setHandler "show:fib:properties",(options)->
						new FibPropertyBox.Controller
								region : options.region
								model : options.model