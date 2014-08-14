define ['app'], (App)->
    App.module "ContentPreview.ContentBoard.Element.Fib.Views",
    (Views, App, Backbone, Marionette, $, _)->
        class Views.FibView extends Marionette.ItemView

            tagName : 'div'

            template : '<p class="fib-text"></p>
            						</br>
            						<div class="alert alert-success text-center fibRightAns" style="display: none;">
            							<h5>The correct answer is:</h5>
            							<h4 class="semi-bold">

            							</h4>
                                        <div class="semi-bold" id="allAnswers">
                                        </div>
            						</div>'

            className : 'fib'

            initialize : (options)->
                @blanksCollection = @model.get 'blanksArray'

            onShow : ->
                @$el.find('p').append _.stripslashes @model.get 'text'

                @$el.closest('.preview').find('#submit-answer-button').on 'click', =>
                    @trigger "submit:answer"

                @_autoPopulateAnswers()


            _autoPopulateAnswers:->
                answerModel=Marionette.getOption @, 'answerModel'
                if answerModel and answerModel.get('status') isnt 'not_attempted'
                    answerArray= answerModel.get 'answer'
                    blanks = @$el.find '.fib-text input'
                    _.each answerArray, (ans,index)=>
                        $(blanks[index]).val ans

                    @trigger "submit:answer"  if Marionette.getOption @, 'displayAnswer'

            onShowFeedback : ->
                @$el.find('.fibRightAns').show()
                originalText = _.stripslashes @model.get 'text'
                htmlText = $.parseHTML originalText
                @$el.find('h4').html htmlText
                self = @

                @$el.find('h4').find('input').each (index,input)=>
                    # console.log $(input).attr('data-id')

                    correctAnswerArray = @blanksCollection.get($(input).attr('data-id')).get('correct_answers')
                    if correctAnswerArray[0] isnt ""
                        $(input).replaceWith("<span class='fibAns'>#{correctAnswerArray[0]}</span>")
                        if correctAnswerArray.length > 1
                            @$el.find('#allAnswers').append "<span>All answers for #{correctAnswerArray[0]}:
                            #{_.toSentence(correctAnswerArray)}</span></br>"
                    else
                        $(input).replaceWith("<span class='fibAns'>(no correct)</span>")
	

				




			
		
			    

