define ['app'],(App)->

	App.module "ContentPreview.ContentBoard.Element.Fib.Views",
	(Views, App, Backbone, Marionette,$, _)->

		class Views.FibView extends Marionette.ItemView

			tagName :'div'

			template : '<p class="fib-text"></p>
						</br>
						<div class="alert alert-success text-center fibRightAns" style="display: none;">  
							<h5>The correct answer is:</h5>
							<h4 class="semi-bold">
								
							</h4> 
						</div>'

			className : 'fib'
					
			initialize:(options)->
				@blanksCollection = @model.get 'blanksArray'

			onShow : ->

				@$el.find('p').append _.stripslashes @model.get 'text'

				@$el.closest('.preview').find('#submit-answer-button').on 'click',=>
						@trigger "submit:answer"

			onShowFeedback:->

				@$el.find('.fibRightAns').show()
				originalText = _.stripslashes @model.get 'text'
				htmlText = $.parseHTML originalText
				@$el.find('h4').html htmlText
				self = @
				
				@$el.find('h4').find('input').each (index)->
					# console.log $(input).attr('data-id')
					console.log $(this)
					correctAnswerArray = self.blanksCollection.get($(this).attr('data-id')).get('correct_answers')
					if correctAnswerArray[0] isnt ""
						$(this).replaceWith("<span class='fibAns'>#{correctAnswerArray[0]}</span>")
					else
						$(this).replaceWith("<span class='fibAns'>(no correct)</span>")	
	

				




			
		
			    

