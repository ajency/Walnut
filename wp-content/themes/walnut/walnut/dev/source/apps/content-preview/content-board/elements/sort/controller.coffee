define ['app'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/elements/sort/view'],
		(App,Element)->

			App.module "ContentPreview.ContentBoard.Element.Sort" ,(Sort, App, Backbone, Marionette,$, _)->

				class Sort.Controller extends Element.Controller

					initialize : (options)->
						
						answerData =
								answer : []
								marks : 0
							
						@answerModel = App.request "create:new:answer",answerData						

						super options

						

					renderElement : ->
							optionsObj = @layout.model.get 'elements'
							# if the object is a collection then keep as it is 
							optionsObj = _.shuffle optionsObj

							@optionCollection = App.request "create:new:option:collection" , optionsObj
							@layout.model.set 'elements',@optionCollection

							# get the view 
							@view = @_getSortView @optionCollection

							App.execute "show:total:marks",@layout.model.get 'marks'
							
							@listenTo @view, "submit:answer", @_submitAnswer

							# show the view
							@layout.elementRegion.show @view

					_getSortView : (collection)->		
							new Sort.Views.SortView
									collection : collection
									sort_model : @layout.model

					_submitAnswer:=>
						@answerModel.set 'marks',@layout.model.get 'marks'
						@view.$el.find('input#optionNo').each (index,element)=>

								answerOptionIndex = @optionCollection.get($(element).val()).get('index')
								@answerModel.get('answer').push answerOptionIndex

								if answerOptionIndex isnt index+1
									@answerModel.set 'marks',0
									$(element).parent().addClass 'ansWrong'
								else
									$(element).parent().addClass 'ansRight'

						App.execute "show:response",@answerModel.get('marks'),@layout.model.get('marks')

						console.log @answerModel.get('answer').toString()

						if @answerModel.get('marks') is 0
							@view.triggerMethod 'show:feedback'

					

					