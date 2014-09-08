define ['app'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/elements/table/views'
],(App,Element)->
	App.module 'ContentPreview.ContentBoard.Element.Table', (Table, App)->

		class Table.Controller extends Element.Controller


			initialize : (options)->

				super(options)

		
			_getTableView: ->
				new Table.Views.TableView
					model: @layout.model

			# setup templates for the element
			renderElement: ()=>
				
				@view = @_getTableView()
				
				@layout.elementRegion.show @view



