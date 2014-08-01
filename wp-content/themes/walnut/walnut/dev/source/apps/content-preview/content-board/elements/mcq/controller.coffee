define ['app'
        'apps/content-preview/content-board/element/controller'
        'apps/content-preview/content-board/elements/mcq/views'],
(App, Element)->
    App.module "ContentPreview.ContentBoard.Element.Mcq", (Mcq, App, Backbone, Marionette, $, _)->
        class Mcq.Controller extends Element.Controller

            initialize : (options)->

                {answerWreqrObject,@answerModel} = options

                @answerModel = App.request "create:new:answer" if not @answerModel

                if answerWreqrObject
                    answerWreqrObject.setHandler "get:question:answer", =>
                        #@_submitAnswer()
                        console.log "@answerModel.get 'answer'"
                        console.log @answerModel.get 'answer'
                        data=
                            'answerModel': @answerModel
                            'totalMarks' : @layout.model.get('marks')

                    answerWreqrObject.setHandler "submit:answer",(displayAnswer) =>
                        #if displayAnswer is true, the correct & wrong answers & marks will be displayed
                        #default is true
                        @_submitAnswer displayAnswer 

                # _.defaults options.modelData,

                super(options)




            # overiding the function
            renderElement : ()=>

                optionsObj = @layout.model.get 'options'
                if optionsObj instanceof Backbone.Collection
                    optionsObj = optionsObj.models

                @_parseOptions optionsObj

                #create a shufle flag.. now if the coulmn width was changed for any of the option
                # then dont shuffle the option else shuffle
                shuffleFlag = true

                _.each optionsObj, (option)=>
                    if parseInt(option.class) isnt 12 / @layout.model.get 'columncount'
                        shuffleFlag = false

                if shuffleFlag
                    optionsObj = _.shuffle optionsObj

                optionCollection = App.request "create:new:option:collection", optionsObj
                @layout.model.set 'options', optionCollection


#                App.execute "show:total:marks", @layout.model.get 'marks'

                # get the view
                @view = @_getMcqView()

                # listen to event from the view to create the row structure
                @listenTo @view, "create:row:structure", @createRowStructure

                @listenTo @view, "submit:answer", @_submitAnswer


                if @answerModel.get('status') isnt 'not_attempted'
                    @_submitAnswer()

                # show the view
                @layout.elementRegion.show @view

            _getMcqView : ->
                new Mcq.Views.McqView
                    model : @layout.model

            # convert the option attributes to integers
            _parseOptions : (optionsObj)->
                
                _.each optionsObj,(option)->
                    option.marks = parseInt option.marks if option.marks?
                    option.optionNo = parseInt option.optionNo if option.optionNo?
                    option.class = parseInt option['class'] if option['class']?

                @layout.model.set 'correct_answer', _.map @layout.model.get('correct_answer'), (ans)->
                    parseInt ans

            _submitAnswer :(displayAnswer=true) =>
                @answerModel.set 'marks', 0
                if not @answerModel.get('answer').length
                    # confirmbox = confirm 'You haven\'t selected anything..\n do you still want to continue?'
                    console.log 'you havent selected any thing'
                    # return if not confirmbox
                    # App.execute "show:response",@answerModel.get('marks'),@layout.model.get('marks')

                else
                    if not @layout.model.get 'multiple'
                        console.log _.difference(@answerModel.get('answer'), @layout.model.get('correct_answer'))
                        if not _.difference(@answerModel.get('answer'), @layout.model.get('correct_answer')).length
                            @answerModel.set 'marks', @layout.model.get 'marks'
                        # App.execute "show:response",@answerModel.get('marks'),@layout.model.get('marks')
                    else
                        if not _.difference(@answerModel.get('answer'), @layout.model.get('correct_answer')).length
                            if not _.difference(@layout.model.get('correct_answer'), @answerModel.get('answer')).length
                                @answerModel.set 'marks', @layout.model.get 'marks'
                                # App.execute "show:response",@answerModel.get('marks'),@layout.model.get('marks')
                            else
                                answersNotMarked = _.difference(@layout.model.get('correct_answer'),
                                  @answerModel.get('answer'))
                                totalMarks = @layout.model.get 'marks'
                                _.each answersNotMarked, (notMarked)=>
                                    totalMarks -= @layout.model.get('options').get(notMarked).get('marks')
                                @answerModel.set 'marks', totalMarks


                # App.execute "show:response",@answerModel.get('marks'),@layout.model.get('marks')
                # else
                # App.execute "show:response",@answerModel.get('marks'),@layout.model.get('marks')

                App.execute "show:response", @answerModel.get('marks'), @layout.model.get('marks')  if displayAnswer

                @view.triggerMethod "add:option:classes", @answerModel.get('answer')  if displayAnswer





            # creates Row structure for mcq
            createRowStructure : (options)=>
                columnCount = parseInt(@layout.model.get('columncount') ) + 1
                columnElements = while columnCount -= 1
                    # for each column create a column object
                    columnElement =
                        position : @layout.model.get('columncount') - columnCount + 1
                        element : 'Column'
                        className : 12 / @layout.model.get('columncount')
                        elements : []
                    columnElement

                # create a row object
                rowElements =
                    element : 'Row'
                    columncount : @layout.model.get 'columncount'
                    elements : columnElements

                totalOptionsinMcq = @layout.model.get 'optioncount'
                rowNumber = 1
                while totalOptionsinMcq > 0
                    optionsInCurrentRow = if totalOptionsinMcq > @layout.model.get('columncount') then @layout.model.get('columncount')
                    else totalOptionsinMcq

                    @_setColumnClassForRow(rowElements,rowNumber,optionsInCurrentRow)

                    controller = App.request "add:new:element", options.container, 'Row', rowElements

                    @_iterateThruOptions(controller, rowNumber, num) for num in [1..optionsInCurrentRow]
                    totalOptionsinMcq -= @layout.model.get 'columncount'
                    rowNumber += 1


            # change the column class as per the option collection
            _setColumnClassForRow:(rowElements,rowNumber,optionsInCurrentRow)->
                optionNumbers = ((rowNumber-1)*@layout.model.get('columncount')+num for num in [1..@layout.model.get('columncount')])
                classRemaining = 12
                _.each optionNumbers, (optionNumber,index)=>
                    if @layout.model.get('options').at(optionNumber-1)
                        classRemaining -= @layout.model.get('options').at(optionNumber-1).get 'class'
                        rowElements.elements[index].className = @layout.model.get('options').at(optionNumber-1).get 'class'
                    else

                        rowElements.elements[index].className = Math.floor classRemaining/(@layout.model.get('columncount')-optionsInCurrentRow)
                        classRemaining -= Math.floor classRemaining/(@layout.model.get('columncount')-optionsInCurrentRow)
                        optionsInCurrentRow++

            #for each option in current row
            _iterateThruOptions : (controller, rowNumber, index)->
                columnCount = @layout.model.get 'columncount'
                optionNumber = (rowNumber - 1) * @layout.model.get('columncount') + index
                idx = index - 1
                container = controller.layout.elementRegion.currentView.$el.children().eq(idx)
                #                @_addMcqOption(container,@layout.model.get('options').get(optionNumber) )

                # set the option number for current option
                $(container).attr 'data-option', optionNumber


                optionElements =
                    element : 'Row'
                    columncount : 1
                    elements : [
                        position : 1
                        element : 'Column'
                        className : 12
                        elements : []
                    ]

                optionRowController = App.request "add:new:element", container, 'Row', optionElements

                optionRowContainer = optionRowController.layout.elementRegion.currentView.$el.children().eq(0)

                @_fillOptionRowWithElements optionRowContainer,optionNumber



            # add the option checkbox and pre add the elements
            _fillOptionRowWithElements: (optionRowContainer,optionNumber)->
                @_addMcqOption(optionRowContainer, @layout.model.get('options').at(optionNumber-1))

