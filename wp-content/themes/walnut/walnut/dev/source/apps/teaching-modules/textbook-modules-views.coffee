define ['app',
		'text!apps/teaching-modules/templates/content-modules-list.html'], (App,contentModulesTpl)->
	App.module "TeachersDashboardApp.View.TakeClassTextbookModules", (TextbookModules, App)->
		class ContentGroupsItemView extends Marionette.ItemView

			# duration variable can be in hours/minutes (eg. 1 hr or 25 mins) and cannot be used in sorting.
			# hence total_minutes is used. it is the duration in minutes.
			# kept hidden coz the display doesnt need it. only tablesorter does

			template : '<td class="v-align-middle">{{name}}</td>
						<td class="v-align-middle">{{chapterName}}</td>
						{{#take_quiz}}
						<td class="v-align-middle">{{quiz_type}}</td>
						{{/take_quiz}}
						<td class="v-align-middle"><span style="display: none;">{{total_minutes}}</span> <span class="muted">{{duration}} {{minshours}}</span></td>
					   	<td>
					   	{{#practice_quiz}}
						   	{{#attempts}}
						   		<span class="label label-info">Attempts: <strong>{{attempts}}</strong></span>
						   	{{/attempts}}
						   	{{^attempts}}
						   		<span class="label label-important">Not Started</span>
						   	{{/attempts}}
					   	{{/practice_quiz}}
					   	{{^practice_quiz}}
						  {{&status_str}}
					   	{{/practice_quiz}}

						</td>
						<td>
							<button data-id="{{id}}" type="button" class="btn btn-success btn-small pull-right action start-training">
							View {{moduleType}}
							</button>
							{{#schedule_button}}
								<button type="button" data-target="#schedule" data-toggle="modal" class="btn btn-white btn-small pull-left m-r-10 training-date">
									<i class="fa fa-calendar"></i> {{taken_on}}
								</button>
							{{/schedule_button}}
							{{^schedule_button}}
								{{#taken_on}}
									<div class="alert alert-success inline pull-left m-b-0 m-r-10 dateInfo">{{taken_on}}</div>
								{{/taken_on}}

								{{^taken_on}}
									{{#classTest}}
										{{#schedule}}
											{{#schedule.is_active}}										
												<div class="alert alert-info inline pull-left m-b-0 m-r-10">
													Scheduled<br>
													From: {{scheduleFrom}}<br>
													To: {{scheduleTo}}
												</div>
											{{/schedule.is_active}}

											{{^schedule.is_active}}
												<div class="schedule_dates alert alert-info inline pull-left m-b-0 m-r-10">
													Scheduled<br>
													From: {{scheduleFrom}}<br>
													To: {{scheduleTo}}
												</div>
											{{/schedule.is_active}}
										{{/schedule}}
										{{^schedule}}
											Not Scheduled
										{{/schedule}}
									{{/classTest}}
								{{/taken_on}}
							{{/schedule_button}}
						</td>'

			tagName : 'tr'


			onShow : ->
				@$el.attr 'id', 'row-' + @model.get 'id'
				@$el.attr 'data-id', @model.get 'id'

				if @model.get('quiz_type') is 'class_test'

					if @model.get 'schedule'
						if not @model.get('schedule')['is_active']
							@$el.find '.start-training'
							.hide()

						if @model.get 'is_expired'
							@$el.find '.schedule_dates'
							.removeClass 'alert-info'
							.addClass 'alert-error'
					else
						@$el.find '.start-training'
						.hide()

			serializeData : ->
				data = super()

				data.chapterName = =>
					chapter = _.chain @chapters.findWhere "term_id" : data.term_ids.chapter
					.pluck 'name'
						.compact()
						.value()
					chapter

				if @model.get('type') is 'teaching-module'
					data.moduleType = 'Module'
					taken_on = @model.get('training_date')
					if not taken_on
						taken_on = 'Schedule'
					else
						taken_on = moment(taken_on).format("Do MMM YYYY")

				else
					data.moduleType = 'Quiz'
					data.classTest = true if data.quiz_type is 'class_test'
					taken_on = @model.get('taken_on')
					if not taken_on
						taken_on = null
					else
						taken_on = moment(taken_on).format("Do MMM YYYY")

					if data.quiz_type is 'class_test' and data.status isnt 'completed'
						taken_on = null

				status = @model.get 'status'

				if @model.get('post_status')? and @model.get('post_status') is 'archive'
					data.status_str = '<span class="label label-success">Archived</span>'

				else
					if status is 'started' or status is 'resumed'
						data.status_str = '<span class="label label-info">In Progress</span>'

					else if status is 'completed'
						data.status_str = '<span class="label label-success">Completed</span>'

					else
						data.status_str = '<span class="label label-important">Not Started</span>'

						if Marionette.getOption(@, 'mode') isnt 'take-quiz'
							data.schedule_button = true

				data.taken_on= taken_on

				if Marionette.getOption(@, 'mode') is 'take-quiz'
					data.take_quiz = true
					data.quiz_type =  @model.getQuizTypeLabel()

					if data.schedule
						data.scheduleFrom = moment(data.schedule.from).format("Do MMM YYYY")
						data.scheduleTo = moment(data.schedule.to).format("Do MMM YYYY")

				if @model.get('quiz_type') is 'practice'
					data.practice_quiz = true

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

			template : contentModulesTpl

			itemView : ContentGroupsItemView

			itemViewContainer : 'tbody'

			itemViewOptions : ->
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

				if Marionette.getOption(@, 'mode') in ['training','take-class']
					App.navigate currentRoute + "/module/" + dataID, true

				if Marionette.getOption(@, 'mode') is 'take-quiz'
					App.navigate currentRoute + "/quiz/" + dataID, true

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

				textbookFiltersHTML= $.showTextbookFilters chapters: Marionette.getOption @, 'chaptersCollection'
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
				if Marionette.getOption(@, 'mode') is 'take-quiz'
					dataType = 'quiz'
				else
					dataType = 'teaching-modules'
					
				filtered_data= $.filterTableByTextbooks(@, dataType)

				@collection.set filtered_data

				$("#take-class-modules").trigger "updateCache"
				pagerOptions =
					container : $(".pager")
					output : '{startRow} to {endRow} of {totalRows}'

				$('#take-class-modules').tablesorterPager pagerOptions