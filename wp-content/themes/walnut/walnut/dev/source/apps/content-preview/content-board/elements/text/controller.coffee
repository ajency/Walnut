define ['app'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/elements/text/view'
		],(App,Element)->

			App.module 'ContentPreview.ContentBoard.Element.Text', (Text, App, Backbone, Marionette, $, _)->

				# menu controller
				class Text.Controller extends Element.Controller

					# intializer
					initialize:(options)->
						
						super(options)
						
					

					_getTextView:(model)->
						new Text.Views.TextView
										model : model

					# setup templates for the element
					renderElement:()=>
					
						view = @_getTextView @layout.model		

						@layout.elementRegion.show view