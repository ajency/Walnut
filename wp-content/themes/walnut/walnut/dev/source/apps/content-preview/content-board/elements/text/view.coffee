define ['app'],(App)->

	# Row views
	App.module 'ContentPreview.ContentBoard.Element.Text.Views', (Views, App, Backbone, Marionette, $, _)->

		# Menu item view
		class Views.TextView extends Marionette.ItemView

			tagName : 'p'

			template : ''

			className: 'text'

			onShow:->
				
				@$el.append _.stripslashes @model.get 'content'


