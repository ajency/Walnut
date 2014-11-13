define ['app'
        'apps/content-creator/content-builder/element/controller'
        'apps/content-creator/content-builder/elements/mcq/views'], (App, Element)->
    App.module "ContentCreator.ContentBuilder.Element.Mcq", (Mcq, App, Backbone, Marionette, $, _)->
        class Mcq.Controller extends Element.Controller

            initialize : (options)->

                # set default values for model
                _.defaults options.modelData,
                    element : 'Mcq'
                    optioncount : 4
                    columncount : 3
                    options : [
                        { optionNo : 1 , class : 4 }
                        { optionNo : 2 , class : 4 }
                        { optionNo : 3 , class : 4 }
                        { optionNo : 4 , class : 4 }
                    ]
                    elements : []
                    marks : 1
                    multiple : false
                    correct_answer : [3]
                    complete : false

                super(options)

                @layout.model.on 'change:columncount', @_changeColumnCount

                @layout.model.on 'change:optioncount', @_changeOptionCount

                @layout.model.on 'change:multiple', @_changeMultipleAnswers


            renderElement : =>
                optionsObj = @layout.model.get 'options'

                @_parseOptions optionsObj

                optionCollection = App.request "create:new:option:collection", optionsObj
                @layout.model.set 'options', optionCollection

                console.log @layout.model


                # get the view
                @view = @_getMcqView()

                # on show of the view
                # and on the view event show the property box
                @listenTo @view, "show show:this:mcq:properties", (options)=>
                    App.execute "show:question:properties",
                        model : @layout.model

                # listen to event from the view to create the row structure
                @listenTo @view, "create:row:structure", @createRowStructure

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

            createRowStructure : (options)->
                columnCount = parseInt(@layout.model.get('columncount') ) + 1
                columnElements = while columnCount -= 1
                    console.log columnCount
                    columnElement =
                        position : @layout.model.get('columncount') - columnCount + 1
                        element : 'Column'
                        className : 12 / @layout.model.get('columncount')
                        elements : []
                    columnElement

                rowElements =
                    element : 'Row'
                    columncount : @layout.model.get 'columncount'
                    elements : columnElements
                console.log rowElements
                totalOptionsinMcq = @layout.model.get 'optioncount'
                rowNumber = 1
                while totalOptionsinMcq > 0
                    optionsInCurrentRow = if totalOptionsinMcq > @layout.model.get('columncount') then @layout.model.get('columncount')
                    else totalOptionsinMcq

                    @_setColumnClassForRow(rowElements,rowNumber,optionsInCurrentRow)

                    console.log rowElements

                    controller = App.request "add:new:element", options.container, 'Row',null, rowElements

                    @_iterateThruOptions(controller, rowNumber, num) for num in [1..optionsInCurrentRow]
                    totalOptionsinMcq -= @layout.model.get 'columncount'
                    rowNumber += 1

                @view.triggerMethod 'pre:tick:answers'

            # change the column class as per the option collection
            _setColumnClassForRow:(rowElements,rowNumber,optionsInCurrentRow)->
                optionNumbers = ((rowNumber-1)*@layout.model.get('columncount')+num for num in [1..@layout.model.get('columncount')])
                classRemaining = 12
                _.each optionNumbers, (optionNumber,index)=>
                    if @layout.model.get('options').get(optionNumber)
                        classRemaining -= @layout.model.get('options').get(optionNumber).get 'class'
                        rowElements.elements[index].className = @layout.model.get('options').get(optionNumber).get 'class'
                    else

                        rowElements.elements[index].className = Math.floor classRemaining/(@layout.model.get('columncount')-optionsInCurrentRow)
                        classRemaining -= Math.floor classRemaining/(@layout.model.get('columncount')-optionsInCurrentRow)
                        optionsInCurrentRow++



            _iterateThruOptions : (controller, rowNumber, index)->
                columnCount = @layout.model.get 'columncount'
                optionNumber = (rowNumber - 1) * @layout.model.get('columncount') + index
                idx = index - 1
                container = controller.layout.elementRegion.currentView.$el.children().eq(idx)
                console.log container
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
                optionRowController = App.request "add:new:element", container, 'Row',null, optionElements

                optionRowContainer = optionRowController.layout.elementRegion.currentView.$el.children().eq(0)

                @_fillOptionRowWithElements optionRowContainer,optionNumber



            # add the option checkbox and pre add the elements
            _fillOptionRowWithElements: (optionRowContainer,optionNumber)->
                @_addMcqOption(optionRowContainer, @layout.model.get('options').get(optionNumber))

