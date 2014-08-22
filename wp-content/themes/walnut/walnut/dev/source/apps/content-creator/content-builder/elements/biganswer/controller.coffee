define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/biganswer/views'],
		(App,Element)->

			App.module "ContentCreator.ContentBuilder.Element.BigAnswer" ,(BigAnswer, App, Backbone, Marionette,$, _)->

				class BigAnswer.Controller extends Element.Controller

					initialize : (options)->
							@eventObj = options.eventObj

							# set defaults for the model
							_.defaults options.modelData,
								element : 'BigAnswer'
								maxlength : '50'
								font : 'Arial'
								color : '#000000'
								bg_color : '#c5ebd2'
								bg_opacity : '0.42'
								font_size : '12'
								case_sensitive : false
								marks: 2
								style : 'blank'
								complete : false

								# correct_answers : []

							super options

					renderElement : ->
							# get the view 
							view = @_getBigAnswerView @layout.model

							# listen to show event, and trigger show property box event
							# listen to show property box event and show the property by passing the current model
							@listenTo view, 'show show:this:biganswer:properties',=>
								App.execute "show:question:properties", 
											model : @layout.model

							# # on show disable all question elements in d element box
							# @listenTo view, "show",=>
							# 	@eventObj.vent.trigger "question:dropped"

							# show the view
							@layout.elementRegion.show view

					_getBigAnswerView : (model)->		
							new BigAnswer.Views.BigAnswerView
									model : model

					deleteElement:(model)->
							super model
							App.execute "close:question:properties"
							# # on delete enable all question elements in d element box
							# @eventObj.vent.trigger "question:removed"


