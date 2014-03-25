define ['app'
		'text!apps/textbooks/templates/textbooks.html'
		'text!apps/textbooks/list/templates/list_item.html'
		'text!apps/textbooks/templates/no_textbooks.html'
		],(App,textbooksTpl, listitemTpl,notextbooksTpl)->

	App.module "TextbooksApp.List.Views",(Views, App)->

		class ListItemView extends Marionette.ItemView

			tagName : 'li'
			className: 'mix'
			template : listitemTpl

		class EmptyView extends Marionette.ItemView
			
			template:	notextbooksTpl	

		class Views.ListView extends Marionette.CompositeView

			template : textbooksTpl

			className : 'page-content'

			itemView 	: ListItemView

			emptyView  : EmptyView

			itemViewContainer : 'ul.textbooks_list'

			serializeData : ->

				data = super()
				data.classes = []
				num = 0
				num = while num < 15
					data.classes.push num
					num++

				data

			events: 
				'click .btn-group'		: 'dropdown_popup'
				'click .sort'			: 'sortTable'
				'click .filter_class'	: (e)->  @trigger "filter:textbooks:class", $(e.target).closest('li').attr('data-filter')


			dropdown_popup : (e)->
				if $(e.target)
					.closest 'div'
					.hasClass 'open'
						$(e.target).closest 'div' 
						.removeClass 'open'
				else
					$(e.target).closest 'div' 
					.addClass 'open'

			sortTable: (e)->
				options= {}
				data_sort= $(e.target).attr 'data-sort';
				sort_by= data_sort.split '-'
				options.orderby= sort_by[1]
				options.order= $(e.target).attr 'data-order';

				@trigger "sort:textbooks", options
				
			onShow: ->
				console.log '@collection'
				console.log @collection
				

