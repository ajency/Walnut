define ['app'
        'apps/content-preview/content-board/element/controller'
        'apps/content-preview/content-board/elements/sort/view'],
(App, Element)->
    App.module "ContentPreview.ContentBoard.Element.Sort", (Sort, App, Backbone, Marionette, $, _)->
        class Sort.Controller extends Element.Controller

            initialize : (options)->
                {answerWreqrObject,@answerModel} = options

                @answerModel = App.request "create:new:answer" if not @answerModel

                @displayAnswer = true
                
                if answerWreqrObject
                    
                    @displayAnswer = answerWreqrObject.options.displayAnswer
                    
                    answerWreqrObject.setHandler "get:question:answer",=>

                        data=
                            'answerModel': @answerModel
                            'totalMarks' : @layout.model.get('marks')
                            'questionType': 'sort'

                    answerWreqrObject.setHandler "submit:answer",(displayAnswer) =>
                        #if displayAnswer is true, the correct & wrong answers & marks will be displayed
                        #default is true
                        @_submitAnswer @displayAnswer 

                super options



            renderElement : ->
                optionsObj = @layout.model.get 'elements'
                if optionsObj instanceof Backbone.Collection
                    optionsObj = optionsObj.models

                @_parseOptions optionsObj

                # if the object is a collection then keep as it is
                optionsObj = _.shuffle optionsObj

                @optionCollection = App.request "create:new:option:collection", optionsObj
                @layout.model.set 'elements', @optionCollection

                # get the view
                @view = @_getSortView @optionCollection

                App.execute "show:total:marks", @layout.model.get 'marks'

                @listenTo @view, "submit:answer", @_submitAnswer

                
                @listenTo @view, "show",=>
                    if @answerModel.get('status') isnt 'not_attempted'
                        @_submitAnswer() 

                # show the view
                @layout.elementRegion.show @view

            _getSortView : (collection)->
                new Sort.Views.SortView
                    collection : collection
                    sort_model : @layout.model

            _parseOptions : (optionsObj)->
                _.each optionsObj, (option)->
                    option.optionNo = parseInt option.optionNo if option.optionNo?
                    option.marks = parseInt option.marks if option.marks?
                    option.index = parseInt option.index if option.index?



            _submitAnswer :(displayAnswer=true) =>
                @answerModel.set 'marks', @layout.model.get 'marks'
                displayAnswer = Marionette.getOption @, 'displayAnswer'
                @view.$el.find('input#optionNo').each (index, element)=>
                    answerOptionIndex = @optionCollection.get($(element).val()).get('index')
                    @answerModel.get('answer').push answerOptionIndex

                    if answerOptionIndex isnt index + 1
                        @answerModel.set 'marks', 0
                        $(element).parent().addClass 'ansWrong' if displayAnswer
                    else
                        $(element).parent().addClass 'ansRight' if displayAnswer

                App.execute "show:response", @answerModel.get('marks'), @layout.model.get('marks') if displayAnswer

                console.log @answerModel.get('answer').toString()

                if @answerModel.get('marks') is 0
                    @view.triggerMethod 'show:feedback' if displayAnswer
                else
                    @view.triggerMethod 'destroy:sortable'

					

					
