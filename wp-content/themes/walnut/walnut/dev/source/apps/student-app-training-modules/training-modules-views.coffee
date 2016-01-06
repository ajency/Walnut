define ['app',
		'text!apps/student-app-training-modules/templates/training-list.html'], (App,listTrainingTpl)->
	App.module "StudentsAppTrainingModule.View.TakeClassTextbookModules", (TextbookModules, App)->
		class ContentGroupsItemView extends Marionette.ItemView

			# duration variable can be in hours/minutes (eg. 1 hr or 25 mins) and cannot be used in sorting.
			# hence total_minutes is used. it is the duration in minutes.
			# kept hidden coz the display doesnt need it. only tablesorter does

			template : '<td class="v-align-middle">{{name}}</td>
						<td class="v-align-middle">{{textbookName}}</td>
						<td class="v-align-middle">{{chapterName}}</td>
						<td class="v-align-middle"><span style="display: none;">{{total_minutes}}</span> <span class="muted">{{duration}} {{minshours}}</span></td>
					   	<td>
							<button data-id="{{id}}" type="button" class="btn btn-success btn-small pull-right action start-training">
							View {{moduleType}}
							</button>
						</td>'

			tagName : 'tr'


			onShow : ->
				@$el.attr 'id', 'row-' + @model.get 'id'
				@$el.attr 'data-id', @model.get 'id'

				if @model.get('quiz_type') is 'class_test'

					if @model.get 'schedule'
						#hide the start button if 
						#1. the schedule has expired without completing the quiz
						#2. the status isnt active. ie. the quiz is scheduled for a future date.
						#3. if the current site is a multisite. class test can only be taken on standalone school site. 
						if @model.get('schedule')['is_expired'] or not @model.get('schedule')['is_active']
							@$el.find '.start-training'
							.hide()

						if not IS_STANDALONE_SITE
							@$el.find '.start-training'
							.hide()

						if @model.get('schedule')['is_expired']
							@$el.find '.schedule_dates'
							.removeClass 'alert-info'
							.addClass 'alert-error'

					else
						@$el.find '.start-training'
						.hide()

					if @model.get('status') is 'completed'
						@$el.find '.start-training'
						.show()


			serializeData : ->
				data = super()
				@textbooks = Marionette.getOption @, 'textbookNames'
				
				data.textbookName = =>
                    textbook = @textbooks.findWhere "id" : data.term_ids.textbook
                    textbook.get 'name' if textbook?

                data.chapterName = =>
                    chapter = @textbooks.findWhere "id" : data.term_ids.chapter
                    chapter.get 'name' if chapter?

				data

			initialize : (options)->
				@chapters = options.chaptersCollection

		class EmptyView extends Marionette.ItemView

			template: 'No Modules Available'

			tagName: 'td'

			onShow:->
				if Marionette.getOption(@, 'mode') is 'take-quiz'
					@$el.attr 'colspan',5
				else 
					@$el.attr 'colspan',4



		class TextbookModules.ContentGroupsView extends Marionette.CompositeView

			template : listTrainingTpl

			itemView : ContentGroupsItemView

			itemViewContainer : 'tbody'

			itemViewOptions : ->
				textbookNames 		: Marionette.getOption @, 'textbookNames' 
				chaptersCollection  : Marionette.getOption @, 'chaptersCollection'
				mode: Marionette.getOption @, 'mode'

			emptyView : EmptyView

			className : 'teacher-app moduleList'

			events :
				'change .textbook-filter' :(e)->
					@trigger "fetch:chapters:or:sections", $(e.target).val(), e.target.id
				'change #content-status-filter'  : 'setFilteredContent'

				'change #quiz-type-filter'  : 'setFilteredContent'

				'click .start-training' : 'startTraining'
				'click .training-date' : 'scheduleTraining'

			serializeData:->
				data = super()
				data.take_quiz = true if Marionette.getOption(@, 'mode') is 'take-quiz'
				data

			startTraining : (e)=>
				dataID = $(e.currentTarget).attr 'data-id'
				currentRoute = App.getCurrentRoute()

				App.navigate "students/training-module/" + dataID, true

			onScheduledModule : (id, date)->
				@$el.find 'tr#row-' + id + ' .training-date'
				.html '<i class="fa fa-calendar"></i> ' + moment(date).format("Do MMM YYYY")

			scheduleTraining : (e)->
				dataID = $ e.target
				.closest 'tr'
					.attr 'data-id'

				@trigger "schedule:training", dataID

			onShow : =>
				if Marionette.getOption(@, 'mode') is 'training'
					@$el.find '.status_label, .training-date, #status_header, .dateInfo'
					.remove();

				textbookFiltersHTML= $.showTextbookFilters textbooks: Marionette.getOption @, 'chaptersCollection'
				@fullCollection = Marionette.getOption @, 'fullCollection'
				console.log @fullCollection
				@$el.find '#textbook-filters'
				.html textbookFiltersHTML

				@$el.find ".select2-filters"
				.select2()

				$('#take-class-modules').tablesorter();

				pagerOptions =
					container : $(".pager")
					output : '{startRow} to {endRow} of {totalRows}'

				$('#take-class-modules').tablesorterPager pagerOptions

			onFetchChaptersOrSectionsCompleted :(filteredCollection, filterType) ->

				switch filterType
					when 'textbooks-filter' then $.populateChapters filteredCollection, @$el
					when 'chapters-filter' then $.populateSections filteredCollection, @$el
					when 'sections-filter' then $.populateSubSections filteredCollection, @$el

				@setFilteredContent()


			setFilteredContent:->
				dataType = 'student-training'
					
				filtered_data= $.filterTableByTextbooks(@, dataType)

				@collection.set filtered_data

				$("#take-class-modules").trigger "updateCache"
				pagerOptions =
					container : $(".pager")
					output : '{startRow} to {endRow} of {totalRows}'

				$('#take-class-modules').tablesorterPager pagerOptions