define ['app'
        'controllers/region-controller'
        'apps/content-creator/element-box/view'

], (App, RegionController)->
    App.module "ContentCreator.ElementBox", (ElementBox, App, Backbone, Marionette, $, _)->
        class ElementBoxController extends RegionController

            initialize: (options)->
                {contentType} = options

                # {eventObj} = options

                # get the main view for the element box
                @view = @_getElementBoxView contentType


                # @listenTo eventObj.vent, "question:dropped", =>
                # 	@view.triggerMethod "question:dropped"

                # @listenTo eventObj.vent, "question:removed", =>
                # 	@view.triggerMethod "question:removed"

                # show the view
                @show @view

            _getElementBoxView: (contentType)->
                new ElementBox.Views.ElementBoxView
                    contentType: contentType


        # create a command handler to start the element box controller
        App.commands.setHandler "show:element:box", (options)->
            new ElementBoxController options

# App.commands.setHandler