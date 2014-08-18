define ['app'
		'apps/content-creator/content-builder/element/controller'
		'text!apps/content-creator/content-builder/elements/table/templates/table.html'
		'apps/content-creator/content-builder/elements/table/views'		
		# 'apps/builder/site-builder/elements/table/settings/controller'
],(App,Element,tableTemplate)->
	App.module 'ContentCreator.ContentBuilder.Element.Table', (Table, App, Backbone, Marionette, $, _)->

		# menu controller
		class Table.Controller extends Element.Controller


			initialize : (options)->
				_.defaults options.modelData,
					element: 'Table'
					content	: tableTemplate
					row : 3
					column : 3
					style : 'style-1'
					bordered : false
					striped : false

				super(options)

			bindEvents: ->
				# start listening to model events
				#@listenTo @layout.model, "change:content", @renderElement
				super()

			_getTableView: ->
				new Table.Views.TableView
					model: @layout.model
					# collection : @rowCollection

			# setup templates for the element
			renderElement: ()=>
				@removeSpinner()
				# @rowCollection = new Backbone.Collection

				# @rowCollection.set @layout.model.get('content')['data']

				# console.log @rowCollection
				@view = @_getTableView()

				# listen to "text:element:blur" event
				# this will pass the current html for the text element.
				# set it to the model. If it is a different markup it will
				# change the model changed property to true
				# save the new markup if the model is changed
				@listenTo @view, "save:table", (tableHolder) =>
					html = $(tableHolder).clone()
					$(html).find('.rc-handle-container').remove()
					$(html).find('td div, th div').removeAllAttr()
					@layout.model.set 'content', "#{$(html).html()}"
					@layout.model.save() if @layout.model.hasChanged()

				@listenTo @view, "show show:table:property", =>
					App.execute "show:question:properties",
						model : @layout.model
				
				@layout.elementRegion.show @view

			onClose:->
				App.execute "close:question:properties"



