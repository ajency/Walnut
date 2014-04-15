define ['app'
		'text!apps/teachers-dashboard/take-class/templates/textbooks-list.html'
		'text!apps/teachers-dashboard/take-class/templates/list-item.html'
		],(App,textbooksListTpl, listitemTpl)->

	App.module "TeachersDashboardApp.View.TakeClass",(TakeClass, App)->		


		class TextbooksItemView extends Marionette.ItemView

			tagName : 'li'
			className: 'txtbook mix mix_all'
			template : listitemTpl

			onShow:->
				@$el.attr 'data-name', @model.get 'name'

				@$el.attr 'data-modules', @model.get 'modules_count'

				@$el.attr 'data-subjects', @model.get 'subjects'


				$('#textbooks').mixitup
					layoutMode: 'list', # Start in list mode (display: block) by default
					listClass: 'list', # Container class for when in list mode
					gridClass: 'grid', # Container class for when in grid mode
					effects: ['fade','blur'], # List of effects
					listEffects: ['fade','rotateX'] # List of effects ONLY for list mode


			serializeData : ->
				data = super()

				subjects =@model.get 'subjects'
				if subjects
					item_subjects= _.sortBy(subjects, (num)-> num)
					subject_string= ''
					for subject in item_subjects
						subject_string += subject
						subject_string += ', ' if _.last(item_subjects)!=subject

					data.subject_string= subject_string;

				data

		class EmptyView extends Marionette.ItemView
			
			template:	'<div class="fail_element anim250">Sorry &mdash; we could not find any Textbooks matching matching these criteria</div>'


		class TakeClass.TextbooksListView extends Marionette.CompositeView

			template : textbooksListTpl

			className : ''

			itemView 	: TextbooksItemView

			emptyView  : EmptyView

			itemViewContainer : 'ul.textbooks_list'

			onShow:->
				@dimensions = 
					status: 'all'
