define ['app'
		'text!apps/textbooks/templates/textbooks.html'
		'text!apps/textbooks/list/templates/list_item.html'],(App,textbooksTpl, listitemTpl)->

	App.module "TextbooksApp.List.Views",(Views, App)->

		class ListItemView extends Marionette.ItemView

			tagName : 'li'
			className: 'mix northeast camping climbing fishing swimming mix_all'
			template : listitemTpl


		class Views.ListView extends Marionette.CompositeView

			template : textbooksTpl

			className : 'page-content'

			itemView 	: ListItemView

			itemViewContainer : 'ul.textbooks_list'


			initialize: ->
				console.log 'textbooks'