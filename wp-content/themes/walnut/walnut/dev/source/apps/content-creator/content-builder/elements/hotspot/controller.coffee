define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/hotspot/views'],
		(App,Element)->

			App.module 'ContentCreator.ContentBuilder.Element.Hotspot', (Hotspot, App, Backbone, Marionette, $, _)->

				# menu controller
				class Hotspot.Controller extends Element.Controller

					# intializer
					initialize:(options)->


						_.defaults options.modelData,
											element  	: 'Hotspot'
											image_id	: 0
											elements 	: []
											meta_id 	: 1
											size 		: 'thumbnail'
											align 		: 'left'

						super(options)
						
					# bindEvents:->
					# 	# start listening to model events
					# 	@listenTo @layout.model, "change:style", @changeStyle
					# 	@listenTo @layout.model, "change:columncount", @columnCountChanged
					# 	super()

					_getHotspotView:()->
						new Hotspot.Views.HotspotView
										model : @layout.model

								
					# setup templates for the element
					renderElement:()=>
						@removeSpinner()
						# get menu 
						view = @_getHotspotView()

						@listenTo view, "show:media:manager", =>
									App.navigate "media-manager", trigger : true
									@listenTo App.vent,"media:manager:choosed:media",(media)=>
										@layout.model.set 'image_id', media.get 'id'
										@layout.model.save()
										@stopListening App.vent,"media:manager:choosed:media"


						
						@layout.elementRegion.show view

						# console.log @layout.model
						App.execute "show:question:elements",
						 			model : @layout.model
								
						

					# remove the element model
					deleteElement:(model)->
						
						if not @layout.elementRegion.currentView.$el.canBeDeleted()
							alert "Please remove elements inside row and then delete."							
						else
							model.destroy()
