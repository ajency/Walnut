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



			serializeData : ->
				data = super()

				route= App.getCurrentRoute()

				data.url= '#'+route+'/textbook/'+ @model.get 'term_id'

				mode = Marionette.getOption @, 'mode'

				data.take_quiz = true if mode is 'take-quiz' 

				data.training_mode = true if mode is 'training'

				data

		class EmptyView extends Marionette.ItemView
			
			template:	'<div class="fail_element anim250">Sorry &mdash; we could not find any Textbooks matching matching these criteria</div>'


		class TakeClass.TextbooksListView extends Marionette.CompositeView

			template 	: textbooksListTpl

			itemView 	: TextbooksItemView

			emptyView  	: EmptyView

			itemViewContainer : 'ul.textbooks_list'

			itemViewOptions:->
				data = mode: Marionette.getOption @,'mode'


			serializeData:->
				data=super()

				mode = Marionette.getOption @,'mode'

				data.take_quiz = true if mode is 'take-quiz' 
				data.training_mode = true if mode is 'training'
				
				data


			onShow:->

				if  Marionette.getOption(@,'mode') is 'take-quiz'
					@$el.find "#textbooks"
					.addClass 'myClass'

				else 
					@$el.find "#textbooks"
					.addClass 'takeClass'

				@$el.find('#textbooks').mixitup
					layoutMode: 'list', # Start in list mode (display: block) by default
					listClass: 'list', # Container class for when in list mode
					gridClass: 'grid', # Container class for when in grid mode
					effects: ['fade','blur'], # List of effects
					listEffects: ['fade','rotateX'] # List of effects ONLY for list mode

				@dimensions = 
					status: 'all'

				$("li.txtbook").click ->
				  window.location = $(this).find("a").attr("href")
				  false

