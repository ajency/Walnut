define ['app'
		'text!apps/teachers-dashboard/list-textbooks/templates/textbooks-list.html'
		'text!apps/teachers-dashboard/list-textbooks/templates/list-item.html'
		],(App,textbooksListTpl, listitemTpl)->

	App.module "TeachersDashboardApp.View.List",(List, App)->		


		class TextbooksItemView extends Marionette.ItemView

			tagName : 'li'
			className: 'mix mix_all'
			template : listitemTpl

			onShow:->
				@$el.attr 'data-name', @model.get 'name'

				@$el.attr 'data-modules', @model.get 'modules_count'

				$('#textbooks').mixitup
					layoutMode: 'list', # Start in list mode (display: block) by default
					listClass: 'list', # Container class for when in list mode
					gridClass: 'grid', # Container class for when in grid mode
					effects: ['fade','blur'], # List of effects
					listEffects: ['fade','rotateX'] # List of effects ONLY for list mode

		class EmptyView extends Marionette.ItemView
			
			template:	'<div class="fail_element anim250">Sorry &mdash; we could not find any Textbooks matching matching these criteria</div>'


		class List.TextbooksListView extends Marionette.CompositeView

			template : textbooksListTpl

			className : ''

			itemView 	: TextbooksItemView

			emptyView  : EmptyView

			itemViewContainer : 'ul.textbooks_list'

			onShow:->
				@dimensions = 
					status: 'all'
