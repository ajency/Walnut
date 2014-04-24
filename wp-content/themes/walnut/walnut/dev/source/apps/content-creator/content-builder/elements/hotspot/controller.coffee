define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/hotspot/views'],
		(App,Element)->

			App.module 'ContentCreator.ContentBuilder.Element.Hotspot', (Hotspot, App, Backbone, Marionette, $, _)->


				# menu controller
				class Hotspot.Controller extends Element.Controller

					# intializer
					initialize:(options)->

						@eventObj = options.eventObj

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

						# # on show disable all question elements in d element box
						# @listenTo view, "show",=>
						# 		@eventObj.vent.trigger "question:dropped"
		
						@layout.elementRegion.show view,
							loading:true

						# show hotspot properties for this hotspot
						App.execute "show:question:elements",
						 			model : @layout.model
								
					


					# remove the element model
					deleteElement:(model)->
							model.destroy()
							App.execute "close:question:elements"
							# # on delete enable all question elements in d element box
							# @eventObj.vent.trigger "question:removed"

