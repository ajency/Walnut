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
											
											elements 	: []
											meta_id 	: 1

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
						@layout.elementRegion.show view

						console.log @layout.model
						App.execute "show:question:elements",
						 			model : @layout.model
								
						

					# remove the element model
					deleteElement:(model)->
						if not @layout.elementRegion.currentView.$el.canBeDeleted()
							alert "Please remove elements inside row and then delete."							
						else
							model.destroy()
