define ['app'
        'controllers/region-controller'
        'apps/content-creator/content-builder/view'
        'apps/content-creator/content-builder/element/controller'
        'apps/content-creator/content-builder/elements-loader'
        'apps/content-creator/content-builder/autosave/controller'],(App,RegionController)->

    App.module "ContentCreator.ContentBuilder", (ContentBuilder, App, Backbone, Marionette, $, _)->

        contentPieceModel = null

        class ContentBuilderController extends RegionController

            initialize : (options)->

                {contentPieceModel} = options


                @view = @_getContentBuilderView contentPieceModel



                @listenTo @view, "add:new:element", (container, type)->
                    App.request "add:new:element", container, type

                @listenTo @view, "dependencies:fetched", =>
                    _.delay =>
                        @startFillingElements()
                    , 400

                @show @view,
                    loading : true

            _getContentBuilderView : (elements)->

                new ContentBuilder.Views.ContentBuilderView
                    model : elements

            _getContainer :->
                @view.$el.find('#myCanvas')




            # start filling elements
            startFillingElements: ()->
                section = @view.model.get 'layout'

                container = @_getContainer()
                _.each section, (element, i)=>
                    if element.element is 'Row' or element.element is 'TeacherQuestion'
                        @addNestedElements container,element
                    else
                        App.request "add:new:element",container,element.element, element


            addNestedElements:(container,element)->
                controller = App.request "add:new:element",container,element.element, element
                _.each element.elements, (column, index)=>
                    return if not column.elements
                    container = controller.layout.elementRegion.currentView.$el.children().eq(index)
                    _.each column.elements,(ele, i)=>
                        if ele.element is 'Row'
                            @addNestedElements $(container),ele
                        else
                            App.request "add:new:element",container,ele.element, ele




        API =
        # add a new element to the builder region
            addNewElement : (container , type, modelData)->
                console.log type

                new ContentBuilder.Element[type].Controller
                    container : container
                    modelData : modelData


            saveQuestion :=>

                autoSave = App.request "autosave:question:layout"
                autoSave.autoSave contentPieceModel


        # create a command handler to start the content builder controller
        App.commands.setHandler "show:content:builder", (options)->
            new ContentBuilderController options

        #Request handler for new element
        App.reqres.setHandler "add:new:element" , (container, type, modelData = {})->
            API.addNewElement container, type, modelData


        App.commands.setHandler "save:question",(contentPieceModel)->
            API.saveQuestion(contentPieceModel)
