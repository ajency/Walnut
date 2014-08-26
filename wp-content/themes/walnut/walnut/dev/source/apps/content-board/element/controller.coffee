define ['app'
        'controllers/element-controller'
        'apps//content-board/element/views'], (App, ElementController)->
    App.module 'ContentPreview.ContentBoard.Element', (Element, App, Backbone, Marionette, $, _)->

        # Controller class for showing header resion
        class Element.Controller extends ElementController

            # initialize the controller. Get all required entities and show the view
            initialize: (opts)->
                {container, modelData} = opts

                options =
                    bottom_margin: ''
                    top_margin: ''
                    left_margin: ''
                    right_margin: ''

                _.defaults modelData, options

                element = App.request "create:new:element", modelData

                # define the element layout view
                @layout = @_getView element

                @layout.elementRegion.on "show", (view)=>
                    model = Marionette.getOption @layout, 'model'
                    for margin in ['top_margin', 'left_margin', 'right_margin', 'bottom_margin']
                        @layout.setMargin model.get margin


                # add the element to container
                @add @layout, $(container)



            # Get view
            _getView: (elementModel)->

                #console.log 'elementModel'
               # console.log elementModel
                new Element.Views.ElementView
                    model: elementModel




            # remove the element model
            deleteElement: (model)->
                model.destroy
                    wait: true


				