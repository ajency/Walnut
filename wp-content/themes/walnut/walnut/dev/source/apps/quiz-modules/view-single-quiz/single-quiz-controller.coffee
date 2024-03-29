define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/view-single-quiz/layout'
        'apps/quiz-modules/view-single-quiz/quiz-description/quiz-description-app'
        'apps/quiz-modules/view-single-quiz/content-display/content-display-app'
        'apps/quiz-modules/view-single-quiz/attempts/app'
        'apps/quiz-modules/take-quiz-module/take-quiz-app'
], (App, RegionController)->
	App.module "QuizModuleApp.ViewQuiz", (ViewQuiz, App)->
		class ViewQuiz.Controller extends RegionController

			quizModel = null
			quizModelNew = null
			questionsCollection = null
			quizResponseSummary = null
			quizResponseSummaryCollection = null
			studentModel = null
			studentTrainingModule=null

			#display_mode possible values are: 'class_mode', 'replay', 'quiz_report'
			display_mode = null

			initialize: (opts) ->
				$(window).off 'beforeunload'
				
				{quiz_id,quizModel,questionsCollection,@questionResponseCollection, studentTrainingModule} =opts

				{quizResponseSummary,@quizResponseSummaryCollection,display_mode,@student,d_mode} = opts

				quizModel = App.request "get:quiz:by:id", quiz_id if not quizModel

				#incase the display mode is sent from router on page refresh
				display_mode = d_mode if d_mode

				#get the header and left nav back incase it was hidden for quiz view
				$.showHeaderAndLeftNav()

				@fetchQuizResponseSummary = @_fetchQuizResponseSummary()

				fetchQuestionResponseCollection = @_fetchQuestionResponseCollection()

				fetchQuestionResponseCollection.done =>
					App.execute "when:fetched", quizModel, =>
						#console.log quizModel

						if quizModel.get('code') is 'ERROR'
							App.execute "show:no:permissions:app",
								region          : App.mainContentRegion
								error_header    : 'Unauthorized Quiz'
								error_msg       : quizModel.get 'error_msg'

							return false

						if display_mode isnt 'quiz_report'
							display_mode = if quizResponseSummary.get('status') is 'completed' 
												'replay'
											else 'class_mode'

						textbook_termIDs = _.flatten quizModel.get 'term_ids'
						@textbookNames = App.request "get:textbook:names:by:ids", textbook_termIDs

						#if quiz has already been started or taken before, 
						#the questions must be displayed in the previously taken order
						#this order is saved on first time taking of quiz
						#questions wont be randomized again
						
						if not _.isEmpty quizResponseSummary.get('questions_order')
							quizModel.set 'content_pieces', quizResponseSummary.get 'questions_order'
							#console.log 'quizModel'

						if not questionsCollection
							if quizModel.get('quiz_type') == 'practice' && quizResponseSummary.get('questions_order') != undefined
								questionsCollection = App.request "get:content:pieces:by:ids", quizResponseSummary.get 'questions_order'
							else
								questionsCollection = App.request "get:content:pieces:by:ids", quizModel.get 'content_pieces'

							App.execute "when:fetched", questionsCollection, =>
								@_setMarks()
								@_randomizeOrder()

						App.execute "when:fetched", [questionsCollection,@textbookNames],  =>

							getStudentModel = @_getStudent()

							getStudentModel.done =>
								@layout = layout = @_getQuizViewLayout()

								@show @layout, loading: true

								@listenTo @layout, 'show', =>
									@showQuizViews()
									@_showAttemptsRegion()
								
								@listenTo @layout, 'goto:next:item:student:training:module', =>
									data = type: 'quiz', id: quizModel.id
									App.vent.trigger "next:item:student:training:module", data
									
								@listenTo @layout.quizDetailsRegion, 'start:quiz:module', @startQuiz

								@listenTo @layout.quizDetailsRegion, 'try:again', @_tryAgain

								@listenTo @layout.attemptsRegion, 'view:summary', @_viewSummary

			_setMarks:->

				actualMarks= 0
				questionsCollection.each (m)-> actualMarks += m.get('marks') if m.get('marks')

				multiplicationFactor = quizModel.get('marks')/actualMarks if actualMarks>0

				if multiplicationFactor
					questionsCollection.each (m)->
						m.setMarks multiplicationFactor

			_randomizeOrder:->
				if quizResponseSummary.isNew() and quizModel.get('permissions').randomize
					questionsCollection.each (e)-> e.unset 'order'
					questionsCollection.reset questionsCollection.shuffle()
					#change the order in the main model also
					quizModel.set 'content_pieces', questionsCollection.pluck 'ID'

			_getStudent:->
				@defer = $.Deferred()

				if @student
					if @student instanceof Backbone.Model
						studentModel = @student
						@defer.resolve()
					else
						studentModel= App.request "get:user:by:id", @student
						App.execute "when:fetched", studentModel, => @defer.resolve()

				else @defer.resolve()

				@defer.promise()

			_tryAgain:->
				quizModelNew = App.request "get:quiz:by:id", quizModel.get 'id'
				App.execute "when:fetched", quizModelNew, =>
					
					quizModel = quizModelNew			

					return false if quizModel.get('quiz_type') isnt 'practice'

					@questionResponseCollection = null

					quizModel.set 'attempts' : parseInt(quizModel.get('attempts'))+1
					quizModel.set 'replay_mode' : false

					@summary_data= 
						'collection_id' : quizModel.get 'id'
						'student_id'    : App.request "get:loggedin:user:id"
						'taken_on'      : moment().format("YYYY-MM-DD")

					#console.log @summary_data

					quizResponseSummary = App.request "create:quiz:response:summary", @summary_data
					quizResponseSummaryCollection.add quizResponseSummary

					questionsCollection = App.request "get:content:pieces:by:ids", quizModelNew.get 'content_pieces'

					App.execute "when:fetched", questionsCollection, =>
						@_setMarks()

						display_mode = 'class_mode'

						@_randomizeOrder()

						@startQuiz()


			_viewSummary:(summary_id)->
				quizResponseSummary = quizResponseSummaryCollection.get summary_id
				@questionResponseCollection = null
				fetchResponses = @_fetchQuestionResponseCollection()
				fetchResponses.done => 

					if not _.isEmpty quizResponseSummary.get 'questions_order'

						#reorder the questions as per the order that it was taken in
						#questionsCollection.each (e)-> e.unset 'order'
						questionsCollection = App.request "get:content:pieces:by:ids", quizResponseSummary.get 'questions_order'
						App.execute "when:fetched", questionsCollection, =>

							quizModel.set 'content_pieces', quizResponseSummary.get 'questions_order'

							# reorderQuestions = []

							# reorderQuestions.push(questionsCollection.get(m)) for m in quizModel.get('content_pieces')

							# questionsCollection.reset questionsCollection.models

					@layout.$el.find '#quiz-details-region,#content-display-region'
					.hide()
					@layout.$el.find '#quiz-details-region,#content-display-region'
					.fadeIn('slow')

					@showQuizViews()

					@layout.attemptsRegion.$el.find '.view-summary i'
					.removeClass 'fa fa-spin fa-spinner'

					@_scrolltoQuizDetailsRegion()

			_scrolltoQuizDetailsRegion:->

				top= @layout.quizDetailsRegion.$el.offset().top
				#cancel out the header div height
				top= top-70

				$('html,body').animate scrollTop: top, 'slow'


			_fetchQuizResponseSummary:=>
				defer = $.Deferred();

				#if the summarycollection has been passed from quiz reports screens
				quizResponseSummaryCollection= @quizResponseSummaryCollection if @quizResponseSummaryCollection

				#if the summary has been passed from the take-quiz-module app after quiz completion
				if quizResponseSummary
					defer.resolve()
					return defer.promise()

				@summary_data= 
					'collection_id' : quizModel.get 'id'
					'student_id'    : App.request "get:loggedin:user:id"
					'taken_on'      : moment().format("YYYY-MM-DD")

				quizResponseSummaryCollection = App.request "get:quiz:response:summary", @summary_data
				App.execute "when:fetched", quizResponseSummaryCollection, =>

					if quizResponseSummaryCollection.length>0
						quizResponseSummary= quizResponseSummaryCollection.last()
						defer.resolve()

					else
						quizResponseSummary =  App.request "create:quiz:response:summary", @summary_data
						quizResponseSummaryCollection.add quizResponseSummary
						defer.resolve()

				defer.promise()

			_fetchQuestionResponseCollection:=>
				defer = $.Deferred();

				@fetchQuizResponseSummary.done =>
					if not @questionResponseCollection and not quizResponseSummary.isNew()
						@questionResponseCollection = App.request "get:quiz:question:response:collection",
							'summary_id': quizResponseSummary.get 'summary_id'

						App.execute "when:fetched", @questionResponseCollection, =>
							defer.resolve()
					else
						defer.resolve()

				defer.promise()

			startQuiz: =>

				App.execute "start:take:quiz:app",
					region: App.mainContentRegion
					quizModel               : quizModel
					quizResponseSummary     : quizResponseSummary
					questionsCollection     : questionsCollection
					display_mode            : display_mode
					questionResponseCollection: @questionResponseCollection
					textbookNames           : @textbookNames
					studentTrainingModule	: studentTrainingModule

			showQuizViews: =>

				App.execute "show:view:quiz:detailsapp",
					region                  : @layout.quizDetailsRegion
					model                   : quizModel
					display_mode            : display_mode
					quizResponseSummary     : quizResponseSummary
					textbookNames           : @textbookNames
					studentTrainingModule   : studentTrainingModule

				if quizResponseSummary.get('status') is 'completed'

					App.execute "show:quiz:items:app",
						region                  : @layout.contentDisplayRegion
						model                   : quizModel
						groupContentCollection  : questionsCollection
						questionResponseCollection: @questionResponseCollection


			_showAttemptsRegion: =>
				loggedInUserData = App.request "get:user:model"
				App.execute "when:fetched", loggedInUserData, =>
					role = loggedInUserData.get 'roles'
					if quizModel.get('quiz_type') is 'practice' and (quizModel.get('attempts') > 0 || role[0] == 'school-admin')

						App.execute "show:quiz:attempts:app",
							region                  : @layout.attemptsRegion
							model                   : quizModel
							quizResponseSummaryCollection  : quizResponseSummaryCollection

			_getQuizViewLayout: ->
				new ViewQuiz.LayoutView.QuizViewLayout
					model: quizModel
					display_mode: display_mode
					student: studentModel					
					studentTrainingModule:studentTrainingModule


		# set handlers
		App.commands.setHandler "show:single:quiz:app", (opt = {})->
			new ViewQuiz.Controller opt
