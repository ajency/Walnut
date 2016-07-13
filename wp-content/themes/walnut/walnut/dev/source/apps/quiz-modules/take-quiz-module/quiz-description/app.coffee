define ['app'
		'controllers/region-controller'
		'text!apps/quiz-modules/take-quiz-module/quiz-description/templates/quiz-description-tpl.html'],
		(App, RegionController, quizDescriptionTemplate)->

			App.module "TakeQuizApp.QuizDescription", (QuizDescription, App)->
				class QuizDescription.Controller extends RegionController

					initialize: (opts)->
						{model, currentQuestion,@textbookNames, @display_mode} = opts

						@view = view = @_showQuizDescriptionView model, currentQuestion

						textbookID = model.get('term_ids').textbook
						@textbookModel = App.request "get:textbook:by:id", textbookID

						App.execute "when:fetched", [@textbookNames, @textbookModel], =>
							@show @view, (loading : true)

						@listenTo @region, "question:changed", (model)->
							@view.triggerMethod "question:change", model

					_showQuizDescriptionView: (model, currentQuestion) =>
						
						terms = model.get 'term_ids'

						new ModuleDescriptionView
							model           : model
							display_mode   : @display_mode

							templateHelpers :
								getQuestionDuration: currentQuestion.get 'duration'
								getQuestionMarks: parseFloat(currentQuestion.get('marks')).toFixed(1)
								getClass :=> @textbookModel.getClasses()
								getTextbookName :=> @textbookNames.getTextbookName terms
								getChapterName :=> @textbookNames.getChapterName terms
								getSectionsNames :=> @textbookNames.getSectionsNames terms
								getSubSectionsNames :=> @textbookNames.getSubSectionsNames terms

				class ModuleDescriptionView extends Marionette.ItemView

					className: 'pieceWrapper'

					template: quizDescriptionTemplate

					serializeData:->

						data = super()
						
						#if this screen is accessed from the quiz_reports section by school admin / parent etc the practice header 
						#doesnt need to be seen

						if Marionette.getOption(@, 'display_mode') isnt 'quiz_report'
							data.practice_mode =true if @model.get('quiz_type') is 'practice'

						data

					onShow : ->
						$('#collapseView').on 'hidden.bs.collapse', ->
							$('#accordionToggle').removeClass 'updown'
							$('#accordionToggle').text 'Expand'
							$('.submit2').removeClass 'submit-pushed'

						$('#collapseView').on 'shown.bs.collapse', ->
							$('#accordionToggle').addClass 'updown'
							$('#accordionToggle').text 'Collapse'
							$('.submit2').addClass 'submit-pushed'

					onQuestionChange:(model)->
						@$el.find "#time-on-question"
						.html model.get 'duration'

						@$el.find "#marks-for-question"
						.html parseFloat(model.get('marks')).toFixed(1)
					
