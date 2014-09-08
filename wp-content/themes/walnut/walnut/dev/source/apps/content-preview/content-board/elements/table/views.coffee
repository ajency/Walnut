define ['app'
		'bootbox'
], (App,bootbox)->

	# Row views
	App.module 'ContentPreview.ContentBoard.Element.Table.Views', (Views, App, Backbone, Marionette, $, _)->

		# Menu item view
		class Views.TableView extends Marionette.ItemView

			className : 'imp-table'

			template : ''

			onShow :->
				@$el.html _.stripslashes @model.get 'content'
				
