define ['app'
        'controllers/region-controller'], (App, RegionController)->

    App.module "DashboardClassProgressApp.Controller", (Controller, App)->

        class Controller.DashboardClassProgressController extends RegionController

            initialize :(opts) ->

                @view= view = @_getClassProgressView()

                @show view,(loading:true)

            _getClassProgressView: ->
                new ClassProgressView()

        class ClassProgressView extends Marionette.ItemView

            template: '<h1 class="text-center muted m-b-20">Coming <span class="bold">Soon</span>...</h1>'

            className: 'animated fadeInUp'



        # set handlers
        App.commands.setHandler "show:dashboard:class:progress:app", (opt = {})->
            new Controller.DashboardClassProgressController opt