#                console.log JSON.stringify @layout.model.get('elements')

                if not @layout.model.get('elements')[optionNumber-1]?
                    @layout.model.get('elements')[optionNumber-1] = [{element : 'Text'}]

                thisOptionElementsArray = @layout.model.get('elements')[optionNumber-1]
#                console.log JSON.stringify thisOptionElementsArray
                _.each thisOptionElementsArray,(ele)->
                    App.request "add:new:element", optionRowContainer, ele.element,null, ele


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

            _getMcqOptionView : (model)->
                new Mcq.Views.McqOptionView
                    model : model


            # when a checkbox is checked
            _optionChecked: (model)=>
                correctAnswerArray = @layout.model.get('correct_answer')
                if not @layout.model.get('multiple') and correctAnswerArray.length
                    @layout.model.set 'correct_answer', [parseInt(model.get('optionNo'))]
                    console.log 'in check'
                    # @renderElement()
                    # @layout.elementRegion.show @view
                    @view.triggerMethod "update:tick"

                else
                    correctAnswerArray.push parseInt(model.get('optionNo'))
                correctAnswerArray.sort()
                console.log @layout.model.get('correct_answer')

            # when a checkbox is unchecked
            _optionUnchecked: (model)=>
                correctAnswerArray = @layout.model.get('correct_answer')
                indexToRemove = $.inArray model.get('optionNo'), correctAnswerArray
                correctAnswerArray.splice indexToRemove, 1
                console.log @layout.model.get('correct_answer')



            # on change of optionNo attribute in the model
            # change the number of options
            _changeOptionCount: (model, newOptionCount)=>
                numberOfColumns = model.get 'columncount'

                oldOptionCount = model.previous 'optioncount'

                @_getAllOptionElements()

                # if greater then previous then add option
                if oldOptionCount < newOptionCount
                    until oldOptionCount is newOptionCount
                        oldOptionCount++
                        model.get('options').push
                            optionNo: oldOptionCount
                # else remove options
                if oldOptionCount > newOptionCount
                    until oldOptionCount is newOptionCount
                        model.get('elements').pop()
                        optionRemoved = model.get('options').pop()

                        model.set 'correct_answer',_.without model.get('correct_answer'),optionRemoved.get 'optionNo'
                        oldOptionCount--

                model.get('options').each _.bind @_changeColumnClass, @, numberOfColumns

                # @renderElement()
                @layout.elementRegion.show @view

            # function for change of mi=ultiple answers
            _changeMultipleAnswers: (model, multiple)=>
                if not multiple
                    model.set 'correct_answer', []
                    @_getAllOptionElements()
                    # @renderElement()
                    @layout.elementRegion.show @view
#                    @view.triggerMethod "update:tick"



            _changeColumnCount : (model, numberOfColumns)=>
                model.get('options').each _.bind @_changeColumnClass, @, numberOfColumns
                @_getAllOptionElements()
                # render the mcq element
                @layout.elementRegion.show @view

            # set option width class
            _changeColumnClass: (numberOfColumns, element )->
                element.set 'class', 12 / numberOfColumns

            _getAllOptionElements : ->
                @view.triggerMethod 'get:all:option:elements'

            deleteElement: (model)->
                model.set('options', '')
                delete model.get 'options'

                super model

                App.execute "close:question:properties"



