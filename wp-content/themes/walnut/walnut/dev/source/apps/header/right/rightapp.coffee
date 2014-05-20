define ['app'
        'controllers/region-controller'
        'text!apps/header/right/templates/right.html'], (App, RegionController, rightTpl)->
    App.module "RightHeaderApp.Controller", (Controller, App)->
        class Controller.RightHeaderController extends RegionController

            initialize: ->
                @view = view = @_getRightHeaderView()

                @show view

                @listenTo @view, "user:logout": ->
                    $.post AJAXURL + '?action=logout_user',
                    (response) =>
                        if response.error
                            console.log response
                        else
                            usermodel = App.request "get:user:model"
                            usermodel.clear()
                            App.vent.trigger "show:login"


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

