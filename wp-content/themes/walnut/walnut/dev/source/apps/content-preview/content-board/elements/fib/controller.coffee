define ['app'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/elements/fib/view'],
		(App,Element)->

			App.module "ContentPreview.ContentBoard.Element.Fib" ,(Fib, App, Backbone, Marionette,$, _)->

				class Fib.Controller extends Element.Controller

					
					initialize:(options)->
							answerData =
								answer : []
								marks : 0
							@answerModel = App.request "create:new:answer",answerData


							super options

					renderElement : ->
							@blanksCollection = App.request "create:new:question:element:collection",@layout.model.get 'blanksArray'
					
							App.execute "show:total:marks",@layout.model.get 'marks'

							@layout.model.set 'blanksArray',@blanksCollection
							# get the view 
							@view = @_getFibView @layout.model

							@listenTo @view, "submit:answer", @_submitAnswer
					
							
							# show the view
							@layout.elementRegion.show @view,(loading : true)

					_getFibView : (model)->		
							new Fib.Views.FibView
									model : model

					_submitAnswer:->
						enableIndividualMarks = @layout.model.get('enableIndividualMarks')
						@caseSensitive = @layout.model.get 'case_sensitive'

						
							

						# if not enableIndividualMarks
						# 	fullCorrect = false
						# 	_each @view.$el.find('input'), (blank,index)->
						# 		fullCorrect = false
						# 		correctAnswers = @blanksCollection.get($(blanks).attr('data-id')).get('correct_answers')
						
						answerArray = @answerModel.get('answer')

						# condition when enableIndividualMarks is false i.e. evaluate the whole question
						if not enableIndividualMarks
							@answerModel.set 'marks',@layout.model.get 'marks'
							# loop thru each answer
							_.each @view.$el.find('input'), (blank,index)=>
								# save it in answerModel
								@answerModel.get('answer').push($(blank).val())

								# get array of correct answers
								correctAnswersArray = @blanksCollection.get($(blank).attr('data-id')).get('correct_answers')

								if @_checkAnswer $(blank).val(),correctAnswersArray
									$(blank).addClass('ansRight')
								else
									@answerModel.set 'marks',0
									$(blank).addClass('ansWrong')


						else 
							_.each @view.$el.find('input'), (blank,index)=>
								# save it in answerModel
								@answerModel.get('answer').push($(blank).val())

								# get array of correct answers
								blankModel = @blanksCollection.get($(blank).attr('data-id'))
								correctAnswersArray = blankModel.get('correct_answers')
								console.log correctAnswersArray

								if @_checkAnswer $(blank).val(),correctAnswersArray
									@answerModel.set 'marks', @answerModel.get('marks')+blankModel.get('marks')
									$(blank).addClass('ansRight')
								else
									$(blank).addClass('ansWrong')




						# condition when enableIndividualMarks is true i.e. evaluate individual question


						App.execute "show:response",@answerModel.get('marks'),@layout.model.get('marks')

						if @answerModel.get('marks') < @layout.model.get('marks')
							@view.triggerMethod 'show:feedback'

					# function to check wether a given blank is correct
					_checkAnswer:(answer,correctAnswersArray)->
						if @caseSensitive
							return _.contains correctAnswersArray,answer
						else
							return _.contains _.map(correctAnswersArray,(correctAnswer)->
											_.slugify correctAnswer
											) , _.slugify answer


				