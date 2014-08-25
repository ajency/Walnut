define ['app'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/elements/biganswer/views'
],(App,Element)->

	App.module "ContentPreview.ContentBoard.Element.BigAnswer" ,(BigAnswer, App, Backbone, Marionette,$, _)->

		class BigAnswer.Controller extends Element.Controller

			initialize : (options)->
					super options
			renderElement : ->
					# get the view 
					view = @_getBigAnswerView()

					
					# show the view
					@layout.elementRegion.show view

			_getBigAnswerView : ->		
					new BigAnswer.Views.BigAnswerView
							model : @layout.model

			