define ['app'
        'controllers/region-controller'
        'text!apps/header/right/templates/right.html'], (App, RegionController, rightTpl)->
    App.module "RightHeaderApp.Controller", (Controller, App)->
        class Controller.RightHeaderController extends RegionController

            initialize: ->
                @view = view = @_getRightHeaderView()

                @show view

                @listenTo @view, "user:logout": ->
                    @region.trigger "user:logout"


            _getRightHeaderView: ->
                new RightHeaderView


        class RightHeaderView extends Marionette.ItemView

            template: rightTpl

            className: 'pull-right'

            events:
                'click #user_logout': ->
                    @trigger "user:logout"

        # set handlers
        App.commands.setHandler "show:rightheaderapp", (opt = {})->
            new Controller.RightHeaderController opt

