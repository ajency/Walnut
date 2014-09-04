define ['app'
        'controllers/region-controller'
        'apps/content-board/element/controller'
        'apps/content-board/view'
        'apps/content-board/elements-loader'
], (App, RegionController)->

    #used for preview of content pieces and taking of quiz/teaching-module
    
    App.module "ContentPreview.ContentBoard", (ContentBoard, App, Backbone, Marionette, $, _)->
        class ContentBoard.Controller extends RegionController

            answerWreqrObject = null
            answerModel       = null

            initialize : (options)->
                {@model,answerWreqrObject, answerModel, @quizModel}=options

                @view = @_getContentBoardView()

                @listenTo @view, "add:new:element", (container, type)->
                    App.request "add:new:element", container, type
                    
                @listenTo @view, "close", => 
                    audioEls = @view.$el.find '.audio'
                    _.each audioEls,(el, ind)->
                        $(el).find '.pause'
                        .trigger 'click'
                        
                @listenTo @view, 'dependencies:fetched', =>
                    fillElements = @startFillingElements()          

                    fillElements.done =>
                        setTimeout ->
                            $('#loading-content').hide()
                            $('#question-area').show()
                        ,2000

                #                triggerOnce = _.once _.bind @triggerShowResponse, @, answerData

                App.commands.setHandler "show:response", (marks, total)=>
                   # console.log "#{marks}   #{total}"
                    @view.triggerMethod 'show:response', parseInt(marks), parseInt(total)

                @show @view,
                    loading : true
                    entities : [@elements]



            _getContentBoardView : =>
                new ContentBoard.Views.ContentBoardView
                    model : @model
                    quizModel: @quizModel

            # start filling elements
            startFillingElements : ()->
                section = @view.model.get 'layout'

                allItemsDeferred =$.Deferred() 

                itemsDeferred=[]
                

                container = $('#myCanvas #question-area')


                _.each section, (element, i)=>

                    itemsDeferred[i]= $.Deferred()
                    nestedItems=[]

                    if element.element is 'Row' or element.element is 'TeacherQuestion'
                        nestedItems[i]= @addNestedElements container, element
                        nestedItems[i].done =>
                            itemsDeferred[i].resolve()

                    else
                        App.request "add:new:element", container, element.element, element
                        itemsDeferred[i].resolve()

                    itemsDeferred[i].promise()

                    $.when(itemsDeferred[0], itemsDeferred[1], itemsDeferred[2]).done =>
                        allItemsDeferred.resolve()

                allItemsDeferred.promise()


            addNestedElements : (container, element)->
                
                defer= $.Deferred()

                controller = App.request "add:new:element", container, element.element, element
                _.each element.elements, (column, index)=>
                    return if not column.elements
                    container = controller.layout.elementRegion.currentView.$el.children().eq(index)

                    nestedDef= []
                    _.each column.elements, (ele, i)=>
                        
                        nestedDef[i]=$.Deferred()

                        if ele.element is 'Row'
                            addedElement = @addNestedElements $(container), ele
                            addedElement.done =>
                                nestedDef[i].resolve()
                        else
                            App.request "add:new:element", container, ele.element, ele
                            nestedDef[i].resolve()

                    $.when(nestedDef[0], nestedDef[1]).done =>
                        defer.resolve()

                defer.promise()



            API =
            # add a new element to the builder region
                addNewElement : (container, type, modelData)=>
                    console.log type

                    new ContentBoard.Element[type].Controller
                        container            : container
                        modelData            : modelData
                        answerWreqrObject    : answerWreqrObject
                        answerModel          : answerModel


            App.commands.setHandler 'show:content:board', (options)->
                new ContentBoard.Controller options

            #Request handler for new element
            App.reqres.setHandler "add:new:element", (container, type, modelData = {})->
                API.addNewElement container, type, modelData
