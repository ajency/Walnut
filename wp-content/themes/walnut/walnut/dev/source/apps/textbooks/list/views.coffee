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

			onShow:->
				@$el.attr 'data-name', @model.get 'name'
				@$el.addClass 'Class_'+class_id for class_id in @model.get 'classes'
				$filters = $('#Filters').find 'li', dimensions = region: 'all', recreation: 'all'

			serializeData : ->
				data = super()
				if @model.get 'classes'
					item_classes= _.sortBy(@model.get 'classes', (num)-> num)
					class_string= ''
					for class_id in item_classes
						class_string += 'Class '+class_id
						class_string += ', ' if _.last(item_classes)!=class_id

					data.class_string= class_string;

				data
				

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
				collection_classes= @collection.pluck 'classes'
				data_classes=_.union _.flatten collection_classes
				data.classes= _.sortBy(data_classes, (num)-> num)
				data

			events: 
				'click .filter_class'		: (e)->  @trigger "filter:textbooks:class", $(e.target).closest('li').attr('data-filter')


			sortTable: (e)->
				options= {}
				data_sort= $(e.target).attr 'data-sort';
				sort_by= data_sort.split '-'
				options.orderby= sort_by[1]
				options.order= $(e.target).attr 'data-order';

				@trigger "sort:textbooks", options
				
			onShow: ->
				$('#textbooks').mixitup
					layoutMode: 'list', # Start in list mode (display: block) by default
					listClass: 'list', # Container class for when in list mode
					gridClass: 'grid', # Container class for when in grid mode
					effects: ['fade','blur'], # List of effects
					listEffects: ['fade','rotateX'] # List of effects ONLY for list mode
				
				

