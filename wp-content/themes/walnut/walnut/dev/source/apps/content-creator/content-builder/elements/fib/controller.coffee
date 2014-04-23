define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/fib/views'],
		(App,Element)->

			App.module "ContentCreator.ContentBuilder.Element.Fib" ,(Fib, App, Backbone, Marionette,$, _)->

				class Fib.Controller extends Element.Controller

					initialize : (options)->
							@eventObj = options.eventObj

							# set defaults for the model
							_.defaults options.modelData,
								element : 'Fib'
								maxlength : '12'
								font : 'Arial'
								color : '#000000'
								bg_color : '#c5ebd2'
								bg_opacity : '0.42'
								font_size : '12'
								case_sensitive : false
								marks: 1
								style : 'blank'
								text : "India has "
								blanksArray : []

							super options

					renderElement : ->
							@blanksCollection = App.request "create:new:question:element:collection",@layout.model.get 'blanksArray'

							@layout.model.set 'blanksArray',@blanksCollection
							# get the view 
							view = @_getFibView @layout.model
					
							# listen to show event, and trigger show property box event
							# listen to show property box event and show the property by passing the current model
							@listenTo view, 'show show:this:fib:properties',=>
									App.execute "show:question:properties", 
											model : @layout.model
							# listen to close hotspot prop box evnt from view
							@listenTo view, "close:hotspot:element:properties",->
									App.execute "close:question:element:properties"

							# on show disable all question elements in d element box
							@listenTo view, "show",=>
									@eventObj.vent.trigger "question:dropped"

							# listen to create fib element  event from view
							@listenTo view, "create:new:fib:element", (blankId)=>	
									# default val for model
									blanksData = 
											id : blankId
											correct_answers : []
											marks : 1
											maxlength : 12
									# create a model
									blanksModel = App.request "create:new:question:element", blanksData
									# add model to collection
									@layout.model.get('blanksArray').add blanksModel

							# show the view
							@layout.elementRegion.show view

					_getFibView : (model)->		
							new Fib.Views.FibView
									model : model

					deleteElement:(model)->
							# empty the collection blanks array
							# and delete it
							model.set('blanksArray','')
							delete model.get 'blanksArray'
							model.destroy()
							App.execute "close:question:properties"
							App.execute "close:question:element:properties"
							# on delete enable all question elements in d element box
							@eventObj.vent.trigger "question:removed"
