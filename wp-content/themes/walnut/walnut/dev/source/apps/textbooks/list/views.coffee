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

			serializeData : ->

				data = super()
				data.classes = []
				num = 0
				num = while num < 15
					data.classes.push 'Class '+num
					num++

				data

			events: 
				'click .btn-group'	: 'dropdown_popup'

			initialize: ->
				console.log 'textbooks'

			dropdown_popup : (e)->
				if $(e.target)
					.closest 'div'
					.hasClass 'open'
						$(e.target).closest 'div' 
						.removeClass 'open'
				else
					$(e.target).closest 'div' 
					.addClass 'open'