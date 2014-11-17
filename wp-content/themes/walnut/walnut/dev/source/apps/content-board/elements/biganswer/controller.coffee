define ['app'
		'apps/content-board/element/controller'
		'apps/content-board/elements/biganswer/views'
],(App,Element)->

	App.module "ContentPreview.ContentBoard.Element.BigAnswer" ,(BigAnswer, App, Backbone, Marionette,$, _)->

		class BigAnswer.Controller extends Element.Controller

			initialize : (options)->
					{answerWreqrObject,@answerModel} = options
					@answerModel = App.request "create:new:answer" if not @answerModel
					
					@multiplicationFactor = 0

					super options

					if answerWreqrObject
					
						@displayAnswer = answerWreqrObject.displayAnswer
						@multiplicationFactor = answerWreqrObject.multiplicationFactor
						
						answerWreqrObject.setHandler "get:question:answer",=>

							@layout.model.setMultiplicationFactor @multiplicationFactor

							answer = @view.$el.find('textarea').val()

							@answerModel.set 'answer' : answer

							if _.isEmpty(answer) then emptyOrIncomplete = 'empty' else emptyOrIncomplete = 'complete'

							data=
								'emptyOrIncomplete' : emptyOrIncomplete
								'answerModel': @answerModel
								'totalMarks' : @layout.model.get('marks')

			renderElement : ->
					# get the view 
					console.log @answerModel	
					view = @view= @_getBigAnswerView @answerModel
					
					# show the view
					@layout.elementRegion.show view, loading:true

			_getBigAnswerView :(answerModel) =>
					console.log @answerModel		
					new BigAnswer.Views.BigAnswerView
						model : @layout.model
						answerModel: answerModel

			