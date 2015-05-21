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

            mixinTemplateHelpers:(data)->
                data = super data
                if IS_STANDALONE_SITE? and IS_STANDALONE_SITE is true
                  if App.request 'current:user:can','sync_site_content'
                    data.syncUrl= SITEURL + '/sync-site-content' 

                data

        # set handlers
        App.commands.setHandler "show:rightheaderapp", (opt = {})->
            new Controller.RightHeaderController opt

