define ['app'
        'apps/content-board/element/controller'
        'apps/content-board/elements/fib/view'],
(App, Element)->
    App.module "ContentPreview.ContentBoard.Element.Fib", (Fib, App, Backbone, Marionette, $, _)->
        class Fib.Controller extends Element.Controller


            initialize : (options)->

                {answerWreqrObject,@answerModel} = options

                @answerModel = App.request "create:new:answer" if not @answerModel
                @multiplicationFactor = 0
                
                if answerWreqrObject
                    
                    @displayAnswer = answerWreqrObject.displayAnswer
                    @multiplicationFactor = answerWreqrObject.multiplicationFactor

                    answerWreqrObject.setHandler "get:question:answer",=>

                        blanks= @view.$el.find 'input'

                        #make it blank first to clear the previous attempted answers
                        @answerModel.set 'answer' : []

                        _.each blanks, (blank, index)=>
                            # save it in answerModel
                            @answerModel.get('answer').push($(blank).val())

                        answer = _.compact @answerModel.get 'answer'
                        
                        @layout.model.set 'multiplicationFactor' :answerWreqrObject.multiplicationFactor

                        if not @layout.model.get 'marks_set'
                            @layout.model.set 'marks': @layout.model.get('marks')*answerWreqrObject.multiplicationFactor

                        @layout.model.set 'marks_set' : true
                        
                        if _.isEmpty answer
                            emptyOrIncomplete = 'empty' 

                        else if _.size(answer)< _.size blanks
                            emptyOrIncomplete = 'incomplete' 

                        else emptyOrIncomplete = 'complete'
                        
                        @layout.model.setMultiplicationFactor @multiplicationFactor

                        data=
                            'emptyOrIncomplete' : emptyOrIncomplete
                            'answerModel': @answerModel
                            'totalMarks' : @layout.model.get('marks')

                    answerWreqrObject.setHandler "submit:answer",(displayAnswer) =>
                        #if displayAnswer is true, the correct & wrong answers & marks will be displayed
                        #default is true
                        @_submitAnswer @displayAnswer 


                super options

                if not @layout.model.get 'marks_set'
                    @layout.model.set 'multiplicationFactor' :1

            renderElement : ->

                blanksArray = @layout.model.get 'blanksArray'

                if blanksArray instanceof Backbone.Collection
                    blanksArray = blanksArray.models

                @_parseOptions blanksArray

                @blanksCollection = App.request "create:new:question:element:collection", blanksArray

                App.execute "show:total:marks", @layout.model.get 'marks'

                @layout.model.set 'blanksArray', @blanksCollection

                # console.log @blanksCollection.pluck 'marks'
                # get the view
                @view = @_getFibView @layout.model

                @listenTo @view, "submit:answer", @_submitAnswer

                # show the view
                @layout.elementRegion.show @view

            _getFibView : (model)->
                new Fib.Views.FibView
                    model : model
                    answerModel: @answerModel
                    displayAnswer :@displayAnswer 

            _parseOptions:(blanksArray)->
                _.each blanksArray,(blank)->
                    blank.blank_index = parseInt blank.blank_index if blank.blank_index?
                    blank.blank_size = parseInt blank.blank_size if blank.blank_size?
                    blank.marks = parseFloat blank.marks if blank.marks?


            _submitAnswer :(displayAnswer=true) ->

                @layout.model.setMultiplicationFactor @multiplicationFactor

                enableIndividualMarks = _.toBool @layout.model.get('enableIndividualMarks')
                @caseSensitive = @layout.model.get 'case_sensitive'


                # if not enableIndividualMarks
                # 	fullCorrect = false
                # 	_each @view.$el.find('input'), (blank,index)->
                # 		fullCorrect = false
                # 		correctAnswers = @blanksCollection.get($(blanks).attr('data-id')).get('correct_answers')

                answerArray = @answerModel.get('answer')

                # condition when enableIndividualMarks is false i.e. evaluate the whole question
                if not enableIndividualMarks
                    @answerModel.set 'marks', @layout.model.get 'marks'
                    # loop thru each answer
                    _.each @view.$el.find('input'), (blank, index)=>
                        # save it in answerModel
                        @answerModel.get('answer').push($(blank).val())

                        # get array of correct answers
                        correctAnswersArray = @blanksCollection.get($(blank).attr('data-id')).get('correct_answers')

                        if @_checkAnswer $(blank).val(), correctAnswersArray
                            $(blank).addClass('ansRight') if displayAnswer
                        else
                            @answerModel.set 'marks', 0
                            $(blank).addClass('ansWrong') if displayAnswer


                else
                    @answerModel.set 'marks',0
                    _.each @view.$el.find('input'), (blank, index)=>
                        # save it in answerModel
                        @answerModel.get('answer').push($(blank).val())

                        # get array of correct answers
                        blankModel = @blanksCollection.get($(blank).attr('data-id'))
                        correctAnswersArray = blankModel.get('correct_answers')
                        # console.log correctAnswersArray

                        if @_checkAnswer $(blank).val(), correctAnswersArray
                            @answerModel.set 'marks', @answerModel.get('marks') + parseInt(blankModel.get('marks'))*@layout.model.get 'multiplicationFactor'
                            $(blank).addClass('ansRight')
                        else
                            $(blank).addClass('ansWrong')


                # condition when enableIndividualMarks is true i.e. evaluate individual question


                App.execute "show:response", @answerModel.get('marks'), @layout.model.get('marks')  if displayAnswer

                if @answerModel.get('marks') < @layout.model.get('marks')
                    @view.triggerMethod 'show:feedback'  if displayAnswer

            # function to check wether a given blank is correct
            _checkAnswer : (answer, correctAnswersArray)->
                # console.log answer
                # console.log correctAnswersArray

                if @caseSensitive
                    return _.contains correctAnswersArray, answer
                else
                    return _.contains _.map(correctAnswersArray, (correctAnswer)->
                        _.slugify correctAnswer
                    ), _.slugify answer


				