#                console.log JSON.stringify @layout.model.get('options').at(optionNumber-1)

                optionNumber = @layout.model.get('options').at(optionNumber-1).get 'optionNo'


                thisOptionElementsArray = @layout.model.get('elements')[optionNumber-1]
#                console.log JSON.stringify thisOptionElementsArray
                _.each thisOptionElementsArray,(ele)->
                    App.request "add:new:element", optionRowContainer, ele.element, ele



            # create an mcq option
            _addMcqOption : (container, model)->
                view = @_getMcqOptionView model
                view.render()
                $(container).removeClass 'empty-column'
                $(container).append(view.$el)
                @listenTo view, 'option:checked', @_optionChecked

                @listenTo view, 'option:unchecked', @_optionUnchecked
                # call show method of view
                view.triggerMethod 'show'
                # call close method on remove of container
                $(container).on 'remove', ->
                    view.triggerMethod 'close'

            # when a checkbox is checked
            _optionChecked : (model)=>
                answerArray = @answerModel.get 'answer'
                if not @layout.model.get('multiple') and answerArray.length
                    @answerModel.set 'answer', [model.get('optionNo')]
                    console.log 'in check'
                    @view.$el.find('input:checkbox').prop 'checked', false
                    @view.$el.find('input:checkbox').parent().css('background-position', '0px 0px')
                    @view.$el.find("input#option-#{model.get('optionNo')}").prop 'checked', true
                    @view.$el.find("input#option-#{model.get('optionNo')}").parent().css('background-position',
                      '0px -26px')

                else
                    answerArray.push model.get('optionNo')
                answerArray.sort()
                console.log @answerModel.get('answer')

            # when a checkbox is unchecked
            _optionUnchecked : (model)=>
                answerArray = @answerModel.get('answer')
                indexToRemove = $.inArray model.get('optionNo'), answerArray
                answerArray.splice indexToRemove, 1
                console.log @answerModel.get('answer')


            _getMcqOptionView : (model)->
                new Mcq.Views.McqOptionView
                    model : model






					
