define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements/row/views'
		'apps/content-creator/content-builder/elements/row/settings/controller'],
		(App,Element)->

			App.module 'ContentCreator.ContentBuilder.Element.Row', (Row, App, Backbone, Marionette, $, _)->

				# menu controller
				class Row.Controller extends Element.Controller

					# intializer
					initialize:(options)->
						console.log options

						_.defaults options.modelData,
											element  	: 'Row'
											columncount : 2
											elements 	: []
											meta_id 	: 0

						super(options)
						
					bindEvents:->
						# start listening to model events
						@listenTo @layout.model, "change:style", @changeStyle
						@listenTo @layout.model, "change:columncount", @columnCountChanged
						super()

					_getRowView:()->
						new Row.Views.RowView
										model : @layout.model

					columnCountChanged:(model)->
						@layout.elementRegion.currentView.triggerMethod "column:count:changed", model.get 'columncount'

					changeStyle:(model)->
						prevStyle = model.previous('style') ? ''
						newStyle  = model.get('style')
						@layout.elementRegion.currentView.triggerMethod "style:changed", _.slugify(newStyle), _.slugify(prevStyle)	
						@layout.setHiddenField 'style', newStyle
								
					# setup templates for the element
					renderElement:()=>
						@removeSpinner()
						# get menu 
						view = @_getRowView()
						@layout.elementRegion.show view
						@changeStyle @layout.model

					# remove the element model
					deleteElement:(model)->
						if not @layout.elementRegion.currentView.$el.canBeDeleted()
							alert "Please remove elements inside row and then delete."							
						else
							model.destroy()
