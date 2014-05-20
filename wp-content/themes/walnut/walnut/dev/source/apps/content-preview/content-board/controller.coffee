define ['app'
        'controllers/region-controller'
        'apps/content-preview/content-board/element/controller'
        'apps/content-preview/content-board/view'
        'apps/content-preview/content-board/elements-loader'
], (App, RegionController)->
    App.module "ContentPreview.ContentBoard", (ContentBoard, App, Backbone, Marionette, $, _)->
        class ContentBoard.Controller extends RegionController

            initialize: (options)->
                {@model}=options

                answerData =
                    marks: 0
                    total: 0


                @view = @_getContentBoardView()

                @listenTo @view, "add:new:element", (container, type)->
                    App.request "add:new:element", container, type

                @listenTo @view, 'dependencies:fetched', =>
                    @startFillingElements()

                triggerOnce = _.once _.bind @triggerShowResponse, @, answerData

                App.commands.setHandler "show:response", (marks, total)=>
                    answerData.marks += parseInt marks
                    answerData.total += parseInt total
                    triggerOnce()

                @show @view,
                    loading: true
                    entities: [@elements]

            triggerShowResponse: (answerData)=>
                @view.triggerMethod 'show:response', answerData.marks, answerData.total

            _getContentBoardView: =>
                new ContentBoard.Views.ContentBoardView
                    model: @model

            # start filling elements
            startFillingElements: ()->
                section = @view.model.get 'layout'


                container = $('#myCanvas #question-area')
                _.each section, (element, i)=>
                    if element.element is 'Row' or element.element is 'TeacherQuestion'
                        @addNestedElements container, element
                    else
                        App.request "add:new:element", container, element.element, element


                            addNestedElements: (container, element)->
                                controller = App.request "add:new:element", container, element.element, element
                                _.each element.elements, (column, index)=>
                                    return if not column.elements
                                    container = controller.layout.elementRegion.currentView.$el.children().eq(index)
                                    _.each column.elements, (ele, i)=>
                                        if ele.element is 'Row'
                                            @addNestedElements $(container), ele
                                        else
                                            App.request "add:new:element", container, ele.element, ele


            API =
            # add a new element to the builder region
                addNewElement: (container, type, modelData)->
                    console.log type

                    new ContentBoard.Element[type].Controller
                        container: container
                        modelData: modelData


            App.commands.setHandler 'show:content:board', (options)->
                new ContentBoard.Controller options

            #Request handler for new element
            App.reqres.setHandler "add:new:element", (container, type, modelData = {})->
                API.addNewElement container, type, modelData
