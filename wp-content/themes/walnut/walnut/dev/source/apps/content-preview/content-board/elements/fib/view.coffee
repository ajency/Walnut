define ['app'],(App)->

	App.module "ContentPreview.ContentBoard.Element.Fib.Views",
	(Views, App, Backbone, Marionette,$, _)->

		class Views.FibView extends Marionette.ItemView

			tagName :'p'
					
			initialize:(options)->
				@blanksCollection = @model.get 'blanksArray'

			onShow : ->

				@$el.append _.stripslashes @model.get 'text'

				@$el.closest('.preview').find('#submit-answer-button').on 'click',=>
						@trigger "submit:answer"


			
		
			    

