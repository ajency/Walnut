define ['app'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/elements/row/views'
		],
		(App,Element)->

			App.module 'ContentPreview.ContentBoard.Element.Row', (Row, App, Backbone, Marionette, $, _)->

				# menu controller
				class Row.Controller extends Element.Controller

					# intializer
					initialize:(options)->
						

						super(options)
						
					
					_getRowView:()->

						new Row.Views.RowView
										model : @layout.model

					

					# setup templates for the element
					renderElement:()=>
			
						# get menu 
						view = @_getRowView()
						@layout.elementRegion.show view
						# @changeStyle @layout.model

