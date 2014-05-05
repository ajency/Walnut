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
				
							@layout.model.set 'blanksArray',@blanksCollection
							# get the view 
							@view = @_getFibView @layout.model

							# @listenTo @view, "submit:answer", @_submitAnswer
					
							
							# show the view
							@layout.elementRegion.show @view,(loading : true)

					_getFibView : (model)->		
							new Fib.Views.FibView
									model : model

					_submitAnswer:->
						enableIndividualMarks = @layout.model.get('enableIndividualMarks')
						caseSensitive = @layout.model.get 'case_sensitive'

						_each @view.$el.find('input'), (blank,index)->
							@answerModel.get('answer').push($(blank).val())

						if not enableIndividualMarks
							fullCorrect = false
							_each @view.$el.find('input'), (blank,index)->
								fullCorrect = false
								correctAnswers = @blanksCollection.get($(blanks).attr('data-id')).get('correct_answers')
								





						App.execute "show:response",@answerModel.get('marks'),@layout.model.get('marks')


				
