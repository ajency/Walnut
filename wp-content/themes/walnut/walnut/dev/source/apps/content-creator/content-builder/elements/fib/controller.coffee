define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/fib/views'],
		(App,Element)->

			App.module "ContentCreator.ContentBuilder.Element.Fib" ,(Fib, App, Backbone, Marionette,$, _)->

				class Fib.Controller extends Element.Controller

					initialize : (options)->
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
								correct_answers : []

							super options

					renderElement : ->
							# get the view 
							view = @_getFibView @layout.model

							# listen to show event, and trigger show property box event
							# listen to show property box event and show the property by passing the current model
							@listenTo view, 'show show:this:fib:properties',=>
								App.execute "show:question:properties", 
											model : @layout.model

							# show the view
							@layout.elementRegion.show view

					_getFibView : (model)->		
							new Fib.Views.FibView
									model : model

					deleteElement:(model)->
							model.destroy()
							App.execute "close:question:properties"
