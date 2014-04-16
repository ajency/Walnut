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
											content 	: ''
											marks : 1

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
						# @removeSpinner()
						# get menu 
						view = @_getHotspotView()

						# @listenTo view, "show:media:manager", =>
						# 			App.navigate "media-manager", trigger : true
						# 			@listenTo App.vent,"media:manager:choosed:media",(media)=>
						# 				@layout.model.set 'image_id', media.get 'id'
						# 				console.log media.toJSON().url
						# 				@layout.model.save()
						# 				@stopListening App.vent,"media:manager:choosed:media"

						#on click of any hotspot canvas show hotspot properties for that hotspot
						@listenTo view, "show:hotspot:elements",=>
							
								App.execute "show:question:elements",
										model : @layout.model


						@listenTo view, "close:hotspot:elements", (contentObject)=>
								console.log JSON.stringify contentObject
								@layout.model.set 'content', JSON.stringify contentObject
								# console.log JSON.stringify @model.toJSON()
								if @layout.model.hasChanged()
										console.log "saving them"
										localStorage.setItem 'ele'+@layout.model.get('meta_id'), JSON.stringify(@layout.model.toJSON())
										console.log JSON.stringify @layout.model.toJSON()
								App.execute "close:question:elements"

						@listenTo view, "close:hotspot:element:properties",->
								App.execute "close:question:element:properties"
		
						@layout.elementRegion.show view,
							loading:true

						# show hotspot properties for this hotspot
						App.execute "show:question:elements",
						 			model : @layout.model
								
					


					# remove the element model
					deleteElement:(model)->
						
						if not @layout.elementRegion.currentView.$el.canBeDeleted()
							alert "Please remove elements inside row and then delete."							
						else
							
							model.destroy()
							App.execute "close:question:elements"
